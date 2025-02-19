import type React from "react"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

const AnimatedCube: React.FC = () => {
  const meshRef = useRef<Mesh>(null!)

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a90e2" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

export default AnimatedCube

