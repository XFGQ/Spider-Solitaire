import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useStatsStore } from '../../store/statsStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useTimer } from '../../hooks/useTimer'
import { useSound } from '../../hooks/useSound'
import { Header } from './Header'
import { Toolbar } from './Toolbar'
import { Board } from '../game/Board'
import { Foundation } from '../game/Foundation'
import { StockPile } from '../game/StockPile'
import { WinModal } from '../ui/WinModal'
import { StatsPanel } from '../ui/StatsModal'
import { Toast } from '../ui/Toast'

export function AppShell() {
  const [toast, setToast] = useState<string | null>(null)
  const [winOpen, setWinOpen] = useState(false)

  const { game, newGame } = useGameStore()
  const recordResult = useStatsStore(s => s.recordResult)
  const difficulty = useSettingsStore(s => s.difficulty)
  const { elapsed, reset: resetTimer } = useTimer(game.status === 'playing')
  const { play } = useSound()

  useKeyboard()

  // Oyun başlangıcı
  useEffect(() => {
    newGame(difficulty)
  }, [])

  // Kazanma
  useEffect(() => {
    if (game.status === 'won') {
      recordResult(difficulty, true, elapsed, game.score)
      setWinOpen(true)
    }
  }, [game.status])

  // Ses efektleri — store değişikliklerini dinle
  useEffect(() => {
    const unsub = useGameStore.subscribe((state, prev) => {
      if (state.game.foundation > prev.game.foundation) play('complete')
      else if (state.game.moves > prev.game.moves) play('place')
      if (state.game.status === 'won' && prev.game.status !== 'won') play('win')
    })
    return unsub
  }, [play])

  const handleNewGame = () => {
    resetTimer()
    setWinOpen(false)
    newGame()
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header elapsed={elapsed} />
      <Toolbar />

      <main className="flex-1 p-3 md:p-4 overflow-x-auto">
        <div className="felt-surface rounded-2xl p-3 md:p-5">
       <div className="flex items-start justify-between mb-3 gap-2">
  <StockPile />
  <Foundation />
</div>
          <Board />
        </div>
      </main>

      <StatsPanel />

      <WinModal
        open={winOpen}
        time={elapsed}
        moves={game.moves}
        score={game.score}
        onNewGame={handleNewGame}
        onClose={() => setWinOpen(false)}
      />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}