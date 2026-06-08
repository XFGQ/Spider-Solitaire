import { useStatsStore } from '../../store/statsStore'
import { useSettingsStore } from '../../store/settingsStore'
import { Modal } from './Modal'
import { formatPercent, formatTime } from '../../utils/format'
import type { Difficulty } from '../../types/game'

interface Props {
  open: boolean
  onClose: () => void
}

const DIFF_LABEL: Record<Difficulty, string> = { 1: '1 Suit', 2: '2 Suits', 4: '4 Suits' }

export function StatsModal({ open, onClose }: Props) {
  const stats = useStatsStore(s => s.stats)
  const reset = useStatsStore(s => s.reset)
  const difficulty = useSettingsStore(s => s.difficulty)
  const s = stats[difficulty]

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
        Statistics
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>
        {DIFF_LABEL[difficulty]} mode
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Played', value: s.played },
          { label: 'Won', value: s.won },
          { label: 'Win Rate', value: formatPercent(s.won, s.played) },
          { label: 'Best Time', value: s.bestTime != null ? formatTime(s.bestTime) : '—' },
          { label: 'Best Score', value: s.bestScore || '—' },
          { label: 'Lost', value: s.played - s.won },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-3"
            style={{ background: 'var(--slot)', border: '1px solid var(--slot-border)' }}>
            <div className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--text-dim)' }}>{label}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm
          transition-colors duration-200 hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
          Close
        </button>
        <button onClick={reset} className="px-4 py-2.5 rounded-xl font-semibold text-sm
          transition-colors duration-200 hover:opacity-70"
          style={{ background: 'var(--slot)', color: 'var(--text-dim)',
            border: '1px solid var(--slot-border)' }}>
          Reset
        </button>
      </div>
    </Modal>
  )
}