import { useEffect, useRef, useState } from 'react'

export function useTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (ref.current) clearInterval(ref.current)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [active])

  const reset = () => setElapsed(0)

  const formatted = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`

  return { elapsed, formatted, reset }
}