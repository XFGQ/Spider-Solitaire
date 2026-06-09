import type { DragState } from '../../hooks/usePointerDrag'
import { Card } from './Card'

interface Props {
  drag: DragState
  cardH: number
}

export function DragGhost({ drag, cardH }: Props) {
  const fanUp = cardH * 0.30

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
            position: 'absolute',
            top: i * fanUp,
            left: 0,
            boxShadow: 'var(--shadow-drag)',
          }}
        />
      ))}
    </div>
  )
}