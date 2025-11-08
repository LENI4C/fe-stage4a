export interface User {
  id: string
  email?: string
  name?: string
  avatar_url?: string
}

export interface SceneObject {
  id: string
  type: 'cube' | 'sphere'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  userId: string
  createdAt: string
}

export interface Player {
  id: string
  userId: string
  name: string
  color: string
  position: [number, number, number]
  lastSeen: string
}

