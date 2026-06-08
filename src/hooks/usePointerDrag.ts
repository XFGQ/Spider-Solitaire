import { useRef, useState } from 'react'
import type { Card } from '../types/game'
import { canDrop, getMovableRun } from '../engine/rules'
import { useGameStore } from '../store/gameStore'

export interface DragState {
  fromCol: number
  fromIndex: number
  run: Card[]
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

export function usePointerDrag() {
  const [drag, setDrag] = useState<DragState | null>(null)
  const ghostRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const moveCards = useGameStore(s => s.moveCards)

  const onPointerDown = (
    e: React.PointerEvent,
    col: number,
    index: number,
    tableau: Card[][]
  ) => {
    const run = getMovableRun(tableau[col], index)
    if (!run) return
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    isDragging.current = false
    startPos.current = { x: e.clientX, y: e.clientY }

    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startPos.current.x
      const dy = ev.clientY - startPos.current.y
      if (!isDragging.current && Math.hypot(dx, dy) > 6) {
        isDragging.current = true
        setDrag({
          fromCol: col, fromIndex: index, run,
          startX: ev.clientX, startY: ev.clientY,
          offsetX, offsetY,
        })
      }
      if (isDragging.current && ghostRef.current) {
        ghostRef.current.style.transform =
          `translate(${ev.clientX - offsetX}px, ${ev.clientY - offsetY}px)`
      }
    }

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      if (isDragging.current) {
        const el = document.elementFromPoint(ev.clientX, ev.clientY)
        const colEl = el?.closest('[data-col]') as HTMLElement | null
        if (colEl) {
          const toCol = parseInt(colEl.dataset.col!)
          if (!isNaN(toCol) && toCol !== col) {
            moveCards({ fromCol: col, fromIndex: index, toCol })
          }
        }
        setDrag(null)
      } else {
        setDrag(null)
        const best = findBestTarget(col, index, tableau)
        if (best !== null) moveCards({ fromCol: col, fromIndex: index, toCol: best })
      }

      isDragging.current = false
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  return { drag, ghostRef, onPointerDown }
}

function findBestTarget(col: number, index: number, tableau: Card[][]): number | null {
  const run = getMovableRun(tableau[col], index)
  if (!run) return null

  let best: number | null = null
  let bestScore = -1

  for (let t = 0; t < tableau.length; t++) {
    if (t === col) continue
    const target = tableau[t]
    if (!canDrop(run, target)) continue
    if (target.length === 0 && run.length === tableau[col].length) continue

    const top = target[target.length - 1]
    let score = target.length === 0 ? 1 : 2
    if (top?.suit === run[0].suit) score += 2
    if (score > bestScore) { bestScore = score; best = t }
  }

  return best
}
