'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import Header from '@/components/Header'
import Scene3D from '@/components/Scene3D'
import PlayerList from '@/components/PlayerList'
import ControlsPanel from '@/components/ControlsPanel'

export default function Home() {
  const router = useRouter()
  const { user, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Only run client-side
    if (typeof window === 'undefined') return

    // Handle OAuth callback code if it ends up on the home page
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      
      if (code) {
        // Redirect to the proper callback route
        // Use current origin to maintain the same domain
        window.location.href = `${window.location.origin}/auth/callback?code=${code}`
        return true
      }
      return false
    }

    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url,
        })
      } else {
        router.push('/login')
      }
      setLoading(false)
    }

    // Check for OAuth code first
    handleOAuthCallback().then(() => {
      // Only check user if no OAuth code was found
      if (!new URLSearchParams(window.location.search).get('code')) {
        checkUser()
      }
    })

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, setUser, setLoading])

  useRealtimeSync()

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <div className="h-full w-full pt-16">
        <Scene3D />
        <PlayerList />
        <ControlsPanel />
      </div>
    </div>
  )
}
