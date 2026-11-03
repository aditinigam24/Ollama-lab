import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cloud, HardDrive, MousePointerClick, ChevronDown, Lightbulb } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import { COMPARE, CONCEPTS } from '../data/concepts'
import type { Concept } from '../data/concepts'

/* ---------- tiny animated illustrations ---------- */
function Illustration({ id }: { id: string }) {
  const common = 'h-20 w-full'
  switch (id) {
    case 'ai':
      return (
        <svg viewBox="0 0 120 60" className={common} aria-hidden>
          {[
            [15, 15], [15, 45], [60, 10], [60, 30], [60, 50], [105, 30],
          ].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="4" fill="#B6FF4A" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }} />
          ))}
          {[
            [15, 15, 60, 10], [15, 15, 60, 30], [15, 45, 60, 30], [15, 45, 60, 50], [60, 10, 105, 30], [60, 30, 105, 30], [60, 50, 105, 30],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00D68F" strokeOpacity="0.4" />
          ))}
        </svg>
      )
    case 'genai':
      return (
        <svg viewBox="0 0 120 60" className={common} aria-hidden>
          {[
            [30, 30, 10], [60, 20, 7], [85, 38, 9], [95, 15, 5],
          ].map(([x, y, s], i) => (
            <motion.path
              key={i}
              d={`M${x} ${y - s} L${x + s * 0.3} ${y - s * 0.3} L${x + s} ${y} L${x + s * 0.3} ${y + s * 0.3} L${x} ${y + s} L${x - s * 0.3} ${y + s * 0.3} L${x - s} ${y} L${x - s * 0.3} ${y - s * 0.3} Z`}
              fill="#B6FF4A"
              animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4], rotate: [0, 20, 0] }}
              style={{ transformOrigin: `${x}px ${y}px` }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </svg>
      )
    case 'llm':
      return (
        <div className={`${common} flex items-center justify-center gap-1.5 font-mono text-xs`} aria-hidden>
          {['The', 'cat', 'sat', 'on', 'the'].map((w) => (
            <span key={w} className="rounded bg-white/10 px-1.5 py-1 text-ink/80">{w}</span>
          ))}
          <motion.span
            className="rounded bg-primary px-1.5 py-1 font-bold text-bg"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
          >
            mat
          </motion.span>
        </div>
      )
    case 'local':
      return (
        <svg viewBox="0 0 120 60" className={common} aria-hidden>
          <rect x="30" y="10" width="60" height="34" rx="3" fill="none" stroke="#B6FF4A" strokeOpacity="0.7" />
          <rect x="22" y="46" width="76" height="4" rx="2" fill="#B6FF4A" fillOpacity="0.4" />
          <motion.rect x="48" y="20" width="24" height="14" rx="2" fill="#00D68F" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} />
          {[52, 60, 68].map((x) => (
            <g key={x}>
              <line x1={x} y1="16" x2={x} y2="20" stroke="#00D68F" />
              <line x1={x} y1="34" x2={x} y2="38" stroke="#00D68F" />
            </g>
          ))}
        </svg>
      )
    default:
      return (
        <div className={`${common} flex items-center justify-center gap-3 font-mono text-xs`} aria-hidden>
          <span className="rounded-md border border-primary/40 px-2 py-1 text-primary">ollama run</span>
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="text-muted">→</motion.span>
          <span className="rounded-md bg-primary/15 px-2 py-1 text-ink">your model</span>
        </div>
      )
  }
}

/* ---------- flip card ---------- */
function ConceptCard({ concept, index }: { concept: Concept; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <Reveal delay={index * 0.07}>
      <div className="flex h-full flex-col gap-3">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={`${concept.title}. Click to ${flipped ? 'show the summary' : 'read the explanation'}`}
          className="relative h-72 w-full text-left [perspective:1200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl"
        >
          <motion.div
            className="relative h-full w-full [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* front */}
            <div className="glass glass-hover absolute inset-0 flex flex-col rounded-2xl p-5 [backface-visibility:hidden]">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-muted">0{index + 1}</span>
                <span className="text-2xl" aria-hidden>{concept.emoji}</span>
              </div>
              <Illustration id={concept.id} />
              <h3 className="mt-1 font-display text-lg font-bold">What is {concept.title}?</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{concept.short}</p>
              <span className="mt-auto flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                <MousePointerClick size={13} /> Click to flip
              </span>
            </div>
            {/* back */}
            <div className="absolute inset-0 flex flex-col overflow-y-auto rounded-2xl border border-primary/40 bg-[#0e1a10] p-5 shadow-glow [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <h3 className="font-display text-base font-bold text-primary">{concept.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/90">{concept.back}</p>
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-muted">
                <span className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-secondary">
                  <Lightbulb size={12} /> Analogy
                </span>
                {concept.analogy}
              </div>
            </div>
          </motion.div>
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-2.5 text-left text-sm text-muted transition-colors hover:border-primary/40 hover:text-ink"
        >
          Go deeper
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180 text-primary' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-1 text-sm leading-relaxed text-muted"
            >
              {concept.deeper}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

/* ---------- cloud vs local ---------- */
function Comparison() {
  const [selected, setSelected] = useState(0)
  const [focus, setFocus] = useState<'both' | 'cloud' | 'local'>('both')
  const row = COMPARE[selected]

  return (
    <Reveal>
      <div className="glass rounded-3xl p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Compare</p>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Cloud AI vs Local AI with Ollama</h3>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Cloud services like ChatGPT or Gemini are great tools. Local AI is a different trade-off — neither is "always better". Pick a topic to compare.
            </p>
          </div>
          <div className="flex rounded-full border border-white/10 p-1 text-xs" role="group" aria-label="Highlight side">
            {(['both', 'cloud', 'local'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFocus(f)}
                aria-pressed={focus === f}
                className={`rounded-full px-3 py-1.5 font-medium capitalize transition-colors ${focus === f ? 'bg-primary text-bg' : 'text-muted hover:text-ink'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Comparison topics">
            {COMPARE.map((c, i) => (
              <button
                key={c.topic}
                role="tab"
                aria-selected={selected === i}
                onClick={() => setSelected(i)}
                className={`shrink-0 rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                  selected === i ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted hover:border-white/25 hover:text-ink'
                }`}
              >
                {c.topic}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className={`rounded-2xl border p-5 transition-opacity ${focus === 'local' ? 'opacity-30' : ''} border-white/10 bg-white/[0.03]`}>
                <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-ink">
                  <Cloud size={18} className="text-muted" /> Cloud service
                </div>
                <p className="text-sm leading-relaxed text-muted">{row.cloud}</p>
              </div>
              <div className={`rounded-2xl border p-5 transition-opacity ${focus === 'cloud' ? 'opacity-30' : ''} border-primary/40 bg-primary/[0.06]`}>
                <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-primary">
                  <HardDrive size={18} /> Local AI (Ollama)
                </div>
                <p className="text-sm leading-relaxed text-ink/90">{row.local}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  )
}

export default function Basics() {
  return (
    <SectionShell
      id="basics"
      number="01"
      eyebrow="Understand the basics"
      title={<>Five ideas. <span className="text-primary">Zero jargon.</span></>}
      intro="Before we install anything, let's build the mental model. Flip each card, then dig deeper if you're curious."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CONCEPTS.map((c, i) => (
          <ConceptCard key={c.id} concept={c} index={i} />
        ))}
      </div>
      <div className="mt-14">
        <Comparison />
      </div>
    </SectionShell>
  )
}
