export function getCardH(): number {
  const w = Math.max(52, Math.min(96, window.innerWidth * 0.085))
  return w / 0.69
}
