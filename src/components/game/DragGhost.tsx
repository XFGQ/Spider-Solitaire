import type { DragState } from '../../hooks/usePointerDrag'
import { getCardH } from '../../utils/cardSize'
import { Card } from './Card'

interface Props {
  drag: DragState
}

export function DragGhost({ drag }: Props) {
  const fanUp = getCardH() * 0.30

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: drag.x - drag.offsetX,
        top: drag.y - drag.offsetY,
      }}
    >
      {drag.run.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          col={drag.fromCol}
          index={drag.fromIndex + i}
          style={{
            top: i * fanUp,
            boxShadow: 'var(--shadow-drag)',
            position: i === 0 ? 'relative' : 'absolute',
          }}
        />
      ))}
    </div>
  )
}