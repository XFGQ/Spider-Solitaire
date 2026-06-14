import type{ Card } from '../types/game'

export function getMovableRun(column: Card[], index: number, freeMode = false): Card[] | null {
  const card = column[index]
  if (!card?.faceUp) return null
  for (let i = index; i < column.length - 1; i++) {
    const a = column[i], b = column[i + 1]
    if (!b.faceUp || a.rank !== b.rank + 1) return null
    if (!freeMode && a.suit !== b.suit) return null
  }
  return column.slice(index)
}

export function canDrop(run: Card[], target: Card[]): boolean {
  if (target.length === 0) return true
  const top = target[target.length - 1]
  return top.faceUp && top.rank === run[0].rank + 1
}

export function findCompletedRun(column: Card[], freeMode = false): number | null {
  if (column.length < 13) return null
  const start = column.length - 13
  const slice = column.slice(start)
  const isComplete =
    slice[0].rank === 13 &&
    slice.every(c => c.faceUp) &&
    slice.every((c, i) => i === 0 || c.rank === slice[i - 1].rank - 1) &&
    (freeMode || slice.every(c => c.suit === slice[0].suit))
  return isComplete ? start : null
}