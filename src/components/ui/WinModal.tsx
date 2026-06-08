import { useEffect } from 'react'
import { Modal } from './Modal'
import { formatTime } from '../../utils/format'

interface Props {
  open: boolean
  time: number
  moves: number
  score: number
  onNewGame: () => void
  onClose: () => void
}

export function WinModal({ open, time, moves, score, onNewGame, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    // Confetti
    const symbols = ['♠', '♥', '♦', '♣']
    const pieces = Array.from({ length: 60 }).map((_, i) => {
      const el = document.createElement('div')
      el.textContent = symbols[i % 4]
      el.style.cssText = `
        position:fixed; top:-30px; font-size:20px; pointer-events:none; z-index:49;
        left:${Math.random() * 100}vw;
        color:${i % 2 ? 'var(--card-red)' : 'var(--text)'};
        animation: confetti-fall ${2 + Math.random() * 2}s linear ${Math.random() * 0.8}s forwards;
      `
      document.body.appendChild(el)
      return el
    })
    const t = setTimeout(() => pieces.forEach(el => el.remove()), 5000)
    return () => { clearTimeout(t); pieces.forEach(el => el.remove()) }
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          You Won!
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>
          All 8 suits completed
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Time', value: formatTime(time) },
            { label: 'Moves', value: moves },
            { label: 'Score', value: score },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-3"
              style={{ background: 'var(--slot)', border: '1px solid var(--slot-border)' }}>
              <div className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--text-dim)' }}>{label}</div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onNewGame}
            className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>
            New Game
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl font-semibold text-sm transition hover:opacity-70"
            style={{ background: 'var(--slot)', color: 'var(--text)',
              border: '1px solid var(--slot-border)' }}>
            Review
          </button>
        </div>
      </div>
    </Modal>
  )
}