import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Eraser, Play, RotateCcw, ShieldAlert, Sparkles, Trash2 } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CopyButton from '../components/CopyButton'

type Tone = 'plain' | 'ok' | 'err' | 'dim' | 'ai' | 'warn'
interface Entry {
  id: number
  kind: 'cmd' | 'out'
  text: string
  tone?: Tone
  prompt?: string
}

const PROMPT = 'student@lab:~$ '
const CHAT_PROMPT = '>>> '
const MODEL = 'gemma3:1b'
const MODEL_ID = '8648f39daa8f'

const TONE_CLASS: Record<Tone, string> = {
  plain: 'text-ink/90',
  ok: 'text-primary',
  err: 'text-[#ff6b6b]',
  dim: 'text-muted',
  ai: 'text-[#7ee8ff]',
  warn: 'text-[#ffbd2e]',
}

const HELP_TEXT = `Large language model runner

Usage:
  ollama [flags]
  ollama [command]

Available Commands:
  serve       Start ollama
  create      Create a model
  show        Show information for a model
  run         Run a model
  stop        Stop a running model
  pull        Pull a model from a registry
  push        Push a model to a registry
  list        List models
  ps          List running models
  cp          Copy a model
  rm          Remove a model
  help        Help about any command

Flags:
  -h, --help      help for ollama
  -v, --version   Show version information

Use "ollama [command] --help" for more information about a command.`

const CHAT_HELP = `Available Commands:
  /set            Set session variables
  /show           Show model information
  /load <model>   Load a session or model
  /save <model>   Save your current session
  /clear          Clear session context
  /bye            Exit
  /?, /help       Help for a command`

const SUGGESTIONS = [
  'ollama --version',
  'ollama help',
  'ollama list',
  'ollama pull gemma3:1b',
  'ollama run gemma3:1b',
  'ollama ps',
  'ollama stop gemma3:1b',
  'ollama rm gemma3:1b',
  'clear',
]

function aiReply(prompt: string): string {
  const p = prompt.toLowerCase()
  if (/\b(hi|hello|hey)\b/.test(p)) return 'Hello! I am a small language model running right here on your computer. What would you like to explore?'
  if (/api/.test(p)) return 'An API is a set of rules that lets one program ask another program to do something and get a result back. Ollama exposes one on localhost so your own apps can talk to a local model.'
  if (/local|privacy|private/.test(p)) return 'A local model runs on your own hardware, so your prompts do not have to leave your computer. The trade-off is that it is limited by your RAM and GPU.'
  if (/ollama/.test(p)) return 'Ollama is a tool that downloads, runs and serves language models on your own machine, with simple commands like pull, run and list.'
  if (/python|code/.test(p)) return 'Python is a beginner-friendly language. With the Ollama Python library you can send a prompt to a local model in just a few lines of code.'
  if (/sky|blue/.test(p)) return 'The sky looks blue because air scatters short blue wavelengths of sunlight much more than long red ones, so blue light reaches your eyes from every direction.'
  return 'Good question! In the real terminal, gemma3:1b would write the answer here. This is only a canned reply from the simulator.'
}

interface Exercise {
  id: number
  title: string
  goal: string
  command: string
  hint: string
}

const EXERCISES: Exercise[] = [
  { id: 1, title: 'Check the version', goal: 'Confirm the CLI is installed.', command: 'ollama --version', hint: 'Two dashes before the word version.' },
  { id: 2, title: 'Read the help', goal: 'See every command Ollama offers.', command: 'ollama help', hint: 'The word help comes right after ollama.' },
  { id: 3, title: 'List your models', goal: 'See what is on your disk. It should be empty.', command: 'ollama list', hint: 'list shows what is stored on disk.' },
  { id: 4, title: 'Download a model', goal: 'Pull the small Gemma model.', command: 'ollama pull gemma3:1b', hint: 'pull + model name + :tag. Watch the progress bar.' },
  { id: 5, title: 'Confirm the download', goal: 'List your models again — gemma3:1b should appear.', command: 'ollama list', hint: 'Same command as exercise 3, different result.' },
  { id: 6, title: 'Chat with it', goal: 'Run the model, then type any question and press Enter.', command: 'ollama run gemma3:1b', hint: 'After the >>> prompt appears, type something like: Why is the sky blue?' },
  { id: 7, title: 'Leave the chat', goal: 'Exit the model chat.', command: '/bye', hint: 'Inside a chat, commands start with a slash.' },
  { id: 8, title: 'Peek into memory', goal: 'See which model is loaded right now.', command: 'ollama ps', hint: 'ps = process status. Models stay loaded for a while after chatting.' },
]

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function TerminalPlayground() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 0, kind: 'out', text: 'Welcome to the Ollama Lab terminal. Type a command, or follow the exercises on the right.', tone: 'dim' },
    { id: 1, kind: 'out', text: 'Try:  ollama --version     ollama help     ollama list', tone: 'dim' },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chat, setChat] = useState(false)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [openHint, setOpenHint] = useState<number | null>(null)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])

  const histIdx = useRef(-1)
  const nextId = useRef(10)
  const scroller = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const busyRef = useRef(false)
  const alive = useRef(true)
  const sim = useRef({ installed: new Set<string>(), loaded: new Set<string>(), chat: false, replies: 0 })

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [entries])

  /* ---------- output helpers ---------- */
  const print = useCallback((text: string, tone: Tone = 'plain', extra?: Partial<Entry>) => {
    const id = nextId.current++
    setEntries((e) => [...e, { id, kind: 'out', text, tone, ...extra }])
    return id
  }, [])
  const update = useCallback((id: number, text: string) => {
    setEntries((e) => e.map((x) => (x.id === id ? { ...x, text } : x)))
  }, [])
  const remove = useCallback((id: number) => {
    setEntries((e) => e.filter((x) => x.id !== id))
  }, [])
  const complete = useCallback((n: number) => setDone((d) => (d.has(n) ? d : new Set(d).add(n))), [])

  const spinner = useCallback(
    async (label: string, ms: number) => {
      const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
      const id = print(`${frames[0]} ${label}`, 'dim')
      const t0 = Date.now()
      let i = 0
      while (Date.now() - t0 < ms && alive.current) {
        update(id, `${frames[i++ % frames.length]} ${label}`)
        await sleep(80)
      }
      remove(id)
    },
    [print, update, remove],
  )

  const bar = (p: number) => {
    const filled = Math.round((p / 100) * 20)
    const mb = Math.round((p / 100) * 815)
    return `pulling 7cd4618c1faf: ${String(p).padStart(3)}% ▕${'█'.repeat(filled)}${' '.repeat(20 - filled)}▏ ${mb} MB/815 MB`
  }

  const doPull = useCallback(async () => {
    print('pulling manifest', 'dim')
    await sleep(700)
    const id = print(bar(0), 'dim')
    for (let p = 0; p <= 100; p += 4) {
      if (!alive.current) return
      update(id, bar(p))
      await sleep(70)
    }
    print('verifying sha256 digest', 'dim')
    await sleep(500)
    print('writing manifest', 'dim')
    await sleep(350)
    print('success', 'ok')
    sim.current.installed.add(MODEL)
  }, [print, update])

  const typeReply = useCallback(
    async (text: string) => {
      const id = print('', 'ai')
      for (let i = 2; i <= text.length + 1; i += 2) {
        if (!alive.current) return
        update(id, text.slice(0, i))
        await sleep(22)
      }
      update(id, text)
    },
    [print, update],
  )

  const loadModel = useCallback(async () => {
    await spinner('loading model into memory…', 1300)
    sim.current.loaded.add(MODEL)
  }, [spinner])

  /* ---------- command interpreter ---------- */
  const chatTurn = async (text: string) => {
    if (!text) return
    if (text === '/bye') {
      sim.current.chat = false
      setChat(false)
      complete(7)
      return
    }
    if (text === '/?' || text === '/help') {
      print(CHAT_HELP, 'dim')
      return
    }
    if (text.startsWith('/')) {
      print(`Unknown command '${text.split(' ')[0]}'. Type /? for help`, 'err')
      return
    }
    await spinner('thinking…', 900)
    await typeReply(aiReply(text))
    complete(6)
    sim.current.replies += 1
    if (sim.current.replies === 1) print('— simulated reply · type /bye to leave the chat —', 'dim')
  }

  const execute = async (raw: string) => {
    const text = raw.trim()
    const inChat = sim.current.chat
    const id = nextId.current++
    setEntries((e) => [...e, { id, kind: 'cmd', text: raw, prompt: inChat ? CHAT_PROMPT : PROMPT }])
    if (!text) return
    setCmdHistory((h) => [...h, text])

    if (inChat) return chatTurn(text)

    const parts = text.split(/\s+/)
    if (parts[0] === 'clear' || parts[0] === 'cls') {
      setEntries([])
      return
    }
    if (parts[0] !== 'ollama') {
      print(`bash: ${parts[0]}: command not found`, 'err')
      print('Hint: every Ollama command starts with the word "ollama".', 'dim')
      return
    }

    const sub = parts[1]
    const arg = parts[2]

    if (!sub || sub === 'help' || sub === '--help' || sub === '-h') {
      print(HELP_TEXT, 'plain')
      complete(2)
      return
    }
    if (sub === '--version' || sub === '-v' || sub === 'version') {
      print('ollama version is 0.12.3', 'plain')
      complete(1)
      return
    }

    switch (sub) {
      case 'list':
      case 'ls': {
        const rows = [...sim.current.installed]
        let out = 'NAME           ID              SIZE      MODIFIED'
        rows.forEach((m) => {
          out += `\n${m.padEnd(15)}${MODEL_ID}    815 MB    just now`
        })
        print(out, 'plain')
        if (rows.length === 0) print('(empty — you have not downloaded any model yet)', 'dim')
        else complete(5)
        complete(3)
        return
      }
      case 'ps': {
        const rows = [...sim.current.loaded]
        let out = 'NAME           ID              SIZE      PROCESSOR    UNTIL'
        rows.forEach((m) => {
          out += `\n${m.padEnd(15)}${MODEL_ID}    1.9 GB    100% CPU     4 minutes from now`
        })
        print(out, 'plain')
        if (rows.length === 0) print('(nothing is loaded in memory right now)', 'dim')
        else complete(8)
        return
      }
      case 'pull': {
        if (!arg) {
          print('Error: accepts 1 arg(s), received 0', 'err')
          print('Usage: ollama pull <model>:<tag>   e.g. ollama pull gemma3:1b', 'dim')
          return
        }
        if (arg !== MODEL) {
          print(`This simulator only knows ${MODEL}. On your real computer you can pull any model from ollama.com/library.`, 'warn')
          return
        }
        await doPull()
        complete(4)
        return
      }
      case 'run': {
        if (!arg) {
          print('Error: requires at least 1 arg(s), only received 0', 'err')
          print('Usage: ollama run <model>:<tag>   e.g. ollama run gemma3:1b', 'dim')
          return
        }
        if (arg !== MODEL) {
          print(`This simulator only knows ${MODEL}. On your real computer you can run any model you have pulled.`, 'warn')
          return
        }
        if (!sim.current.installed.has(MODEL)) {
          print('Model not found locally — Ollama downloads it first.', 'dim')
          await doPull()
          complete(4)
        }
        await loadModel()
        const oneShot = parts.slice(3).join(' ').replace(/^["']|["']$/g, '')
        if (oneShot) {
          await typeReply(aiReply(oneShot))
          complete(6)
          return
        }
        sim.current.chat = true
        setChat(true)
        print('>>> Send a message (/? for help)', 'dim')
        return
      }
      case 'stop': {
        if (!arg) {
          print('Error: accepts 1 arg(s), received 0', 'err')
          return
        }
        if (sim.current.loaded.delete(arg)) print('(no output on success — check with ollama ps)', 'dim')
        else print(`Error: model '${arg}' is not running`, 'err')
        return
      }
      case 'rm': {
        if (!arg) {
          print('Error: requires at least 1 arg(s), only received 0', 'err')
          return
        }
        if (sim.current.installed.delete(arg)) {
          sim.current.loaded.delete(arg)
          print(`deleted '${arg}'`, 'ok')
        } else print(`Error: model '${arg}' not found`, 'err')
        return
      }
      case 'show':
      case 'serve':
      case 'create':
      case 'push':
      case 'cp':
        print(`"ollama ${sub}" is not part of this simulator. See the Command Center section for its syntax and expected output.`, 'warn')
        return
      default:
        print(`Error: unknown command "${sub}" for "ollama"`, 'err')
        print('Run "ollama help" to see the available commands.', 'dim')
    }
  }

  const run = async (raw: string) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setInput('')
    histIdx.current = -1
    try {
      await execute(raw)
    } finally {
      busyRef.current = false
      if (alive.current) {
        setBusy(false)
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)
      }
    }
  }

  /* "type it for me" — animated typing into the input, then run */
  const typeAndRun = async (cmd: string) => {
    if (busyRef.current) return
    setInput('')
    for (let i = 1; i <= cmd.length; i++) {
      if (!alive.current) return
      setInput(cmd.slice(0, i))
      await sleep(45)
    }
    await sleep(250)
    run(cmd)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      histIdx.current = Math.min(histIdx.current + 1, cmdHistory.length - 1)
      setInput(cmdHistory[cmdHistory.length - 1 - histIdx.current])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      histIdx.current = Math.max(histIdx.current - 1, -1)
      setInput(histIdx.current === -1 ? '' : cmdHistory[cmdHistory.length - 1 - histIdx.current])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = SUGGESTIONS.find((s) => input && s.startsWith(input) && s !== input)
      if (match) setInput(match)
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    }
  }

  const resetLab = () => {
    sim.current = { installed: new Set(), loaded: new Set(), chat: false, replies: 0 }
    setChat(false)
    setDone(new Set())
    setCmdHistory([])
    setInput('')
    setOpenHint(null)
    setEntries([{ id: nextId.current++, kind: 'out', text: 'Lab reset. Fresh machine — nothing is installed.', tone: 'dim' }])
  }

  const allDone = done.size === EXERCISES.length

  return (
    <SectionShell
      id="terminal"
      number="05"
      eyebrow="Interactive terminal playground"
      title={<>Practice in a <span className="text-primary">safe sandbox.</span></>}
      intro="Type real Ollama commands and see realistic responses. Nothing here touches your computer — it is a rehearsal room."
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* terminal */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050805] shadow-glowSoft">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[11px] text-muted">{chat ? `ollama run ${MODEL}` : 'student@lab: ~'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CopyButton text={input || 'ollama --version'} label="Copy input" />
                <CopyButton text={cmdHistory.join('\n')} label="Copy history" />
                <button
                  onClick={() => setEntries([])}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-all hover:border-primary/50 hover:text-primary active:scale-95"
                >
                  <Eraser size={13} /> Clear
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-[#ffbd2e]/25 bg-[#ffbd2e]/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#ffbd2e]">
              <ShieldAlert size={14} className="shrink-0" />
              SIMULATED TERMINAL — commands are not executed on your computer.
            </div>

            <div
              ref={scroller}
              onClick={() => inputRef.current?.focus({ preventScroll: true })}
              className="h-[420px] cursor-text overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
              role="log"
              aria-label="Terminal output"
            >
              {entries.map((e) =>
                e.kind === 'cmd' ? (
                  <div key={e.id} className="whitespace-pre-wrap break-words">
                    <span className={e.prompt === CHAT_PROMPT ? 'text-secondary' : 'text-primary'}>{e.prompt}</span>
                    <span className="text-ink">{e.text}</span>
                  </div>
                ) : (
                  <div key={e.id} className={`whitespace-pre-wrap break-words ${TONE_CLASS[e.tone ?? 'plain']}`}>
                    {e.text}
                  </div>
                ),
              )}

              <div className="flex items-center">
                <span className={`shrink-0 ${chat ? 'text-secondary' : 'text-primary'}`}>{chat ? CHAT_PROMPT : PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={busy}
                  aria-label="Terminal command input"
                  placeholder={busy ? 'running…' : chat ? 'Send a message (/? for help)' : 'type a command and press Enter'}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  className="min-w-0 flex-1 border-none bg-transparent p-0 font-mono text-[13px] text-ink caret-primary outline-none placeholder:text-muted/50 disabled:opacity-70"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-3">
              <button onClick={() => run(input)} disabled={busy} className="btn-primary !px-5 !py-2 !text-xs disabled:opacity-50">
                <Play size={13} /> Run
              </button>
              {busy && <span className="font-mono text-xs text-muted">working…</span>}
              <span className="ml-auto hidden font-mono text-[11px] text-muted sm:block">↑↓ history · Tab autocomplete · Ctrl+L clear</span>
              <div className="flex w-full flex-wrap gap-1.5 sm:w-auto">
                {['ollama --version', 'ollama list', 'ollama ps', 'ollama help'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setInput(c)
                      inputRef.current?.focus({ preventScroll: true })
                    }}
                    disabled={busy}
                    className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* exercises */}
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Sparkles size={18} className="text-primary" /> Guided exercises
              </h3>
              <button onClick={resetLab} className="btn-ghost !px-3 !py-1.5 text-xs">
                <RotateCcw size={13} /> Reset lab
              </button>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full bg-primary" animate={{ width: `${(done.size / EXERCISES.length) * 100}%` }} />
            </div>
            <p className="mt-1.5 font-mono text-xs text-muted">
              {done.size} / {EXERCISES.length} complete
            </p>

            <ul className="mt-4 max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
              {EXERCISES.map((ex) => {
                const isDone = done.has(ex.id)
                return (
                  <li key={ex.id} className={`rounded-xl border p-3.5 transition-colors ${isDone ? 'border-primary/40 bg-primary/[0.06]' : 'border-white/10 bg-white/[0.02]'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${isDone ? 'bg-primary text-bg' : 'border border-white/20 text-muted'}`}>
                        {isDone ? <Check size={13} /> : ex.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{ex.title}</p>
                        <p className="text-xs text-muted">{ex.goal}</p>
                        <code className="mt-2 block truncate rounded bg-black/50 px-2 py-1 font-mono text-xs text-primary">{ex.command}</code>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <button
                            onClick={() => typeAndRun(ex.command)}
                            disabled={busy}
                            className="rounded-md border border-primary/40 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
                          >
                            Type it for me
                          </button>
                          <CopyButton text={ex.command} />
                          <button
                            onClick={() => setOpenHint(openHint === ex.id ? null : ex.id)}
                            aria-expanded={openHint === ex.id}
                            className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-muted hover:text-ink"
                          >
                            Hint <ChevronDown size={11} className={openHint === ex.id ? 'rotate-180' : ''} />
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {openHint === ex.id && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pt-2 text-xs text-secondary"
                            >
                              💡 {ex.hint}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-primary/50 bg-primary/10 p-4 text-sm"
                >
                  <p className="font-display font-bold text-primary">🎉 Lab complete!</p>
                  <p className="mt-1 text-ink/90">You have used the same commands you will type on your real machine. Time for the real thing.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setCmdHistory([])
                setEntries([])
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink"
            >
              <Trash2 size={12} /> Clear terminal & history
            </button>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
