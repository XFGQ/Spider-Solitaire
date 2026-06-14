import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Difficulty, Theme } from '../types/game'

interface SettingsStore {
  theme: Theme
  difficulty: Difficulty
  sound: boolean
  freeMode: boolean
  setTheme: (t: Theme) => void
  setDifficulty: (d: Difficulty) => void
  toggleSound: () => void
  toggleFreeMode: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      difficulty: 2,
      sound: true,
      freeMode: false,
      setTheme: (theme) => set({ theme }),
      setDifficulty: (difficulty) => set({ difficulty }),
      toggleSound: () => set(s => ({ sound: !s.sound })),
      toggleFreeMode: () => set(s => ({ freeMode: !s.freeMode })),
    }),
    { name: 'spider-settings' }
  )
)