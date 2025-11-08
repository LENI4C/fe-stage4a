'use client'

import { useState } from 'react'
import { useSceneStore } from '@/store/useSceneStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function PlayerList() {
  const { players } = useSceneStore()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-2 sm:left-4 top-20 z-40 w-56 sm:w-64"
    >
      <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-t-xl"
          aria-expanded={isOpen}
          aria-label="Toggle players list"
        >
          <h2 className="text-white font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
            <span>Players ({players.length})</span>
          </h2>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-5 h-5 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <AnimatePresence>
                  {players.map((player) => (
                    <motion.div
                      key={player.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      role="listitem"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: player.color }}
                        aria-label={`${player.name}'s color`}
                      ></div>
                      <span className="text-white/90 text-sm font-medium flex-1 truncate" title={player.name}>
                        {player.name}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {players.length === 0 && (
                  <p className="text-white/50 text-sm text-center py-4" role="status">No other players online</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

