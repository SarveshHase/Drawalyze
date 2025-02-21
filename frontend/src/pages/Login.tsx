"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import authService from "@/appwrite/auth"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/features/authSlice"
import AnimatedCube from "@/components/AnimatedCube"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await authService.login({ email, password })

      const userData = await authService.getCurrentUser()
      if (!userData?.emailVerification) {
        await authService.logout()
        setError("Please verify your email before logging in.")
        return
      }

      if (userData) {
        dispatch(
          login({
            email: userData.email,
            name: userData.name,
            userId: userData.$id,
            emailVerified: userData.emailVerification,
          }),
        )
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-blue-900 md:relative md:min-h-screen flex items-center justify-center">
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-lg shadow-2xl w-[90%] max-w-md border border-blue-500/30 flex flex-col items-center">
        <div className="w-full h-48 mb-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <AnimatedCube />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </Suspense>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <Button
            type="submit"
            className={`w-full text-white py-2 px-4 rounded-md ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} transition duration-200`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
