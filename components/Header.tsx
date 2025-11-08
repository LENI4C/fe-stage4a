'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'

export default function Header() {
  const router = useRouter()
  const supabase = createClient()
  const { user, setUser } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10" role="banner">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-white font-bold text-base sm:text-xl">3D</span>
          </motion.div>
          <h1 className="text-lg sm:text-xl font-bold text-white truncate">Multiplayer Builder</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/10" role="status" aria-label="Current user">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
                <span className="text-white/90 text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none" title={user.name || user.email || 'User'}>
                  {user.name || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium text-xs sm:text-sm transition-colors border border-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/80 touch-manipulation"
                aria-label="Log out"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

