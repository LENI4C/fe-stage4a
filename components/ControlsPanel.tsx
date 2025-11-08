'use client'

import { useState } from 'react'
import { useSceneActions } from '@/hooks/useSceneActions'
import { useSceneStore } from '@/store/useSceneStore'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function ControlsPanel() {
  const { addObject, deleteObject, selectedObjectId, setSelectedObjectId } = useSceneActions()
  const { objects } = useSceneStore()
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)

  const handleAddCube = () => {
    const position: [number, number, number] = [
      (Math.random() - 0.5) * 5,
      0,
      (Math.random() - 0.5) * 5,
    ]
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const color = colors[Math.floor(Math.random() * colors.length)]
    addObject('cube', position, color)
  }

  const handleAddSphere = () => {
    const position: [number, number, number] = [
      (Math.random() - 0.5) * 5,
      0,
      (Math.random() - 0.5) * 5,
    ]
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const color = colors[Math.floor(Math.random() * colors.length)]
    addObject('sphere', position, color)
  }

  const handleDelete = () => {
    if (selectedObjectId) {
      deleteObject(selectedObjectId)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Scene is already persisted via realtime, but we can add a manual save trigger
    // In a real app, you might want to save a snapshot or version
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-40 max-w-4xl mx-auto"
    >
      <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-white/10 p-2 sm:p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={handleAddCube}
            className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm sm:text-base hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black/80 touch-manipulation"
            aria-label="Add cube to scene"
          >
            <span className="hidden sm:inline">+ </span>Cube
          </button>
          <button
            onClick={handleAddSphere}
            className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black/80 touch-manipulation"
            aria-label="Add sphere to scene"
          >
            <span className="hidden sm:inline">+ </span>Sphere
          </button>
          <div className="hidden sm:block w-px h-8 bg-white/20"></div>
          <button
            onClick={handleDelete}
            disabled={!selectedObjectId}
            className="px-3 sm:px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/80 touch-manipulation"
            aria-label="Delete selected object"
            aria-disabled={!selectedObjectId}
          >
            Delete
          </button>
          <div className="hidden sm:block w-px h-8 bg-white/20"></div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 sm:px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold text-sm sm:text-base transition-all border border-green-600/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black/80 disabled:opacity-50 touch-manipulation"
            aria-label="Save scene"
            aria-busy={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <div className="text-white/60 text-xs sm:text-sm px-2 text-center sm:text-left w-full sm:w-auto mt-1 sm:mt-0" role="status" aria-live="polite">
            {objects.length} {objects.length === 1 ? 'object' : 'objects'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

