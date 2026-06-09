import { useEffect, useState } from 'react'

interface Props {
  message: string
  onDone: () => void
}

export function Toast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3
                 rounded-xl font-semibold text-sm z-50 pointer-events-none
                 transition-all duration-300 backdrop-blur-md"
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        color: 'var(--text)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      }}
    >
      {message}
    </div>
  )
}