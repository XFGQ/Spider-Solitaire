import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useKeyboard() {
  const undo = useGameStore(s => s.undo)
  const showHint = useGameStore(s => s.showHint)
  const dealFromStock = useGameStore(s => s.dealFromStock)
  const newGame = useGameStore(s => s.newGame)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement) return
      if (e.target instanceof HTMLButtonElement) return

      switch (e.key.toLowerCase()) {
        case 'z': if (e.ctrlKey || e.metaKey) undo(); break
        case 'u': undo(); break
        case 'h': showHint(); break
        case 'd': dealFromStock(); break
        case 'n': newGame(); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, showHint, dealFromStock, newGame])
}