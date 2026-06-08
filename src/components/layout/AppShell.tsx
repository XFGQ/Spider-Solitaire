import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useStatsStore } from '../../store/statsStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useTimer } from '../../hooks/useTimer'
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

  useKeyboard()

  useEffect(() => {
    newGame(difficulty)
  }, [])

  useEffect(() => {
    if (game.status === 'won') {
      recordResult(difficulty, true, elapsed, game.score)
      setWinOpen(true)
    }
  }, [game.status])

  const handleNewGame = () => {
    resetTimer()
    setWinOpen(false)
    newGame()
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header elapsed={elapsed} />
      <Toolbar />

      <main className="flex-1 p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <StockPile />
          <Foundation />
        </div>

        <Board />
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
