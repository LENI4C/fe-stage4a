import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useSceneStore } from '@/store/useSceneStore'
import type { SceneObject } from '@/types'

export function useSceneActions() {
  const supabase = createClient()
  const { user } = useAuthStore()
  const { objects, selectedObjectId, setSelectedObjectId } = useSceneStore()

  const addObject = useCallback(
    async (type: 'cube' | 'sphere', position: [number, number, number], color: string) => {
      if (!user) {
        console.error('Cannot add object: user not authenticated')
        return
      }

      // Map to database column names (snake_case)
      const newObject = {
        type,
        position,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color,
        user_id: user.id, // Database uses snake_case
      }

      const { data, error } = await supabase
        .from('scene_objects')
        .insert([newObject])
        .select()
        .single()

      if (error) {
        console.error('Error adding object:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        // Show user-friendly error
        alert(`Failed to add object: ${error.message || 'Unknown error'}`)
      }
      // The realtime subscription will handle adding it to the store
    },
    [user, supabase]
  )

  const updateObject = useCallback(
    async (id: string, updates: Partial<Pick<SceneObject, 'position' | 'rotation' | 'scale' | 'color'>>) => {
      const { error } = await supabase
        .from('scene_objects')
        .update(updates)
        .eq('id', id)

      if (error) {
        console.error('Error updating object:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
      }
    },
    [supabase]
  )

  const deleteObject = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('scene_objects').delete().eq('id', id)

      if (error) {
        console.error('Error deleting object:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        alert(`Failed to delete object: ${error.message || 'Unknown error'}`)
      } else {
        setSelectedObjectId(null)
      }
    },
    [supabase, setSelectedObjectId]
  )

  return {
    addObject,
    updateObject,
    deleteObject,
    selectedObjectId,
    setSelectedObjectId,
  }
}

