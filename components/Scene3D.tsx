'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Sky,
  Environment,
  ContactShadows,
  Grid,
  Text,
  Html,
} from '@react-three/drei'
import * as THREE from 'three'
import { useSceneStore } from '@/store/useSceneStore'
import { useSceneActions } from '@/hooks/useSceneActions'
import type { SceneObject } from '@/types'

function SceneObject({ obj }: { obj: SceneObject }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectedObjectId, setSelectedObjectId } = useSceneStore()
  const isSelected = selectedObjectId === obj.id

  // Animate rotation and floating
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = obj.position[1] + Math.sin(state.clock.elapsedTime + obj.id.charCodeAt(0)) * 0.1
    }
  })

  const geometry = obj.type === 'cube' ? (
    <boxGeometry args={[1, 1, 1]} />
  ) : (
    <sphereGeometry args={[0.5, 32, 32]} />
  )

  return (
    <group>
      <mesh
        ref={meshRef}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedObjectId(isSelected ? null : obj.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        {geometry}
        <meshStandardMaterial
          color={obj.color}
          emissive={obj.color}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {isSelected && (
        <mesh position={obj.position} rotation={obj.rotation} scale={obj.scale.map(s => s * 1.05) as [number, number, number]}>
          {geometry}
          <meshStandardMaterial
            color={obj.color}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  )
}

function PlayerIndicator({ player }: { player: { userId: string; name: string; color: string; position: [number, number, number] } }) {
  return (
    <group position={[player.position[0], player.position[1] + 2, player.position[2]]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color={player.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {player.name}
      </Text>
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshStandardMaterial color={player.color} emissive={player.color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function ClickPlane({ onAddObject }: { onAddObject: (position: [number, number, number]) => void }) {
  const { raycaster, camera, pointer } = useThree()
  const planeRef = useRef<THREE.Mesh>(null)

  const handleClick = (event: any) => {
    event.stopPropagation()
    if (!planeRef.current) return

    const [x, y] = pointer
    const mouse = new THREE.Vector2(x, y)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeRef.current)

    if (intersects.length > 0) {
      const point = intersects[0].point
      onAddObject([point.x, 0, point.z])
    }
  }

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={handleClick}
      visible={false}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

function SceneContent({ onAddObject }: { onAddObject: (position: [number, number, number]) => void }) {
  const { objects, players } = useSceneStore()
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#ec4899" />

      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        turbidity={10}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <Environment preset="night" />

      <Grid
        renderOrder={-1}
        position={[0, -0.01, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#374151"
        fadeDistance={30}
        fadeStrength={1}
      />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4.5}
        resolution={256}
      />

      <ClickPlane onAddObject={onAddObject} />

      {objects.map((obj) => (
        <SceneObject key={obj.id} obj={obj} />
      ))}

      {players.map((player) => (
        <PlayerIndicator key={player.userId} player={player} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

export default function Scene3D() {
  const { addObject } = useSceneActions()

  const handleAddObject = (position: [number, number, number]) => {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const color = colors[Math.floor(Math.random() * colors.length)]
    addObject('cube', position, color)
  }

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900"
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={75} position={[5, 5, 5]} />
          <SceneContent onAddObject={handleAddObject} />
        </Suspense>
      </Canvas>
    </div>
  )
}

