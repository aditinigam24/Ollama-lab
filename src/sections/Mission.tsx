import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ExternalLink, RotateCcw, Rocket } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'

interface Task {
  id: string
  title: string
  detail: string
  code?: string
  subtasks?: string[]
}

const TASKS: Task[] = [
  {
    id: 'install',
    title: 'Install Ollama',
    detail: 'Download it from ollama.com/download and install it. Then check it worked.',
    code: 'ollama --version',
  },
  {
    id: 'pull',
    title: 'Download Gemma',
    detail: 'Pull the small Gemma 3 model (about 815 MB).',
    code: 'ollama pull gemma3:1b',
  },
  {
    id: 'run',
    title: 'Run the model',
    detail: 'Start a chat session. Type /bye when you want to leave it.',
    code: 'ollama run gemma3:1b',
  },
  {
    id: 'ask',
    title: 'Ask it three questions',
    detail: 'Tick each one as you ask it. Make them your own — here are ideas:',
    subtasks: [
      'Explain something from a subject you are studying, in simple words.',
      'Ask for three tips to prepare for an exam.',
      'Ask it to write a short poem about your favourite programming language.',
    ],
  },
  {
    id: 'another',
    title: 'Try another model',
    detail: 'Pull and run a different model, then compare the answers and the speed. Check its size first on ollama.com/library.',
    code: 'ollama pull llama3.2:1b\nollama run llama3.2:1b',
  },
]

export default function Mission() {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [subDone, setSubDone] = useState<Record<string, boolean>>({})

  const subsOf = (t: Task) => (t.subtasks ?? []).map((_, i) => `${t.id}-${i}`)

  const toggle = (t: Task) => {
    const next = !done[t.id]
    setDone((d) => ({ ...d, [t.id]: next }))
    if (t.subtasks) {
      setSubDone((s) => {
        const copy = { ...s }
        subsOf(t).forEach((k) => (copy[k] = next))
        return copy
      })
    }
  }

  const toggleSub = (t: Task, key: string) => {
    const nextSub = { ...subDone, [key]: !subDone[key] }
    setSubDone(nextSub)
    const all = subsOf(t).every((k) => nextSub[k])
    setDone((d) => ({ ...d, [t.id]: all }))
  }

  const count = TASKS.filter((t) => done[t.id]).length
  const complete = count === TASKS.length
  const pct = (count / TASKS.length) * 100
  const R = 34
  const C = 2 * Math.PI * R

  const reset = () => {
    setDone({})
    setSubDone({})
  }

  return (
    <SectionShell
      id="mission"
      number="11"
      eyebrow="Final challenge"
      title={<>YOUR FIRST <span className="text-primary">LOCAL AI</span> MISSION</>}
      intro="Five tasks. About 15 minutes. By the end, you will have an AI model running on your own computer."
    >
      <Reveal>
        <div className="glass mx-auto max-w-3xl rounded-3xl p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
                <circle cx="42" cy="42" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <motion.circle
                  cx="42"
                  cy="42"
                  r={R}
                  fill="none"
                  stroke="#B6FF4A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C - (pct / 100) * C }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  transform="rotate(-90 42 42)"
                />
                <text x="42" y="47" textAnchor="middle" className="fill-ink font-display text-lg font-bold">
                  {count}/{TASKS.length}
                </text>
              </svg>
              <div>
                <p className="font-display text-lg font-bold">Mission progress</p>
                <p className="text-sm text-muted">{complete ? 'Mission complete!' : `${TASKS.length - count} task${TASKS.length - count === 1 ? '' : 's'} to go`}</p>
              </div>
            </div>
            <button onClick={reset} className="btn-ghost !px-3.5 !py-2 text-xs">
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          <ol className="mt-6 space-y-3">
            {TASKS.map((t, i) => {
              const isDone = !!done[t.id]
              return (
                <li key={t.id} className={`rounded-2xl border p-4 transition-colors sm:p-5 ${isDone ? 'border-primary/40 bg-primary/[0.06]' : 'border-white/10 bg-white/[0.02]'}`}>
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggle(t)}
                      role="checkbox"
                      aria-checked={isDone}
                      aria-label={`Mark "${t.title}" ${isDone ? 'not done' : 'done'}`}
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-all ${isDone ? 'border-primary bg-primary text-bg' : 'border-white/25 text-muted hover:border-primary'}`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isDone ? (
                          <motion.span key="c" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                            <Check size={16} />
                          </motion.span>
                        ) : (
                          <motion.span key="n" className="font-mono text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {i + 1}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-display text-lg font-bold transition-colors ${isDone ? 'text-primary' : ''}`}>{t.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{t.detail}</p>
                      {t.code && (
                        <div className="mt-3">
                          <CodeBlock code={t.code} language="bash" title="terminal" />
                        </div>
                      )}
                      {t.subtasks && (
                        <ul className="mt-3 space-y-2">
                          {t.subtasks.map((s, si) => {
                            const key = `${t.id}-${si}`
                            return (
                              <li key={key}>
                                <button
                                  onClick={() => toggleSub(t, key)}
                                  role="checkbox"
                                  aria-checked={!!subDone[key]}
                                  className="flex w-full items-start gap-2.5 rounded-lg border border-white/10 px-3 py-2 text-left text-sm transition-colors hover:border-primary/40"
                                >
                                  <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${subDone[key] ? 'border-primary bg-primary text-bg' : 'border-white/30'}`}>
                                    {subDone[key] && <Check size={11} />}
                                  </span>
                                  <span className={subDone[key] ? 'text-muted line-through' : 'text-ink/90'}>{s}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative mt-6 overflow-hidden rounded-2xl border border-primary/60 bg-primary/10 p-6 text-center shadow-glow"
              >
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute top-1/2 h-1.5 w-1.5 rounded-full bg-primary"
                    style={{ left: `${(i / 14) * 100 + 3}%` }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: [-10, -70 - (i % 4) * 14], opacity: [1, 0], x: [(i % 2 ? 1 : -1) * 4, (i % 2 ? 1 : -1) * 22] }}
                    transition={{ duration: 1.4, delay: i * 0.04 }}
                  />
                ))}
                <Rocket className="mx-auto mb-2 text-primary" size={30} />
                <p className="font-display text-2xl font-bold text-primary">Mission complete!</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink/90">
                  You are now running AI locally. Keep exploring: try bigger models if your hardware allows, change the Study Buddy prompt, or read the official docs.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <a href="https://docs.ollama.com/" target="_blank" rel="noreferrer" className="btn-ghost">
                    Ollama docs <ExternalLink size={13} />
                  </a>
                  <a href="https://ollama.com/library" target="_blank" rel="noreferrer" className="btn-ghost">
                    Model library <ExternalLink size={13} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </SectionShell>
  )
}
