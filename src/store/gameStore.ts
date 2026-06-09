import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Card, Difficulty, GameState, Move } from '../types/game'
import type { Hint } from '../engine/hints'
import { dealInitial } from '../engine/deck'
import { canDrop, findCompletedRun, getMovableRun } from '../engine/rules'
import { findBestHint } from '../engine/hints'

interface GameStore {
  game: GameState
  history: GameState[]
  hint: Hint | null
  difficulty: Difficulty
  seedTableau: Card[][]
  seedStock: Card[]

  newGame: (diff?: Difficulty) => void
  restartGame: () => void
  moveCards: (move: Move) => void
  dealFromStock: () => void
  undo: () => void
  showHint: () => void
  clearHint: () => void
}

const emptyGame = (): GameState => ({
  tableau: [],
  stock: [],
  foundation: 0,
  score: 500,
  moves: 0,
  status: 'idle',
})

function applyCompletions(tableau: Card[][]): { tableau: Card[][], count: number } {
  let count = 0
  const next = tableau.map(col => {
    let c = [...col]
    let found = true
    while (found) {
      const idx = findCompletedRun(c)
      if (idx !== null) { c.splice(idx, 13); count++; if (c.length && !c[c.length - 1].faceUp) c[c.length - 1].faceUp = true }
      else found = false
    }
    return c
  })
  return { tableau: next, count }
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    game: emptyGame(),
    history: [],
    hint: null,
    difficulty: 2,
    seedTableau: [],
    seedStock: [],

    newGame: (diff) => {
      const d = diff ?? get().difficulty
      const { tableau, stock } = dealInitial(d)
      set(s => {
        s.difficulty = d
        s.seedTableau = tableau.map(col => col.map(c => ({ ...c })))
        s.seedStock = stock.map(c => ({ ...c }))
        s.game = { tableau, stock, foundation: 0, score: 500, moves: 0, status: 'playing' }
        s.history = []
        s.hint = null
      })
    },

    restartGame: () => {
      const { seedTableau, seedStock } = get()
      set(s => {
        s.game = {
          tableau: seedTableau.map(col =>
            col.map((c, i) => ({ ...c, faceUp: i === col.length - 1 }))
          ),
          stock: seedStock.map(c => ({ ...c, faceUp: false })),
          foundation: 0, score: 500, moves: 0, status: 'playing',
        }
        s.history = []
        s.hint = null
      })
    },

    moveCards: (move) => {
      const { game } = get()
      const run = getMovableRun(game.tableau[move.fromCol], move.fromIndex)
      if (!run || !canDrop(run, game.tableau[move.toCol])) return

      set(s => {
        s.history.push(JSON.parse(JSON.stringify(s.game)))
        if (s.history.length > 200) s.history.shift()

        const moved = s.game.tableau[move.fromCol].splice(move.fromIndex)
        s.game.tableau[move.toCol].push(...moved)

        const src = s.game.tableau[move.fromCol]
        if (src.length && !src[src.length - 1].faceUp)
          src[src.length - 1].faceUp = true

        s.game.moves++
        s.game.score = Math.max(0, s.game.score - 1)
        s.hint = null
      })

      const { tableau, count } = applyCompletions(get().game.tableau)
      if (count > 0) {
        set(s => {
          s.game.tableau = tableau
          s.game.foundation += count
          s.game.score += count * 100
          if (s.game.foundation >= 8) s.game.status = 'won'
        })
      }
    },

    dealFromStock: () => {
      const { game } = get()
      if (game.stock.length === 0) return
      if (game.tableau.some(c => c.length === 0)) return

      set(s => {
        s.history.push(JSON.parse(JSON.stringify(s.game)))
        for (let i = 0; i < 10; i++) {
          const card = s.game.stock.pop()!
          card.faceUp = true
          s.game.tableau[i].push(card)
        }
        s.game.moves++
        s.hint = null
      })

      const { tableau, count } = applyCompletions(get().game.tableau)
      if (count > 0) {
        set(s => {
          s.game.tableau = tableau
          s.game.foundation += count
          s.game.score += count * 100
          if (s.game.foundation >= 8) s.game.status = 'won'
        })
      }
    },

    undo: () => {
      set(s => {
        if (!s.history.length) return
        s.game = s.history.pop()!
        s.hint = null
      })
    },

    showHint: () => {
      const hint = findBestHint(get().game.tableau)
      set(s => { s.hint = hint })
    },

    clearHint: () => set(s => { s.hint = null }),
  }))
)
