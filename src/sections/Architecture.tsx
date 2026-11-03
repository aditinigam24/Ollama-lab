import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, Database, MessageSquare, Play, RotateCcw, Server, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'

interface NodeDef {
  id: string
  label: string
  icon: LucideIcon
  short: string
  detail: string
  example: string
}

const NODES: NodeDef[] = [
  {
    id: 'user',
    label: 'USER',
    icon: User,
    short: 'You (or your app)',
    detail:
      'It starts with a prompt. You type it into the terminal with ollama run, or your own program sends it to the Ollama API. Either way, the question is just text.',
    example: '"Explain recursion like I\'m 12."',
  },
  {
    id: 'ollama',
    label: 'OLLAMA',
    icon: Server,
    short: 'The manager',
    detail:
      'Ollama is the program on your computer that listens for requests (on http://localhost:11434), finds the right model, loads it into memory, runs it, and sends the answer back. It is the bridge between you and the model.',
    example: 'POST http://localhost:11434/api/chat',
  },
  {
    id: 'model',
    label: 'LOCAL MODEL',
    icon: Database,
    short: 'The brain on disk',
    detail:
      'A model is a big file of learned numbers (parameters) stored on your disk after ollama pull. To use it, Ollama loads it into RAM — or GPU memory — so it can compute quickly.',
    example: 'gemma3:1b  ·  ~815 MB',
  },
  {
    id: 'inference',
    label: 'INFERENCE',
    icon: Cpu,
    short: 'The thinking',
    detail:
      'Inference means using a trained model to produce an output. Your CPU or GPU runs the model on your prompt and predicts the next token, again and again, until the answer is complete. No learning happens here — the model just uses what it already learned.',
    example: 'token → token → token → …',
  },
  {
    id: 'response',
    label: 'AI RESPONSE',
    icon: MessageSquare,
    short: 'The answer',
    detail:
      'The generated tokens travel back through Ollama to you. In the terminal you see words appear one after another, because Ollama streams the answer as it is produced.',
    example: '"Recursion is when a function calls itself…"',
  },
]

export default function Architecture() {
  const [selected, setSelected] = useState(0)
  const [step, setStep] = useState<number | null>(null)
  const timer = useRef<number | null>(null)

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = null
  }

  const play = () => {
    stop()
    setSelected(0)
    setStep(0)
    let i = 0
    timer.current = window.setInterval(() => {
      i += 1
      if (i >= NODES.length) {
        stop()
        setStep(null)
        return
      }
      setStep(i)
      setSelected(i)
    }, 1500)
  }

  useEffect(() => stop, [])

  const node = NODES[selected]
  const Icon = node.icon

  return (
    <SectionShell
      id="how"
      number="02"
      eyebrow="How Ollama works"
      title={<>From your question to <span className="text-primary">an answer</span>, on your machine.</>}
      intro="Click any block to learn what it does, or press the button to watch a prompt travel through the whole system."
    >
      <Reveal>
        <div className="glass rounded-3xl p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs text-muted">
              {step === null ? 'Idle — click a node or run the animation' : `Step ${step + 1} of ${NODES.length}: ${NODES[step].label}`}
            </p>
            <button onClick={play} className="btn-primary !px-5 !py-2.5 !text-xs">
              {step === null ? <Play size={14} /> : <RotateCcw size={14} />}
              {step === null ? 'Send a prompt' : 'Restart'}
            </button>
          </div>

          {/* flow */}
          <div className="flex flex-col items-stretch lg:flex-row lg:items-center">
            {NODES.map((n, i) => {
              const NIcon = n.icon
              const isSel = selected === i
              const isActive = step === i
              return (
                <div key={n.id} className="flex flex-col items-center lg:flex-1 lg:flex-row">
                  <motion.button
                    onClick={() => {
                      stop()
                      setStep(null)
                      setSelected(i)
                    }}
                    aria-pressed={isSel}
                    whileHover={{ y: -3 }}
                    className={`relative flex w-full flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-center transition-colors lg:w-auto lg:min-w-[130px] ${
                      isSel ? 'border-primary bg-primary/10 shadow-glow' : 'border-white/10 bg-white/[0.03] hover:border-primary/40'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-ring"
                        className="absolute inset-0 rounded-2xl ring-2 ring-primary"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <NIcon size={26} className={isSel ? 'text-primary' : 'text-muted'} />
                    <span className="font-display text-sm font-bold tracking-wide">{n.label}</span>
                    <span className="text-[11px] text-muted">{n.short}</span>
                  </motion.button>

                  {i < NODES.length - 1 && (
                    <div className="relative h-10 w-px bg-white/15 lg:h-px lg:w-full lg:flex-1" aria-hidden>
                      {/* data packet: only moves on the connector that is currently active (or loops gently while idle) */}
                      {(step === null || step === i) && (
                        <>
                          {/* vertical (mobile) */}
                          <motion.span
                            key={`v-${step}-${i}`}
                            className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-glow lg:hidden"
                            initial={{ top: '0%', opacity: 0 }}
                            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                            transition={{ duration: step === i ? 1.3 : 2.4, repeat: step === null ? Infinity : 0, delay: step === null ? i * 0.3 : 0, ease: 'linear' }}
                          />
                          {/* horizontal (desktop) */}
                          <motion.span
                            key={`h-${step}-${i}`}
                            className="absolute top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary shadow-glow lg:block"
                            initial={{ left: '0%', opacity: 0 }}
                            animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                            transition={{ duration: step === i ? 1.3 : 2.4, repeat: step === null ? Infinity : 0, delay: step === null ? i * 0.3 : 0, ease: 'linear' }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-8 grid gap-5 rounded-2xl border border-primary/25 bg-primary/[0.04] p-5 sm:p-6 md:grid-cols-[auto_1fr]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon size={28} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">
                  {node.label} <span className="text-sm font-normal text-muted">— {node.short}</span>
                </h3>
                <p className="mt-2 leading-relaxed text-ink/90">{node.detail}</p>
                <p className="mt-3 inline-block rounded-lg bg-black/40 px-3 py-1.5 font-mono text-xs text-primary">{node.example}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </SectionShell>
  )
}
