import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AllStats, Difficulty, StatsEntry } from '../types/game'

interface StatsStore {
  stats: AllStats
  recordResult: (diff: Difficulty, won: boolean, time: number, score: number) => void
  reset: () => void
}

const empty = (): StatsEntry => ({ played: 0, won: 0, bestTime: null, bestScore: 0 })

const defaultStats = (): AllStats => ({ 1: empty(), 2: empty(), 4: empty() })

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      stats: defaultStats(),

      recordResult: (diff, won, time, score) =>
        set(s => {
          const e = s.stats[diff]
          e.played++
          if (won) {
            e.won++
            if (e.bestTime === null || time < e.bestTime) e.bestTime = time
            if (score > e.bestScore) e.bestScore = score
          }
        }),

      reset: () => set({ stats: defaultStats() }),
    }),
    { name: 'spider-stats' }
  )
)