import { useState } from 'react'
import type { Card } from '../types/game'
import { getMovableRun, canDrop } from '../engine/rules'
import { useGameStore } from '../store/gameStore'

export interface DragState {
  fromCol: number
  fromIndex: number
  run: Card[]
  x: number
  y: number
  offsetX: number
  offsetY: number
}

export function usePointerDrag() {
  const [drag, setDrag] = useState<DragState | null>(null)
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
    let moved = false
    const startX = e.clientX
    const startY = e.clientY

    const dragState: DragState = {
      fromCol: col,
      fromIndex: index,
      run,
      x: e.clientX,
      y: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    setDrag(dragState)

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!moved && Math.hypot(dx, dy) > 8) moved = true
      if (moved) {
        setDrag(d => (d ? { ...d, x: ev.clientX, y: ev.clientY } : null))
      }
    }

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      const currentTableau = useGameStore.getState().game.tableau

      if (moved) {
        const toCol = columnAtPoint(ev.clientX, ev.clientY)
        if (toCol !== null && toCol !== col && canDrop(run, currentTableau[toCol])) {
          moveCards({ fromCol: col, fromIndex: index, toCol })
        }
      } else {
        // tap → otomatik en iyi hedefe taşı
        const toCol = bestTarget(run, col, currentTableau)
        if (toCol !== null) {
          moveCards({ fromCol: col, fromIndex: index, toCol })
        }
      }

      setDrag(null)  // ghost'u her durumda temizle
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return { drag, onPointerDown }
}

/* Verilen ekran noktasındaki kolonu bul — koordinat bazlı (mobilde güvenilir) */
function columnAtPoint(x: number, y: number): number | null {
  const cols = document.querySelectorAll<HTMLElement>('[data-col]')
  let best: number | null = null
  let bestDist = Infinity
  cols.forEach(el => {
    const r = el.getBoundingClientRect()
    // dikey olarak kolon hizasında mıyız (biraz tolerans)
    if (y < r.top - 40 || y > r.bottom + 200) return
    const cx = (r.left + r.right) / 2
    const dist = Math.abs(x - cx)
    if (x >= r.left - 10 && x <= r.right + 10 && dist < bestDist) {
      bestDist = dist
      best = parseInt(el.dataset.col!)
    }
  })
  // hiçbiri yatay aralıkta değilse en yakın merkeze düş
  if (best === null) {
    cols.forEach(el => {
      const r = el.getBoundingClientRect()
      const cx = (r.left + r.right) / 2
      const dist = Math.abs(x - cx)
      if (dist < bestDist) { bestDist = dist; best = parseInt(el.dataset.col!) }
    })
  }
  return best
}

/* Tap için en iyi hedef kolonu seç */
function bestTarget(run: Card[], fromCol: number, tableau: Card[][]): number | null {
  let best: number | null = null
  let bestScore = -1
  for (let t = 0; t < tableau.length; t++) {
    if (t === fromCol || !canDrop(run, tableau[t])) continue
    const target = tableau[t]
    let score: number
    if (target.length === 0) {
      if (run.length === tableau[fromCol].length) continue // tüm kolonu boşa taşıma
      score = 1
    } else {
      const top = target[target.length - 1]
      score = top.suit === run[0].suit ? 4 : 2  // aynı takım önceliği
    }
    if (score > bestScore) { bestScore = score; best = t }
  }
  return best
}