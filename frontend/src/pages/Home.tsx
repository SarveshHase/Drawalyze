import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout, selectUserData } from "@/store/features/authSlice"
import { colors } from "@/constants"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ColorSwatch, Slider, Alert } from "@mantine/core"
import { Menu, Eraser, PenLine, Save, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import "@mantine/core/styles.css"
import authService from "@/appwrite/auth"
import storageService from "@/appwrite/storage"
import SaveImageModal from "@/components/SaveImageModal"
import SavedImagesPanel from "@/components/SavedImagesPanel"
import ResultsModal from "@/components/ResultsModal"

// Type declarations
declare const Image: {
  new(): HTMLImageElement;
  prototype: HTMLImageElement;
};

// Interface for analysis response
interface Response {
  expr: string
  result: string
  assign: boolean
}

// CSS for custom cursors
const cursorCSS = `
  .pen-cursor {
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z'/></svg>") 0 24, auto;
  }

  .eraser-cursor {
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white'><path d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21'/></svg>") 0 24, auto;
  }
`

const Home: React.FC = () => {
  // Canvas and drawing state
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("rgb(255, 255, 255)")
  const [reset, setReset] = useState(false)
  const [isEraser, setIsEraser] = useState(false)
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [previousStrokeWidth, setPreviousStrokeWidth] = useState(3)

  // UI state
  const [showTools, setShowTools] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedImages, setShowSavedImages] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)

  // Analysis results state
  const [responses, setResponses] = useState<Response[]>([])
  const [showResults, setShowResults] = useState(false)

  // Router and Redux state
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectUserData)

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.lineCap = "round"
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = color
  }, [])

  // Handle canvas reset
  useEffect(() => {
    if (!reset) return
    resetCanvas()
    setReset(false)
  }, [reset])

  // Handle window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      ctx.putImageData(imageData, 0, 0)
      ctx.lineCap = "round"
      ctx.lineWidth = strokeWidth
    }
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [strokeWidth])

  // Update stroke width
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineWidth = strokeWidth
  }, [strokeWidth])

  // Add custom cursor styles
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = cursorCSS
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Alert utility function
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertMessage({ type, message })
    setTimeout(() => setAlertMessage(null), 3000)
  }

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setIsDrawing(true)

    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over"
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over"
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // Touch drawing handlers
  const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top)
    setIsDrawing(true)

    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over"
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color
  }

  const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()

    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top)
    ctx.stroke()
  }

  // Canvas operations
  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Tool handlers
  const handlePenClick = () => {
    if (isEraser) {
      setPreviousStrokeWidth(strokeWidth)
    }
    setIsEraser(false)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.globalCompositeOperation = "source-over"
    ctx.strokeStyle = color
    setStrokeWidth(previousStrokeWidth)
  }

  const handleEraserClick = () => {
    if (!isEraser) {
      setPreviousStrokeWidth(strokeWidth)
    }
    setIsEraser(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.globalCompositeOperation = "destination-out"
    ctx.strokeStyle = "rgba(0,0,0,1)"
    setStrokeWidth(100)
  }

  // Analysis handler
  const sendData = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsLoading(true)
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_URL}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: {},
        },
      })

      setResponses(response.data)
      setShowResults(true)
    } catch (error) {
      console.error("Error calculating:", error)
      showAlert('error', "Failed to analyze. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Auth handler
  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      showAlert('error', "Logout failed. Please try again.")
    }
  }

  // Results handlers
  const handleNewDrawing = () => {
    setShowResults(false)
    setReset(true)
  }

  const canvasClassName = `fixed inset-0 w-full h-full bg-gray-900 ${isEraser ? "eraser-cursor" : "pen-cursor"}`

  return (
    <div className="fixed inset-0 md:overflow-hidden bg-gray-900 touch-none">
      {/* Alert Component */}
      {alertMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <Alert
            variant="filled"
            color={alertMessage.type === 'success' ? 'green' : 'red'}
            title={alertMessage.type === 'success' ? 'Success' : 'Error'}
            icon={alertMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            withCloseButton
            onClose={() => setAlertMessage(null)}
          >
            {alertMessage.message}
          </Alert>
        </div>
      )}

      {/* Nav Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-800/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-white font-semibold">Drawalyze</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {userData?.name}</span>
            <div className="hidden md:flex items-center gap-2">
              <Button
                onClick={() => setShowSaveModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Drawing
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Panel - Desktop */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 hidden md:block">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                onClick={handlePenClick}
                variant={!isEraser ? "default" : "outline"}
                className={`h-10 w-10 p-2 ${!isEraser ? "bg-blue-500 text-white" : "text-gray-300"}`}
              >
                <PenLine className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleEraserClick}
                variant={isEraser ? "default" : "outline"}
                className={`h-10 w-10 p-2 ${isEraser ? "bg-blue-500 text-white" : "text-gray-300"}`}
              >
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex gap-1">
              {colors.map((swatchColor: string) => (
                <ColorSwatch
                  key={swatchColor}
                  color={swatchColor}
                  onClick={() => {
                    setColor(swatchColor)
                    setIsEraser(false)
                  }}
                  style={{
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                    border: color === swatchColor ? "2px solid white" : "none",
                  }}
                  className="rounded-full transition-all hover:scale-110"
                />
              ))}
            </div>

            <div className="w-32">
              <Slider
                value={strokeWidth}
                onChange={setStrokeWidth}
                min={1}
                max={isEraser ? 100 : 20}
                label="Stroke Width"
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setReset(true)} variant="destructive" className="px-4">
                Clear
              </Button>
              <Button
                onClick={sendData}
                variant="default"
                className="px-4 bg-blue-500 hover:bg-blue-600 relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Analyze</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tools Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <Button onClick={() => setShowTools(!showTools)} className="h-12 w-12 rounded-full bg-blue-500 p-0">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Tools Panel */}
      {showTools && (
        <div className="fixed bottom-20 right-4 z-30 md:hidden">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg flex flex-col gap-4">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handlePenClick}
                variant={!isEraser ? "default" : "outline"}
                className={`h-10 w-10 p-2 ${!isEraser ? "bg-blue-500 text-white" : "text-gray-300"}`}
              >
                <PenLine className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleEraserClick}
                variant={isEraser ? "default" : "outline"}
                className={`h-10 w-10 p-2 ${isEraser ? "bg-blue-500 text-white" : "text-gray-300"}`}
              >
                <Eraser className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-1">
              {colors.map((swatchColor: string) => (
                <ColorSwatch
                  key={swatchColor}
                  color={swatchColor}
                  onClick={() => {
                    setColor(swatchColor)
                    setIsEraser(false)
                  }}
                  style={{
                    cursor: "pointer",
                    width: "24px",
                    height: "24px",
                    border: color === swatchColor ? "2px solid white" : "none",
                  }}
                  className="rounded-full transition-all hover:scale-110"
                />
              ))}
            </div>

            <div className="w-full">
              <Slider
                value={strokeWidth}
                onChange={setStrokeWidth}
                min={1}
                max={isEraser ? 100 : 20}
                label="Stroke Width"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button onClick={() => setReset(true)} variant="destructive" className="flex-1">
                  Clear
                </Button>
                <Button
                  onClick={sendData}
                  variant="default"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="opacity-0">Analyze</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSaveModal(true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        responses={responses}
        onDrawNew={handleNewDrawing}
      />

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className={`${canvasClassName} touch-none`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onTouchStart={startTouchDrawing}
        onTouchMove={touchDraw}
        onTouchEnd={stopDrawing}
      />

      {/* Save Image Modal */}
      <SaveImageModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        isLoading={isSaving}
        onSave={async (title, description) => {
          try {
            setIsSaving(true)
            const canvas = canvasRef.current
            if (!canvas || !userData) return

            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) resolve(blob)
              }, "image/png")
            })

            const file = new File([blob], "drawing.png", { type: "image/png" })
            const uploadResponse = await storageService.uploadImage(file)

            await storageService.saveDrawingMetadata({
              userId: userData.userId,
              fileId: uploadResponse.$id,
              title,
              description,
            })

            setShowSaveModal(false)
            showAlert('success', 'Drawing saved successfully!')
          } catch (error) {
            console.error("Error saving drawing:", error)
            showAlert('error', "Failed to save drawing. Please try again.")
          } finally {
            setIsSaving(false)
          }
        }}
      />

      {/* Saved Images Panel */}
      <SavedImagesPanel 
        isOpen={showSavedImages} 
        onClose={() => setShowSavedImages(false)}
        onImageSelect={async (imageId) => {
          try {
            setIsLoading(true);
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create a new image
            const image = new Image();
            image.src = storageService.getFilePreview(imageId).toString();

            // Wait for image to load then draw it
            await new Promise<boolean>((resolve, reject) => {
              image.onload = () => {
                // Calculate scaling to fit canvas while maintaining aspect ratio
                const scale = Math.min(
                  canvas.width / image.width,
                  canvas.height / image.height
                );
                
                // Calculate centered position
                const x = (canvas.width - image.width * scale) / 2;
                const y = (canvas.height - image.height * scale) / 2;

                // Draw the image
                ctx.drawImage(
                  image,
                  x,
                  y,
                  image.width * scale,
                  image.height * scale
                );
                resolve(true);
              };
              image.onerror = reject;
            });

            // Close the panel and show success message
            setShowSavedImages(false);
            showAlert('success', 'Drawing loaded successfully!');
          } catch (error) {
            console.error("Error loading image:", error);
            showAlert('error', 'Failed to load drawing. Please try again.');
          } finally {
            setIsLoading(false);
          }
        }}
      />

      {/* Show Saved Button */}
      <Button
        onClick={() => setShowSavedImages(!showSavedImages)}
        className="fixed bottom-4 left-4 z-40 bg-blue-500 hover:bg-blue-600 text-white"
      >
        <ImageIcon className="h-5 w-5 mr-2" />
        {showSavedImages ? "Hide" : "Show"} Saved
      </Button>
    </div>
  )
}

export default Home
