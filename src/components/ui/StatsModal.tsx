import { useStatsStore } from '../../store/statsStore'
import { formatPercent, formatTime } from '../../utils/format'
import type { Difficulty } from '../../types/game'

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 1, label: '1 Suit' },
  { value: 2, label: '2 Suits' },
  { value: 4, label: '4 Suits' },
]

export function StatsPanel() {
  const stats = useStatsStore(s => s.stats)
  const reset = useStatsStore(s => s.reset)

  return (
    <div
      className="w-full"
      style={{
        background: 'var(--panel)',
        borderTop: '1px solid var(--panel-border)',
      }}
    >
      <div className="w-full max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
            Statistics
          </span>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-70"
            style={{
              background: 'var(--slot)',
              color: 'var(--text-dim)',
              border: '1px solid var(--slot-border)',
            }}
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {DIFFICULTIES.map(({ value, label }) => {
            const s = stats[value]
            return (
              <div
                key={value}
                className="rounded-xl p-4"
                style={{
                  background: 'var(--slot)',
                  border: '1px solid var(--slot-border)',
                }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                  style={{
                    color: 'var(--accent)',
                    borderBottom: '1px solid var(--slot-border)',
                  }}
                >
                  {label}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Played',     value: s.played },
                    { label: 'Won',        value: s.won },
                    { label: 'Lost',       value: s.played - s.won },
                    { label: 'Win Rate',   value: formatPercent(s.won, s.played) },
                    { label: 'Best Time',  value: s.bestTime != null ? formatTime(s.bestTime) : '—' },
                    { label: 'Best Score', value: s.bestScore || '—' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                        {row.label}
                      </span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
