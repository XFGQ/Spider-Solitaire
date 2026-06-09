import type{ Card } from '../types/game'
import { canDrop, getMovableRun } from './rules'

export interface Hint {
  fromCol: number
  fromIndex: number
  toCol: number
  score: number
}

export function findBestHint(tableau: Card[][]): Hint | null {
  const candidates: Hint[] = []

  for (let c = 0; c < tableau.length; c++) {
    const col = tableau[c]
    for (let i = 0; i < col.length; i++) {
      const run = getMovableRun(col, i)
      if (!run) continue
      for (let t = 0; t < tableau.length; t++) {
        if (t === c || !canDrop(run, tableau[t])) continue
        let score = 0
        const target = tableau[t]
        if (target.length > 0 && target[target.length - 1].suit === run[0].suit) score += 4
        if (target.length > 0) score += 2
        if (i > 0 && !col[i - 1].faceUp) score += 3  
        if (run.length === col.length && target.length === 0) score -= 2 
        candidates.push({ fromCol: c, fromIndex: i, toCol: t, score })
      }
    }
  }

  if (!candidates.length) return null
  return candidates.sort((a, b) => b.score - a.score)[0]
}