import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSceneStore } from '@/store/useSceneStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { SceneObject, Player } from '@/types'

const COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
]

export function useRealtimeSync() {
  const supabase = createClient()
  const { user } = useAuthStore()
  const { objects, setObjects, addObject, updateObject, removeObject, setPlayers, updatePlayer } = useSceneStore()
  const channelRef = useRef<any>(null)
  const presenceRef = useRef<any>(null)
  const userColorRef = useRef<string>(COLORS[Math.floor(Math.random() * COLORS.length)])

  useEffect(() => {
    if (!user) return

    // Initialize scene from database
    const loadScene = async () => {
      const { data, error } = await supabase
        .from('scene_objects')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error && data) {
        setObjects(data.map((obj: any) => ({
          id: obj.id,
          type: obj.type,
          position: obj.position,
          rotation: obj.rotation,
          scale: obj.scale,
          color: obj.color,
          userId: obj.user_id,
          createdAt: obj.created_at,
        })))
      }
    }

    loadScene()

    // Set up realtime channel for objects
    const channel = supabase
      .channel('scene-objects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scene_objects',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const obj = payload.new as any
            addObject({
              id: obj.id,
              type: obj.type,
              position: obj.position,
              rotation: obj.rotation,
              scale: obj.scale,
              color: obj.color,
              userId: obj.user_id,
              createdAt: obj.created_at,
            })
          } else if (payload.eventType === 'UPDATE') {
            const obj = payload.new as any
            updateObject(obj.id, {
              position: obj.position,
              rotation: obj.rotation,
              scale: obj.scale,
              color: obj.color,
            })
          } else if (payload.eventType === 'DELETE') {
            removeObject(payload.old.id)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    // Set up presence for players
    const presence = supabase
      .channel('players')
      .on('presence', { event: 'sync' }, () => {
        const state = presence.presenceState()
        const players: Player[] = []
        Object.keys(state).forEach((userId) => {
          const presences = state[userId] as any[]
          if (presences && presences.length > 0) {
            const presence = presences[0]
            players.push({
              id: presence.id || userId,
              userId,
              name: presence.name || 'Anonymous',
              color: presence.color || userColorRef.current,
              position: presence.position || [0, 0, 0],
              lastSeen: new Date().toISOString(),
            })
          }
        })
        setPlayers(players)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Player joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Player left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presence.track({
            id: user.id,
            userId: user.id,
            name: user.name || user.email?.split('@')[0] || 'Anonymous',
            color: userColorRef.current,
            position: [0, 0, 0],
            online_at: new Date().toISOString(),
          })
        }
      })

    presenceRef.current = presence

    // Update presence position periodically (simulated - in real app, track camera position)
    const interval = setInterval(() => {
      if (presenceRef.current) {
        presenceRef.current.track({
          id: user.id,
          userId: user.id,
          name: user.name || user.email?.split('@')[0] || 'Anonymous',
          color: userColorRef.current,
          position: [Math.random() * 2 - 1, 0, Math.random() * 2 - 1],
          online_at: new Date().toISOString(),
        })
      }
    }, 5000)

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      if (presenceRef.current) {
        supabase.removeChannel(presenceRef.current)
      }
      clearInterval(interval)
    }
  }, [user, supabase, setObjects, addObject, updateObject, removeObject, setPlayers])
}

