import type { ReactNode } from 'react'

export function SectionHeading({
  id,
  eyebrow,
  title,
  action,
}: {
  id: string
  eyebrow: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="inline-block border-3 border-foreground bg-accent px-2 py-0.5 text-xs font-bold uppercase">
          {eyebrow}
        </p>
        <h2 id={id} className="mt-3 font-display text-3xl leading-tight text-balance uppercase md:text-5xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
