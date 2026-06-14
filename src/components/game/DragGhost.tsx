import type { RefObject } from 'react'
import type { DragState } from '../../hooks/usePointerDrag'
import { Card } from './Card'

interface Props {
  drag: DragState
  cardH: number
  ghostRef: RefObject<HTMLDivElement>
}

export function DragGhost({ drag, cardH, ghostRef }: Props) {
  const fanUp = cardH * 0.30

  return (
    <div
      ref={ghostRef}
      className="fixed pointer-events-none z-50"
      style={{
        top: 0,
        left: 0,
        transform: `translate(${drag.initialX - drag.offsetX}px, ${drag.initialY - drag.offsetY}px)`,
      }}
    >
      {drag.run.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          col={drag.fromCol}
          index={drag.fromIndex + i}
          noLayout={true}
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
