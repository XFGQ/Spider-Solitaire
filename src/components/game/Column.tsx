import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { usePointerDrag } from '../../hooks/usePointerDrag'
import { Card } from './Card'
import { DragGhost } from './DragGhost'

interface Props {
  colIndex: number
}

export function Column({ colIndex }: Props) {
  const tableau = useGameStore(s => s.game.tableau)
  const hint = useGameStore(s => s.hint)
  const column = tableau[colIndex]
  const { drag, ghostRef, onPointerDown } = usePointerDrag()
  const [cardH, setCardH] = useState(120)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const w = ref.current?.offsetWidth ?? 72
      setCardH(w / 0.69)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const fanDown = cardH * 0.13
  const fanUp = cardH * 0.30

  let y = 0
  const positions: number[] = []
  column.forEach(card => {
    positions.push(y)
    y += card.faceUp ? fanUp : fanDown
  })
  const colHeight = y + cardH
  const isDraggingFromHere = drag?.fromCol === colIndex

  return (
    <>
      <div
        ref={ref}
        data-col={colIndex}
        className="relative flex-shrink-0"
        style={{
          width: 'var(--card-w)',
          height: colHeight,
          minHeight: 'calc(var(--card-h) * 2.5)',
        }}
      >
        {/* Boş slot */}
        <div
          className="absolute rounded-lg"
          style={{
            width: 'var(--card-w)',
            height: 'var(--card-h)',
            background: 'var(--slot)',
            border: '1.5px dashed var(--slot-border)',
          }}
        />

        {column.map((card, i) => {
          const isDragging =
            isDraggingFromHere && drag !== null && i >= drag.fromIndex

          return (
            <Card
              key={card.id}
              card={card}
              col={colIndex}
              index={i}
              isDragging={isDragging}
              isHint={hint?.fromCol === colIndex && hint?.fromIndex === i}
              style={{ top: positions[i] }}
              onPointerDown={
                card.faceUp
                  ? e => onPointerDown(e, colIndex, i, tableau)
                  : undefined
              }
            />
          )
        })}
      </div>

      {isDraggingFromHere && drag && (
        <DragGhost drag={drag} cardH={cardH} ghostRef={ghostRef} />
      )}
    </>
  )
}