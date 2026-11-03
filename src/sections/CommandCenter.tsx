import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ChevronDown, Info, Lightbulb, Search, Target, X } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'
import { COMMANDS } from '../data/commands'
import type { CommandDoc } from '../data/commands'

function CommandCard({ cmd, open, onToggle }: { cmd: CommandDoc; open: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className={`glass overflow-hidden rounded-2xl transition-colors ${open ? 'border-primary/40' : ''}`}
    >
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold">{cmd.name}</h3>
            <p className="text-sm text-muted">{cmd.tagline}</p>
          </div>
          <button
            onClick={onToggle}
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} details for ${cmd.name}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/50 hover:text-primary"
          >
            {open ? 'Hide' : 'Details'}
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <CodeBlock code={cmd.syntax} copyText={cmd.copy} title="syntax" />
        <p className="mt-2 font-mono text-[11px] text-muted">
          Copy button copies a ready-to-run example: <span className="text-primary">{cmd.copy}</span>
        </p>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-white/10 p-4 sm:p-5">
              <div>
                <h4 className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                  <Info size={14} /> What it does
                </h4>
                <p className="leading-relaxed text-ink/90">{cmd.explanation}</p>
              </div>

              <div>
                <h4 className="mb-1.5 font-mono text-xs uppercase tracking-wider text-primary">Expected output</h4>
                <CodeBlock code={cmd.output} language="text" title="output" showCopy={false} />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h4 className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                    <Target size={14} /> Real-world use
                  </h4>
                  <p className="text-sm leading-relaxed text-muted">{cmd.realWorld}</p>
                </div>
                <div>
                  <h4 className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary">
                    <Lightbulb size={14} /> Beginner tips
                  </h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                    {cmd.tips.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#ffbd2e]">
                  <AlertTriangle size={14} /> Common errors
                </h4>
                <div className="space-y-2">
                  {cmd.errors.map((e) => (
                    <div key={e.error} className="rounded-xl border border-[#ffbd2e]/20 bg-[#ffbd2e]/[0.04] p-3">
                      <p className="font-mono text-xs text-[#ffbd2e]">{e.error}</p>
                      <p className="mt-1 text-sm text-muted">
                        <span className="font-semibold text-ink/80">Fix: </span>
                        {e.fix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CommandCenter() {
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['run']))

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMANDS
    const terms = q.split(/\s+/)
    return COMMANDS.filter((c) => {
      const hay = [c.syntax, c.copy, c.name, c.tagline, c.explanation, c.realWorld, ...c.keywords].join(' ').toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [query])

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const allOpen = results.length > 0 && results.every((r) => openIds.has(r.id))

  return (
    <SectionShell
      id="commands"
      number="04"
      eyebrow="Command center"
      title={<>Nine commands that <span className="text-primary">run the show.</span></>}
      intro="Search, expand, copy. Every command comes with the output you should expect and the errors you are likely to meet."
    >
      <Reveal>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search commands — try "memory", "delete", "api" or "run"'
              aria-label="Search commands"
              className="w-full rounded-full border border-white/10 bg-surface/80 py-3 pl-11 pr-11 text-sm text-ink placeholder:text-muted/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-white/10 hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setOpenIds(allOpen ? new Set() : new Set(results.map((r) => r.id)))}
            disabled={results.length === 0}
            className="btn-ghost disabled:opacity-40"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
        <p className="mb-4 font-mono text-xs text-muted" aria-live="polite">
          {results.length} of {COMMANDS.length} commands shown
        </p>
      </Reveal>

      {/* serve callout */}
      <Reveal>
        <div className="mb-6 flex gap-3 rounded-2xl border border-secondary/30 bg-secondary/[0.07] p-4 text-sm leading-relaxed text-ink/90">
          <Info size={18} className="mt-0.5 shrink-0 text-secondary" />
          <p>
            <span className="font-semibold text-secondary">Good to know: </span>
            <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">ollama serve</code> starts the local API server on port 11434. The
            Ollama desktop app often starts this server for you automatically, so on Windows and macOS you usually do <em>not</em> need to run it yourself.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <AnimatePresence mode="popLayout">
          {results.map((c) => (
            <CommandCard key={c.id} cmd={c} open={openIds.has(c.id)} onToggle={() => toggle(c.id)} />
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="font-display text-lg font-bold">No commands match "{query}"</p>
          <p className="mt-1 text-sm text-muted">Try a simpler word like "run", "list" or "memory".</p>
          <button onClick={() => setQuery('')} className="btn-ghost mt-4">
            Clear search
          </button>
        </div>
      )}
    </SectionShell>
  )
}
