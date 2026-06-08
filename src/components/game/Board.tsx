import { LayoutGroup } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { Column } from './Column'

export function Board() {
  const tableau = useGameStore(s => s.game.tableau)

  return (
    <LayoutGroup>
      <div
        className="flex gap-[var(--col-gap)] overflow-x-auto pb-4"
        style={{ alignItems: 'flex-start' }}
      >
        {tableau.map((_, i) => (
          <Column key={i} colIndex={i} />
        ))}
      </div>
    </LayoutGroup>
  )
}