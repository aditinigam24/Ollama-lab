import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertOctagon, Eye, HelpCircle, Wrench } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'
import { TROUBLES } from '../data/troubleshooting'

export default function Troubleshooting() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <SectionShell
      id="troubleshoot"
      number="09"
      eyebrow="Troubleshooting lab"
      title={<>When it breaks, <span className="text-primary">you will know why.</span></>}
      intro="Every developer sees errors. These six are the ones beginners meet most. Open a card to see why it happens, how to spot it and how to fix it."
    >
      <Reveal>
        <div className="mb-8 rounded-2xl border border-secondary/30 bg-secondary/[0.06] p-5">
          <p className="flex items-center gap-2 font-display font-bold text-secondary">
            <HelpCircle size={18} /> 10-second health check
          </p>
          <p className="mt-2 text-sm text-ink/90">
            Open <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">http://localhost:11434</code> in your browser. If the page says "Ollama is running", the server is up — so the problem is probably the model name, memory or your code, not the server.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        {TROUBLES.map((t, i) => {
          const isOpen = open === t.id
          return (
            <Reveal key={t.id} delay={(i % 2) * 0.06}>
              <div className={`glass overflow-hidden rounded-2xl transition-colors ${isOpen ? 'border-primary/50 shadow-glow' : 'glass-hover'}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : t.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 p-5 text-left"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#ff6b6b]/10 text-[#ff6b6b]">
                    <AlertOctagon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold">{t.title}</span>
                    <span className="mt-1 block break-words font-mono text-xs text-[#ff6b6b]/90">{t.symptom}</span>
                  </span>
                  <span className={`mt-1 font-mono text-lg text-muted transition-transform ${isOpen ? 'rotate-45 text-primary' : ''}`}>+</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5 border-t border-white/10 p-5">
                        <div>
                          <h4 className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                            <HelpCircle size={13} /> Why it happens
                          </h4>
                          <p className="text-sm leading-relaxed text-ink/90">{t.why}</p>
                        </div>
                        <div>
                          <h4 className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ffbd2e]">
                            <Eye size={13} /> How to identify it
                          </h4>
                          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                            {t.identify.map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary">
                            <Wrench size={13} /> How to fix it
                          </h4>
                          <ol className="space-y-3">
                            {t.fix.map((f, idx) => (
                              <li key={f.step} className="flex gap-3">
                                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary/15 font-mono text-[11px] text-secondary">{idx + 1}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-ink/90">{f.step}</p>
                                  {f.code && (
                                    <div className="mt-2">
                                      <CodeBlock code={f.code} language="bash" title="terminal" />
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}
