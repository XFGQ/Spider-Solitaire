
import type { Card, Difficulty, Rank, Suit } from '../types/game'

const ALL_SUITS: Suit[] = ['S', 'H', 'D', 'C']

function suitsByDifficulty(diff: Difficulty): Suit[] {
  if (diff === 1) return Array(8).fill('S')
  if (diff === 2) return [...Array(4).fill('S'), ...Array(4).fill('H')]
  return ALL_SUITS.flatMap(s => [s, s])
}

export function buildDeck(diff: Difficulty): Card[] {
  const suits = suitsByDifficulty(diff)
  let id = 0
  const deck: Card[] = []
  for (const suit of suits)
    for (let rank = 1; rank <= 13; rank++)
      deck.push({ id: `${id++}`, suit, rank: rank as Rank, faceUp: false })
  return deck
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function dealInitial(diff: Difficulty) {
  const deck = shuffle(buildDeck(diff))
  const tableau: Card[][] = Array.from({ length: 10 }, () => [])
  let i = 0
  for (let c = 0; c < 10; c++) {
    const count = c < 4 ? 6 : 5
    for (let k = 0; k < count; k++) tableau[c].push(deck[i++])
    tableau[c][tableau[c].length - 1].faceUp = true
  }
  const stock = deck.slice(i)
  return { tableau, stock }
}