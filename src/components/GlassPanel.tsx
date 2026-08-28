import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

type GlassLevel = 'surface' | 'elevated' | 'modal'

const levelClass: Record<GlassLevel, string> = {
  surface: 'glass',
  elevated: 'glass-elevated',
  modal: 'glass-modal',
}

interface GlassPanelProps extends ComponentPropsWithoutRef<'div'> {
  level?: GlassLevel
}

export default function GlassPanel({ level = 'surface', className, children, ...rest }: GlassPanelProps) {
  return (
    <div className={cn(levelClass[level], className)} {...rest}>
      {children}
    </div>
  )
}
