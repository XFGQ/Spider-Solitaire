import { useGameStore } from '../../store/gameStore'
import { formatTime } from '../../utils/format'

interface Props {
  elapsed: number
}

export function Header({ elapsed }: Props) {
  const { moves, score, foundation } = useGameStore(s => s.game)

  return (
    <header
      className="flex items-center gap-4 flex-wrap px-6 py-3 sticky top-0 z-30 backdrop-blur-md"
      style={{
        background: 'var(--toolbar-bg)',
        borderBottom: '1px solid var(--panel-border)',
      }}
    >
      <div className="mr-auto flex items-center gap-3">
        <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Spider <span style={{ color: 'var(--accent)' }}>Solitaire</span>
        </span>
        <span className="text-lg opacity-70">♠♥♦♣</span>
      </div>

      {[
        { label: 'Time',  value: formatTime(elapsed) },
        { label: 'Moves', value: moves },
        { label: 'Score', value: score },
        { label: 'Done',  value: `${foundation}/8` },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center min-w-[52px]">
          <span className="text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--text-dim)' }}>{label}</span>
          <span className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--text)' }}>{value}</span>
        </div>
      ))}
    </header>
  )
}
