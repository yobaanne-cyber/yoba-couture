import { cn } from '@/lib/cn'

interface ReferenceLabelProps {
  reference: string
  className?: string
}

/* Élément signature du site (§9.4) : la référence-étiquette, en monospace
   or sur un bandeau de verre — vocabulaire commun entre client et atelier. */
export default function ReferenceLabel({ reference, className }: ReferenceLabelProps) {
  return (
    <span
      className={cn(
        'glass inline-flex items-center rounded-full px-3 py-1 font-mono text-tag tracking-wide text-or-fil',
        className,
      )}
    >
      {reference}
    </span>
  )
}
