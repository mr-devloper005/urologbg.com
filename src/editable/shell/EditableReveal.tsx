'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'ul' | 'li' | 'span'
  className?: string
  style?: CSSProperties
  delayMs?: number
  once?: boolean
}

export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  style,
  delayMs = 60,
  once = true,
}: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            if (once) io.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  const Tag = as as keyof React.JSX.IntrinsicElements
  const cls = mounted ? `editable-reveal ${visible ? 'is-visible' : ''} ${className}` : className
  const mergedStyle: CSSProperties = {
    transitionDelay: mounted ? `${index * delayMs}ms` : undefined,
    ...style,
  }
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={cls} style={mergedStyle}>
      {children}
    </Tag>
  )
}
