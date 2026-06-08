import { AnimatePresence, motion } from 'framer-motion'
import { useStatsStore } from '../../store/statsStore'
import { formatPercent, formatTime } from '../../utils/format'
import type { Difficulty } from '../../types/game'

interface Props {
  open: boolean
  onClose: () => void
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 1, label: '1 Suit' },
  { value: 2, label: '2 Suits' },
  { value: 4, label: '4 Suits' },
]

export function StatsModal({ open, onClose }: Props) {
  const stats = useStatsStore(s => s.stats)
  const reset = useStatsStore(s => s.reset)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            style={{
              background: 'var(--panel)',
              borderTop: '1px solid var(--panel-border)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="w-full max-w-4xl mx-auto px-6 py-5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                  Statistics
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { reset() }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-70"
                    style={{
                      background: 'var(--slot)',
                      color: 'var(--text-dim)',
                      border: '1px solid var(--slot-border)',
                    }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg
                               transition hover:opacity-70"
                    style={{ background: 'var(--slot)', color: 'var(--text)' }}
                  >
                    ✕
                  </button>
                </div>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
