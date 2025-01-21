import React, { useEffect, useState } from 'react'
import { colors } from '../../constants.ts'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { ColorSwatch } from '@mantine/core'
import { Menu, X } from 'lucide-react'
import '@mantine/core/styles.css'

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface GeneratedResult {
    expression: string;
    answer: string;
}

function Home() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState('rgb(255, 255, 255)')
    const [reset, setReset] = useState(false)
    const [result, setResult] = useState<GeneratedResult>()
    const [dictOfVars, setDictOfVars] = useState({})
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (!reset) {
            return;
        }

        resetCanvas();
        setReset(false);
    }, [reset])

    useEffect(() => {
        const updateCanvasSize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.style.backgroundColor = 'black';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - canvas.offsetTop;
            ctx.lineCap = 'round';
            ctx.lineWidth = 3;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);


    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        canvas.style.backgroundColor = 'black';
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return;
        }

        ctx.beginPath()
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    }

    const stopDrawing = () => {
        setIsDrawing(false);
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return;
        }

        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    }

    const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        setIsDrawing(true);
    };

    const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.strokeStyle = color;
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.stroke();
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };


    const sendData = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const response = await axios({
            method: 'post',
            url: `${import.meta.env.VITE_BACKEND_URL}/calculate`,
            data: {
                image: canvas.toDataURL('image/png'),
                dict_of_vars: dictOfVars,
            }
        });

        const resp = response.data as Response;
        console.log("Response: ", resp);

    }

    return (
        <>
            {/* Desktop View */}
            <div className="fixed top-4 left-0 right-0 px-4 z-30 hidden md:block">
                <div className="flex items-center justify-between gap-4 w-full max-w-4xl mx-auto bg-black/50 p-4 rounded-lg">
                    <Button
                        onClick={() => setReset(true)}
                        variant="default"
                        className="z-30 bg-white text-black hover:bg-gray-100"
                    >
                        Reset
                    </Button>

                    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                        {colors.map((swatchColor: string) => (
                            <ColorSwatch
                                key={swatchColor}
                                color={swatchColor}
                                onClick={() => setColor(swatchColor)}
                                style={{
                                    cursor: 'pointer',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%'
                                }}
                                className="hover:ring-2 ring-white transition-all"
                            />
                        ))}
                    </div>

                    <Button
                        onClick={sendData}
                        variant="default"
                        className="z-30 bg-white text-black hover:bg-gray-100"
                    >
                        Calculate
                    </Button>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {/* Hamburger Button */}
                <Button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    variant="default"
                    className="fixed top-4 right-4 z-40 bg-white/80 text-blue-900 font-bold hover:bg-gray-100 h-8 w-8 p-1"
                > {
                        isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />
                    }
                </Button>

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-x-0 top-0 shadow-md bg-gradient-to-b from-gray-300/70 to-gray-700/30 z-30 ease-in duration-300 backdrop-blur-lg ${isMobileMenuOpen ? 'h-48 right-0' : 'h-0 right-[-100%]'
                        } overflow-hidden`}
                >
                    <div className="flex flex-col items-center px-4 pt-16 pb-4 gap-4">
                        <div className="flex justify-between w-full max-w-sm">
                            <Button
                                onClick={() => {
                                    setReset(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                variant="default"
                                className="bg-white text-black hover:bg-gray-100 h-8 text-sm px-4"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={() => {
                                    sendData();
                                    setIsMobileMenuOpen(false);
                                }}
                                variant="default"
                                className="bg-white text-black hover:bg-gray-100 h-8 text-sm px-4"
                            >
                                Calculate
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm px-4">
                            {colors.map((swatchColor: string) => (
                                <ColorSwatch
                                    key={swatchColor}
                                    color={swatchColor}
                                    onClick={() => {
                                        setColor(swatchColor);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%'
                                    }}
                                    className="hover:ring-2 ring-offset-2 ring-offset-black ring-white transition-all"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                id='canvas'
                className='absolute top-0 left-0 w-full h-full z-10'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseOut={stopDrawing}
                onMouseUp={stopDrawing}
                onTouchStart={startTouchDrawing}
                onTouchMove={touchDraw}
                onTouchEnd={stopDrawing}
            />
        </>
    )
}

export default Home