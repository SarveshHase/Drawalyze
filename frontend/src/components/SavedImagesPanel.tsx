import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import storageService from "@/appwrite/storage"
import { useAppSelector } from "@/store/hooks"
import { selectUserData } from "@/store/features/authSlice"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedImage {
  $id: string
  title: string
  description: string
  drawingImage: string
}

interface SavedImagesPanelProps {
  isOpen: boolean
  onClose: () => void
}

const SavedImagesPanel: React.FC<SavedImagesPanelProps> = ({ isOpen, onClose }) => {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([])
  const userData = useAppSelector(selectUserData)

  useEffect(() => {
    const fetchSavedImages = async () => {
      if (userData?.userId) {
        try {
          const images = await storageService.getUserSavedImages(userData.userId)
          setSavedImages(images)
        } catch (error) {
          console.error("Error fetching saved images:", error)
        }
      }
    }

    if (isOpen) {
      fetchSavedImages()
    }
  }, [isOpen, userData?.userId])

  const panelVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1 },
  }

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-gray-800/95 backdrop-blur-sm shadow-lg z-50 overflow-y-auto"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={panelVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Saved Drawings</h2>
          <Button onClick={onClose} variant="ghost" className="text-gray-300 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedImages.map((image) => (
            <div key={image.$id} className="bg-gray-700/50 rounded-lg overflow-hidden shadow-md">
              <img
                src={storageService.getFilePreview(image.drawingImage).toString() || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{image.title}</h3>
                <p className="text-gray-300 text-sm h-12 line-clamp-2">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
        {savedImages.length === 0 && <p className="text-gray-400 text-center mt-8">No saved drawings yet.</p>}
      </div>
    </motion.div>
  )
}

export default SavedImagesPanel
