import { useGameStore } from '../../store/gameStore'

export function StockPile() {
  const stock = useGameStore(s => s.game.stock)
  const tableau = useGameStore(s => s.game.tableau)
  const dealFromStock = useGameStore(s => s.dealFromStock)
  const dealsLeft = Math.floor(stock.length / 10)
  const hasEmpty = tableau.some(c => c.length === 0)

  return (
    <button
      onClick={dealFromStock}
      disabled={stock.length === 0 || hasEmpty}
      className="relative flex-shrink-0 rounded-lg transition-all duration-200
                 disabled:opacity-40 disabled:cursor-not-allowed
                 hover:scale-105 active:scale-95"
      style={{
        width: 'var(--card-w)',
        height: 'var(--card-h)',
      }}
      title={hasEmpty ? 'Cannot deal with empty columns' : `${dealsLeft} deals left`}
    >
      {/* Yığın efekti */}
      {[8, 4, 0].map((offset, i) => (
        <div
          key={i}
          className="card-back absolute rounded-lg"
          style={{
            width: 'var(--card-w)',
            height: 'var(--card-h)',
            top: -offset,
            left: offset * 0.3,
            opacity: stock.length === 0 ? 0 : 1,
          }}
        />
      ))}
      {/* Kalan deal sayısı */}
      {dealsLeft > 0 && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center
                     justify-center text-xs font-bold z-10"
          style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
        >
          {dealsLeft}
        </div>
      )}
    </button>
  )
}