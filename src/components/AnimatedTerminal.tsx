import { useEffect, useRef, useState } from 'react'

type Step =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string; tone?: 'ok' | 'dim' | 'ai' | 'plain' }
  | { kind: 'pause'; ms: number }

const SCRIPT: Step[] = [
  { kind: 'cmd', text: 'ollama --version' },
  { kind: 'out', text: 'ollama version is 0.12.3', tone: 'plain' },
  { kind: 'pause', ms: 700 },
  { kind: 'cmd', text: 'ollama pull gemma3:1b' },
  { kind: 'out', text: 'pulling manifest', tone: 'dim' },
  { kind: 'out', text: 'pulling 7cd4618c1faf: 100% ▕████████████▏ 815 MB', tone: 'dim' },
  { kind: 'out', text: 'success', tone: 'ok' },
  { kind: 'pause', ms: 700 },
  { kind: 'cmd', text: 'ollama run gemma3:1b' },
  { kind: 'out', text: '>>> Explain local AI in one line.', tone: 'plain' },
  { kind: 'out', text: 'Local AI runs on your own computer, so your data stays with you.', tone: 'ai' },
  { kind: 'pause', ms: 2200 },
]

const TONES: Record<string, string> = {
  ok: 'text-primary',
  dim: 'text-muted',
  ai: 'text-secondary',
  plain: 'text-ink/90',
}

interface Line {
  kind: 'cmd' | 'out'
  text: string
  tone?: string
}

export default function AnimatedTerminal({ compact = false }: { compact?: boolean }) {
  const [lines, setLines] = useState<Line[]>([])
  const [typing, setTyping] = useState('')
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    ;(async () => {
      while (alive.current) {
        setLines([])
        setTyping('')
        for (const step of SCRIPT) {
          if (!alive.current) return
          if (step.kind === 'cmd') {
            for (let i = 1; i <= step.text.length; i++) {
              if (!alive.current) return
              setTyping(step.text.slice(0, i))
              await wait(38 + Math.random() * 40)
            }
            await wait(280)
            setLines((l) => [...l, { kind: 'cmd', text: step.text }])
            setTyping('')
          } else if (step.kind === 'out') {
            await wait(380)
            setLines((l) => [...l, { kind: 'out', text: step.text, tone: step.tone }])
          } else {
            await wait(step.ms)
          }
        }
      }
    })()

    return () => {
      alive.current = false
    }
  }, [])

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-glowSoft">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-[11px] text-muted">demo — animated preview</span>
      </div>
      <div className={`overflow-hidden p-4 font-mono text-[13px] leading-relaxed ${compact ? 'h-48' : 'h-64'}`} aria-live="off">
        {lines.map((l, i) =>
          l.kind === 'cmd' ? (
            <div key={i}>
              <span className="text-primary">$ </span>
              <span className="text-ink">{l.text}</span>
            </div>
          ) : (
            <div key={i} className={TONES[l.tone ?? 'plain']}>
              {l.text}
            </div>
          ),
        )}
        <div>
          <span className="text-primary">$ </span>
          <span className="text-ink">{typing}</span>
          <span className="animate-blink text-primary">▍</span>
        </div>
      </div>
    </div>
  )
}
