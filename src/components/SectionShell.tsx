import type { ReactNode } from 'react'
import Reveal from './Reveal'

export default function SectionShell({
  id,
  number,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  number: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="relative scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-xs text-muted">{number}</span>
            <span className="h-px w-10 bg-primary/50" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 className="section-title max-w-3xl">{title}</h2>
          {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{intro}</p>}
        </Reveal>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  )
}
