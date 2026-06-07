import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useSettingsStore } from '../store/settingsStore'

const SOUNDS = {
  place: '/sounds/card-place.mp3',
  flip:  '/sounds/card-flip.mp3',
  complete: '/sounds/sequence-complete.mp3',
  win:   '/sounds/win.mp3',
} as const

type SoundKey = keyof typeof SOUNDS

export function useSound() {
  const sound = useSettingsStore(s => s.sound)
  const howls = useRef<Partial<Record<SoundKey, Howl>>>({})

  useEffect(() => {
    const entries = Object.entries(SOUNDS) as [SoundKey, string][]
    entries.forEach(([key, src]) => {
      howls.current[key] = new Howl({ src: [src], volume: 0.5 })
    })
    return () => {
      Object.values(howls.current).forEach(h => h?.unload())
    }
  }, [])

  const play = (key: SoundKey) => {
    if (!sound) return
    howls.current[key]?.play()
  }

  return { play }
}