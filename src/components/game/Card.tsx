import { motion } from 'framer-motion'
import type { Card as CardType } from '../../types/game'

const SUIT_SYMBOL: Record<string, string> = {
  S: '♠', H: '♥', D: '♦', C: '♣'
}
const RANK_LABEL: Record<number, string> = {
  1: 'A', 11: 'J', 12: 'Q', 13: 'K'
}
const RED_SUITS = new Set(['H', 'D'])

interface Props {
  card: CardType
  col: number
  index: number
  isHint?: boolean
  isDragging?: boolean
  style?: React.CSSProperties
  onPointerDown?: (e: React.PointerEvent) => void
}

export function Card({
  card, col, index, isHint, isDragging, style, onPointerDown
}: Props) {
  const rank = RANK_LABEL[card.rank] ?? String(card.rank)
  const suit = SUIT_SYMBOL[card.suit]
  const isRed = RED_SUITS.has(card.suit)

  if (!card.faceUp) {
    return (
      <motion.div
        layoutId={card.id}
        data-col={col}
        data-index={index}
        className="card-back absolute rounded-lg"
        style={{ width: 'var(--card-w)', height: 'var(--card-h)', ...style }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      />
    )
  }

  return (
    <motion.div
      layoutId={card.id}
      data-col={col}
      data-index={index}
      className={[
        'card-face absolute rounded-lg cursor-grab select-none',
        isRed ? 'text-[var(--card-red)]' : 'text-[var(--card-black)]',
        isHint ? 'hint-card' : '',
        isDragging ? 'opacity-0' : '',
      ].join(' ')}
      style={{
        width: 'var(--card-w)',
        height: 'var(--card-h)',
        boxShadow: 'var(--shadow)',
        ...style,
      }}
      onPointerDown={onPointerDown}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
    >
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className="font-bold" style={{ fontSize: 'calc(var(--card-w) * 0.27)' }}>{rank}</span>
        <span style={{ fontSize: 'calc(var(--card-w) * 0.22)' }}>{suit}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: 'calc(var(--card-w) * 0.46)' }}>
        {suit}
      </div>
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className="font-bold" style={{ fontSize: 'calc(var(--card-w) * 0.27)' }}>{rank}</span>
        <span style={{ fontSize: 'calc(var(--card-w) * 0.22)' }}>{suit}</span>
      </div>
    </motion.div>
  )
}
