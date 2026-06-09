export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatPercent(won: number, played: number): string {
  if (played === 0) return '0%'
  return `${Math.round((won / played) * 100)}%`
}