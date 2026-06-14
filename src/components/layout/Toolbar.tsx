import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { Theme, Difficulty } from '../../types/game'

const THEMES: { value: Theme; icon: string }[] = [
  { value: 'dark',  icon: '🌙' },
  { value: 'light', icon: '☀️' },
  { value: 'blue',  icon: '🌊' },
]

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 1, label: '1 Suit' },
  { value: 2, label: '2 Suits' },
  { value: 4, label: '4 Suits' },
]

export function Toolbar() {
  const { newGame, restartGame, undo, showHint, dealFromStock } = useGameStore()
  const history = useGameStore(s => s.history)
  const stock = useGameStore(s => s.game.stock)
  const { theme, setTheme, difficulty, setDifficulty, freeMode, toggleFreeMode } = useSettingsStore()

  const btnBase = `inline-flex items-center gap-2 px-3 py-2 rounded-xl
    text-sm font-semibold transition-all duration-150
    hover:-translate-y-0.5 active:scale-95 disabled:opacity-40
    disabled:cursor-not-allowed disabled:transform-none`

  const btnStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--panel-border)',
    color: 'var(--text)',
  }

  const btnPrimary = {
    background: 'var(--accent)',
    border: 'none',
    color: 'var(--accent-ink)',
  }

  const btnFree = {
    background: freeMode ? '#f59e0b' : 'var(--panel)',
    border: freeMode ? 'none' : '1px solid var(--panel-border)',
    color: freeMode ? '#1c1917' : 'var(--text)',
  }

  return (
    <div
      className="flex items-center gap-2 flex-wrap px-6 py-2.5"
      style={{ background: 'var(--toolbar-bg)', borderBottom: '1px solid var(--panel-border)' }}
    >
      <button className={btnBase} style={btnPrimary} onClick={() => newGame()}>
        ↺ New Game
      </button>

      <button className={btnBase} style={btnStyle} onClick={restartGame}>
        ⟳ Restart
      </button>

      <button className={btnBase} style={btnStyle} onClick={undo} disabled={history.length === 0}>
        ↩ Undo
      </button>

      <button className={btnBase} style={btnStyle} onClick={showHint}>
        💡 Hint
      </button>

      <button className={btnBase} style={btnStyle} onClick={dealFromStock} disabled={stock.length === 0}>
        🃏 Deal ({Math.floor(stock.length / 10)})
      </button>

      <button className={btnBase} style={btnFree} onClick={toggleFreeMode}>
        ⚡ Kuralsız {freeMode ? '(Açık)' : '(Kapalı)'}
      </button>

      <select
        value={difficulty}
        onChange={e => { setDifficulty(+e.target.value as Difficulty); newGame(+e.target.value as Difficulty) }}
        className="px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer"
        style={{ background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--panel-border)' }}
      >
        {DIFFICULTIES.map(d => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>

      <div
        className="ml-auto flex gap-1 p-1 rounded-xl"
        style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}
      >
        {THEMES.map(t => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="w-8 h-8 rounded-lg text-sm transition-all duration-150"
            style={{
              background: theme === t.value ? 'var(--accent)' : 'transparent',
              border: theme === t.value ? 'none' : '1px solid transparent',
            }}
          >
            {t.icon}
          </button>
        ))}
      </div>
    </div>
  )
}
