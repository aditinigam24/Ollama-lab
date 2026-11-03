import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ChevronDown, Cpu, HardDrive, MemoryStick, Layers } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'
import { HARDWARE_GUIDE, MODELS } from '../data/models'
import type { ModelDoc } from '../data/models'

function ModelCard({ model, index }: { model: ModelDoc; index: number }) {
  const [variant, setVariant] = useState(0)
  const v = model.variants[variant]

  return (
    <Reveal delay={index * 0.06}>
      <div className="glass glass-hover flex h-full flex-col rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-bold" style={{ color: model.accent }}>
              {model.name}
            </h3>
            <p className="font-mono text-xs text-muted">by {model.developer}</p>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            {model.variants.length} tags
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink/90">{model.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {model.uses.map((u) => (
            <span key={u} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
              {u}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">Choose a tag</p>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={`${model.name} tags`}>
            {model.variants.map((x, i) => (
              <button
                key={x.tag}
                role="tab"
                aria-selected={variant === i}
                onClick={() => setVariant(i)}
                className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                  variant === i ? 'border-primary bg-primary/15 text-primary' : 'border-white/10 text-muted hover:text-ink'
                }`}
              >
                {x.tag}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <HardDrive size={13} />
              {v.size ? `Download: ${v.size}` : 'Download size: check the library page'}
            </span>
            {v.note && <span className="text-secondary">{v.note}</span>}
          </div>
          <div className="mt-3">
            <CodeBlock code={v.command} title="terminal" />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#ffbd2e]/25 bg-[#ffbd2e]/[0.05] p-3.5 text-sm text-muted">
          <p className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#ffbd2e]">
            <Cpu size={13} /> Hardware considerations
          </p>
          {model.hardware}
        </div>
        <p className="mt-3 text-xs text-muted/80">{model.verifiedNote}</p>
      </div>
    </Reveal>
  )
}

/* rough "will it fit?" helper — uses only sizes verified in the Ollama library listing */
const FIT_ROWS = MODELS.flatMap((m) => m.variants.filter((v) => v.size).map((v) => ({ model: m.name, v })))
const toGB = (s: string) => (s.endsWith('MB') ? parseFloat(s) / 1000 : parseFloat(s))

function FitChecker() {
  const [ram, setRam] = useState(8)
  return (
    <Reveal>
      <div className="glass rounded-3xl p-5 sm:p-8">
        <p className="eyebrow">Will it fit?</p>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">A rough memory check</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Choose how much RAM your computer has. This is a <strong className="text-ink">rule of thumb</strong>, not a guarantee: a model's download size is compared with your memory. GPUs, other open apps and long conversations all change the real result.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Your RAM">
          {[4, 8, 16, 32, 64].map((g) => (
            <button
              key={g}
              role="radio"
              aria-checked={ram === g}
              onClick={() => setRam(g)}
              className={`rounded-full border px-4 py-2 font-mono text-sm transition-colors ${
                ram === g ? 'border-primary bg-primary text-bg' : 'border-white/15 text-muted hover:text-ink'
              }`}
            >
              {g} GB
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {FIT_ROWS.map(({ model, v }) => {
            const size = toGB(v.size!)
            const ratio = size / ram
            const verdict = ratio <= 0.4 ? 'comfortable' : ratio <= 0.7 ? 'tight' : 'too big'
            const color = verdict === 'comfortable' ? 'text-primary border-primary/30' : verdict === 'tight' ? 'text-[#ffbd2e] border-[#ffbd2e]/30' : 'text-[#ff6b6b] border-[#ff6b6b]/30'
            return (
              <motion.div layout key={v.command} className={`flex items-center justify-between rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm ${color}`}>
                <span className="text-ink/90">
                  {model} <span className="font-mono text-xs text-muted">{v.tag} · {v.size}</span>
                </span>
                <span className="font-mono text-xs uppercase tracking-wider">{verdict}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}

export default function Models() {
  const [open, setOpen] = useState<number | null>(0)
  const icons = [MemoryStick, HardDrive, Layers, Cpu]

  return (
    <SectionShell
      id="models"
      number="06"
      eyebrow="Explore local models"
      title={<>Pick a model that <span className="text-primary">fits your machine.</span></>}
      intro="There is no single best model. Bigger models are usually smarter but need far more memory. Start small and move up."
    >
      <div className="mb-8 flex gap-3 rounded-2xl border border-[#ffbd2e]/30 bg-[#ffbd2e]/[0.06] p-4 text-sm text-ink/90">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#ffbd2e]" />
        <p>
          <span className="font-semibold text-[#ffbd2e]">Do not assume every model runs on every computer. </span>
          Check a model's size on ollama.com/library before pulling it, and compare it with your free RAM and disk space.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {MODELS.map((m, i) => (
          <ModelCard key={m.id} model={m} index={i} />
        ))}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div>
            <p className="eyebrow">Hardware 101</p>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">What actually limits a model?</h3>
            <div className="mt-5 space-y-2">
              {HARDWARE_GUIDE.map((h, i) => {
                const HIcon = icons[i % icons.length]
                const isOpen = open === i
                return (
                  <div key={h.title} className={`overflow-hidden rounded-xl border transition-colors ${isOpen ? 'border-primary/40 bg-primary/[0.04]' : 'border-white/10'}`}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="flex items-center gap-2.5 font-display font-bold">
                        <HIcon size={16} className="text-primary" /> {h.title}
                      </span>
                      <ChevronDown size={16} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden px-4 pb-4 text-sm leading-relaxed text-muted"
                        >
                          {h.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>
        <FitChecker />
      </div>
    </SectionShell>
  )
}
