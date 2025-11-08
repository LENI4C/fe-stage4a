import { create } from 'zustand'
import type { SceneObject, Player } from '@/types'

interface SceneState {
  objects: SceneObject[]
  players: Player[]
  selectedObjectId: string | null
  setObjects: (objects: SceneObject[]) => void
  addObject: (object: SceneObject) => void
  updateObject: (id: string, updates: Partial<SceneObject>) => void
  removeObject: (id: string) => void
  setPlayers: (players: Player[]) => void
  updatePlayer: (userId: string, updates: Partial<Player>) => void
  setSelectedObjectId: (id: string | null) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  players: [],
  selectedObjectId: null,
  setObjects: (objects) => set({ objects }),
  addObject: (object) => set((state) => ({ objects: [...state.objects, object] })),
  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    })),
  removeObject: (id) => set((state) => ({ objects: state.objects.filter((obj) => obj.id !== id) })),
  setPlayers: (players) => set({ players }),
  updatePlayer: (userId, updates) =>
    set((state) => ({
      players: state.players.map((p) => (p.userId === userId ? { ...p, ...updates } : p)),
    })),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
}))

