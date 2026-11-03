import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Braces, Globe, Network, Play, Plug, Send, Waypoints } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'

const CONCEPTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Plug,
    title: 'What is an API?',
    body: 'An API (Application Programming Interface) is a menu of requests one program can make to another. Your app does not need to know how the model works — it just sends a request in the agreed format and reads the reply.',
  },
  {
    icon: Globe,
    title: 'What is localhost?',
    body: 'localhost is a special name that always means "this computer". A request to localhost never leaves your machine, which is why a local model can answer without the internet.',
  },
  {
    icon: Network,
    title: 'What is port 11434?',
    body: 'A computer can run many network programs at once. A port number tells it which one you want. Ollama listens on port 11434 by default, so the address is http://localhost:11434.',
  },
  {
    icon: Send,
    title: 'What is an HTTP POST request?',
    body: 'HTTP is the language of the web. A POST request sends data to a server along with the request. To chat with a model, you POST your messages to /api/chat.',
  },
  {
    icon: Braces,
    title: 'What is JSON?',
    body: 'JSON is a simple text format for structured data: curly braces for objects, square brackets for lists, and "key": value pairs. Both your request and Ollama\'s reply are JSON.',
  },
  {
    icon: Waypoints,
    title: 'How does an app talk to a local model?',
    body: 'Your app POSTs JSON to Ollama on localhost:11434. Ollama loads the model, runs inference, and returns JSON. The model itself never talks to the network — Ollama is the doorway.',
  },
]

const REQUEST_JSON = `{
  "model": "gemma3:1b",
  "messages": [
    { "role": "user", "content": "Why is the sky blue?" }
  ],
  "stream": false
}`

const REQUEST_STREAM_JSON = `{
  "model": "gemma3:1b",
  "messages": [
    { "role": "user", "content": "Why is the sky blue?" }
  ],
  "stream": true
}`

const RESPONSE_FULL = `{
  "model": "gemma3:1b",
  "created_at": "2025-01-01T12:00:00.000Z",
  "message": {
    "role": "assistant",
    "content": "The sky looks blue because air scatters short blue wavelengths of sunlight more than long red ones."
  },
  "done": true
}`

const STREAM_LINES = [
  '{"model":"gemma3:1b","message":{"role":"assistant","content":"The"},"done":false}',
  '{"model":"gemma3:1b","message":{"role":"assistant","content":" sky"},"done":false}',
  '{"model":"gemma3:1b","message":{"role":"assistant","content":" looks"},"done":false}',
  '{"model":"gemma3:1b","message":{"role":"assistant","content":" blue"},"done":false}',
  '{"model":"gemma3:1b","message":{"role":"assistant","content":"…"},"done":false}',
  '{"model":"gemma3:1b","message":{"role":"assistant","content":""},"done":true}',
]

const CURL_NON_STREAM = `curl http://localhost:11434/api/chat -d '{
  "model": "gemma3:1b",
  "messages": [
    { "role": "user", "content": "Why is the sky blue?" }
  ],
  "stream": false
}'`

const CURL_STREAM = `curl http://localhost:11434/api/chat -d '{
  "model": "gemma3:1b",
  "messages": [
    { "role": "user", "content": "Why is the sky blue?" }
  ]
}'`

const PY_REQUESTS = `import requests

url = "http://localhost:11434/api/chat"

payload = {
    "model": "gemma3:1b",
    "messages": [
        {"role": "user", "content": "Why is the sky blue?"}
    ],
    "stream": False,
}

response = requests.post(url, json=payload)
data = response.json()

print(data["message"]["content"])`

const PY_STREAM = `import json
import requests

url = "http://localhost:11434/api/chat"

payload = {
    "model": "gemma3:1b",
    "messages": [
        {"role": "user", "content": "Why is the sky blue?"}
    ],
    "stream": True,   # the default for /api/chat
}

with requests.post(url, json=payload, stream=True) as response:
    for line in response.iter_lines():
        if not line:
            continue
        chunk = json.loads(line)
        print(chunk["message"]["content"], end="", flush=True)
        if chunk.get("done"):
            print()`

const PY_LIB = `import ollama

response = ollama.chat(
    model="gemma3:1b",
    messages=[{"role": "user", "content": "Why is the sky blue?"}],
)

print(response["message"]["content"])`

type CodeTab = 'curl' | 'requests' | 'library'

function FlowDemo() {
  const [stream, setStream] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'request' | 'thinking' | 'response' | 'done'>('idle')
  const [lines, setLines] = useState<string[]>([])
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clear, [])

  const run = () => {
    clear()
    setLines([])
    setPhase('request')
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    at(1400, () => setPhase('thinking'))
    at(2600, () => {
      setPhase('response')
      if (stream) {
        STREAM_LINES.forEach((l, i) => at(i * 450, () => setLines((prev) => [...prev, l])))
        at(STREAM_LINES.length * 450 + 200, () => setPhase('done'))
      } else {
        setLines([RESPONSE_FULL])
        at(900, () => setPhase('done'))
      }
    })
  }

  const steps = [
    { id: 'app', label: 'Your app', sub: 'Python / curl' },
    { id: 'ollama', label: 'Ollama', sub: 'localhost:11434' },
    { id: 'model', label: 'Local model', sub: 'gemma3:1b' },
  ]
  const activeIdx = phase === 'request' ? 0.5 : phase === 'thinking' ? 1.5 : phase === 'response' ? 0.5 : -1

  return (
    <div className="glass rounded-3xl p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Animated flow</p>
          <h3 className="mt-1 font-display text-xl font-bold sm:text-2xl">POST http://localhost:11434/api/chat</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-white/10 p-1 text-xs" role="group" aria-label="Response mode">
            {[false, true].map((s) => (
              <button
                key={String(s)}
                onClick={() => {
                  clear()
                  setStream(s)
                  setPhase('idle')
                  setLines([])
                }}
                aria-pressed={stream === s}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors ${stream === s ? 'bg-primary text-bg' : 'text-muted hover:text-ink'}`}
              >
                {s ? 'stream: true' : 'stream: false'}
              </button>
            ))}
          </div>
          <button onClick={run} className="btn-primary !px-5 !py-2.5 !text-xs">
            <Play size={13} /> Send request
          </button>
        </div>
      </div>

      {/* nodes + packets */}
      <div className="relative mt-8 grid grid-cols-3 items-center gap-2">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-2xl border px-3 py-4 text-center transition-all ${
              Math.abs(activeIdx - i) <= 0.5 ? 'border-primary bg-primary/10 shadow-glow' : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <p className="font-display text-sm font-bold">{s.label}</p>
            <p className="font-mono text-[11px] text-muted">{s.sub}</p>
          </div>
        ))}
        <AnimatePresence>
          {(phase === 'request' || phase === 'response') && (
            <motion.span
              key={phase}
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow-glow"
              initial={{ left: phase === 'request' ? '16%' : '50%', opacity: 0 }}
              animate={{ left: phase === 'request' ? '50%' : '16%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          )}
          {phase === 'thinking' && (
            <motion.span
              key="think"
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-secondary shadow-glow"
              initial={{ left: '50%', opacity: 0 }}
              animate={{ left: '84%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 min-h-[1.5rem] text-center font-mono text-xs text-muted" aria-live="polite">
        {phase === 'idle' && 'Press "Send request" to watch the round trip.'}
        {phase === 'request' && '① Your app POSTs a JSON request to Ollama.'}
        {phase === 'thinking' && '② Ollama loads the model and runs inference on your machine.'}
        {phase === 'response' && (stream ? '③ Tokens stream back as many small JSON lines.' : '③ One complete JSON reply comes back at the end.')}
        {phase === 'done' && '✓ Done. The whole round trip stayed on your computer.'}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <ArrowRight size={13} /> Request body (JSON)
          </p>
          <CodeBlock code={stream ? REQUEST_STREAM_JSON : REQUEST_JSON} language="json" title="request" />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary">
            <ArrowRight size={13} className="rotate-180" /> Response
          </p>
          <div className="min-h-[190px] overflow-x-auto rounded-xl border border-white/10 bg-[#0b100d] p-4 font-mono text-[12px] leading-relaxed">
            {lines.length === 0 && <span className="text-muted/60">{phase === 'idle' ? 'The response will appear here…' : 'waiting for the model…'}</span>}
            {lines.map((l, i) => (
              <motion.pre
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-pre-wrap break-words text-[#7ee8ff]"
              >
                {l}
              </motion.pre>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Illustrative output — real responses also include timing fields such as total_duration. <strong className="text-ink">Streaming</strong> (the default for /api/chat) sends the answer in many small pieces so your app can show words as they are generated. <strong className="text-ink">Non-streaming</strong> (stream: false) waits and sends one complete reply.
      </p>
    </div>
  )
}

export default function ApiExplorer() {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState<CodeTab>('curl')
  const [streamCode, setStreamCode] = useState(false)
  const C = CONCEPTS[sel]
  const CIcon = C.icon

  const code =
    tab === 'curl'
      ? streamCode ? CURL_STREAM : CURL_NON_STREAM
      : tab === 'requests'
        ? streamCode ? PY_STREAM : PY_REQUESTS
        : PY_LIB

  return (
    <SectionShell
      id="api"
      number="07"
      eyebrow="Ollama API explorer"
      title={<>Let your own code <span className="text-primary">talk to the model.</span></>}
      intro="When Ollama is running it also offers a local web API. That is how apps, websites and scripts use your models."
    >
      <Reveal>
        <div className="glass rounded-3xl p-5 sm:p-8">
          <div className="grid gap-5 md:grid-cols-[260px_1fr]">
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible" role="tablist" aria-label="API concepts">
              {CONCEPTS.map((c, i) => {
                const Ico = c.icon
                return (
                  <button
                    key={c.title}
                    role="tab"
                    aria-selected={sel === i}
                    onClick={() => setSel(i)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${
                      sel === i ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted hover:text-ink'
                    }`}
                  >
                    <Ico size={16} className="shrink-0" /> {c.title}
                  </button>
                )
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6"
              >
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                  <CIcon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold">{C.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/90">{C.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      <div className="mt-8">
        <Reveal>
          <FlowDemo />
        </Reveal>
      </div>

      <div className="mt-8">
        <Reveal>
          <div className="glass rounded-3xl p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold sm:text-2xl">Copy-and-run examples</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-full border border-white/10 p-1 text-xs" role="tablist" aria-label="Language">
                  {([
                    ['curl', 'curl'],
                    ['requests', 'Python (requests)'],
                    ['library', 'Python (ollama)'],
                  ] as [CodeTab, string][]).map(([id, label]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={tab === id}
                      onClick={() => setTab(id)}
                      className={`rounded-full px-3 py-1.5 font-medium transition-colors ${tab === id ? 'bg-primary text-bg' : 'text-muted hover:text-ink'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {tab !== 'library' && (
                  <button onClick={() => setStreamCode((s) => !s)} aria-pressed={streamCode} className="btn-ghost !px-3.5 !py-1.5 text-xs">
                    {streamCode ? 'Streaming' : 'Non-streaming'}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5">
              <CodeBlock code={code} language={tab === 'curl' ? 'bash' : 'python'} title={tab === 'curl' ? 'terminal' : 'example.py'} />
            </div>

            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted">
              <li>
                <span className="font-semibold text-ink">Before you run:</span> Ollama must be running and the model pulled (ollama pull gemma3:1b).
              </li>
              {tab === 'requests' && (
                <li>
                  <span className="font-semibold text-ink">Install the helper:</span> <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">pip install requests</code>
                </li>
              )}
              {tab === 'library' && (
                <li>
                  <span className="font-semibold text-ink">Install the official library:</span> <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">pip install ollama</code>. It wraps the same API with friendlier Python functions. Add <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">stream=True</code> to receive the answer piece by piece.
                </li>
              )}
              {tab === 'curl' && (
                <li>
                  <span className="font-semibold text-ink">Windows PowerShell:</span> plain <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono">curl</code> is an alias for a different command, and Windows shells handle quotes differently from the single quotes used here. On Windows, use the Python tabs (or Git Bash) for these examples.
                </li>
              )}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
