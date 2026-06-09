import { useGameStore } from '../../store/gameStore'

export function Foundation() {
  const foundation = useGameStore(s => s.game.foundation)

  return (
    <div className="flex gap-2 justify-end mb-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg flex items-center justify-center text-xl"
          style={{
            width: 'calc(var(--card-w) * 0.7)',
            height: 'calc(var(--card-h) * 0.4)',
            background: i < foundation ? 'var(--accent)' : 'var(--slot)',
            border: '1.5px solid var(--slot-border)',
            color: i < foundation ? 'var(--accent-ink)' : 'var(--text-dim)',
            fontSize: 'calc(var(--card-w) * 0.35)',
            transition: 'all 0.3s ease',
          }}
        >
          {i < foundation ? '♠' : ''}
        </div>
      ))}
    </div>
  )
}