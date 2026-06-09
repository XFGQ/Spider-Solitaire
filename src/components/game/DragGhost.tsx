import { useEffect, type RefObject } from 'react'
import type { DragState } from '../../hooks/usePointerDrag'
import { getCardH } from '../../utils/cardSize'
import { Card } from './Card'

interface Props {
  drag: DragState
  ghostRef: RefObject<HTMLDivElement | null>
}

export function DragGhost({ drag, ghostRef }: Props) {
  const fanUp = getCardH() * 0.30

  useEffect(() => {
    if (ghostRef.current) {
      ghostRef.current.style.transform =
        `translate(${drag.startX - drag.offsetX}px, ${drag.startY - drag.offsetY}px)`
    }
  }, [])

  return (
    <div
      ref={ghostRef}
      className="fixed pointer-events-none z-50"
      style={{ left: 0, top: 0, willChange: 'transform' }}
    >
      {drag.run.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          col={drag.fromCol}
          index={drag.fromIndex + i}
          noLayout
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
