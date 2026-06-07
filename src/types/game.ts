export type Suit = 'S' | 'H' | 'D' | 'C'
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
export type Difficulty = 1 | 2 | 4
export type Theme = 'dark' | 'light' | 'blue'

export interface Card {
  id: string
  suit: Suit
  rank: Rank
  faceUp: boolean
}

export interface GameState {
  tableau: Card[][]
  stock: Card[]
  foundation: number
  score: number
  moves: number
  status: 'idle' | 'playing' | 'won'
}

export interface Move {
  fromCol: number
  fromIndex: number
  toCol: number
}

export interface StatsEntry {
  played: number
  won: number
  bestTime: number | null
  bestScore: number
}

export type AllStats = Record<Difficulty, StatsEntry>