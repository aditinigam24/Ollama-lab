import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Folder, FileCode2, MessageCircle, Repeat, Wrench } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'

interface Chunk {
  title: string
  code: string
  after: string
  explain: string[]
}

const CHUNKS: Chunk[] = [
  {
    title: 'Import the library',
    code: String.raw`import ollama`,
    after: '\n\n',
    explain: ['import ollama — loads the official Ollama Python library (installed with pip install ollama).', 'It sends your messages to the local Ollama server on port 11434 for you.'],
  },
  {
    title: 'Choose the model',
    code: String.raw`MODEL = "gemma3:1b"`,
    after: '\n\n',
    explain: ['MODEL = "gemma3:1b" — stores the model name in one place.', 'It must already be downloaded with ollama pull gemma3:1b. Change this line later to try another model.'],
  },
  {
    title: 'Give it a personality',
    code: String.raw`SYSTEM_PROMPT = (
    "You are Study Buddy, a friendly tutor for college students. "
    "Explain ideas simply, use short examples, and end with one quick "
    "question to check understanding."
)`,
    after: '\n\n',
    explain: [
      'SYSTEM_PROMPT — the instructions that shape how the model behaves.',
      'The three quoted strings inside the brackets are joined into one long sentence.',
      'Editing this text is the easiest way to change your app.',
    ],
  },
  {
    title: 'Start the app and the memory',
    code: String.raw`def main():
    print("Study Buddy is ready! Type 'quit' to exit.\n")
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]`,
    after: '\n\n',
    explain: [
      'def main(): — a function that holds the whole program.',
      'print(...) — greets the student. \\n adds an empty line.',
      'messages = [...] — the conversation history. It starts with only the system message. Models do not remember anything by themselves, so we send the whole history every time.',
    ],
  },
  {
    title: 'Read the student’s question',
    code: String.raw`    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in {"quit", "exit"}:
            print("Good luck with your studies!")
            break
        if not user_input:
            continue`,
    after: '\n\n',
    explain: [
      'while True: — repeat forever, until we break out.',
      'input("You: ").strip() — waits for typing and removes extra spaces.',
      'if ... in {"quit", "exit"} — lets the student leave; break ends the loop.',
      'if not user_input: continue — ignores empty lines and asks again.',
    ],
  },
  {
    title: 'Add it to the history',
    code: String.raw`        messages.append({"role": "user", "content": user_input})

        print("Buddy: ", end="", flush=True)
        reply = ""`,
    after: '\n\n',
    explain: [
      'messages.append(...) — adds the student’s message to the history with role "user".',
      'print("Buddy: ", end="", flush=True) — prints a label without starting a new line.',
      'reply = "" — an empty string that will collect the answer.',
    ],
  },
  {
    title: 'Ask the model (streaming)',
    code: String.raw`        try:
            for chunk in ollama.chat(model=MODEL, messages=messages, stream=True):
                piece = chunk["message"]["content"]
                print(piece, end="", flush=True)
                reply += piece
        except Exception as error:
            print(f"\n[Could not reach Ollama: {error}]")
            messages.pop()
            continue`,
    after: '\n\n',
    explain: [
      'ollama.chat(..., stream=True) — sends the history to the model and returns the answer in small pieces.',
      'for chunk in ... — runs once per piece; chunk["message"]["content"] is the new text.',
      'print(piece, end="", flush=True) — shows words as they appear, like a chat app.',
      'reply += piece — builds the complete answer so we can save it.',
      'try / except — if Ollama is not running, we print a friendly message, remove the unanswered question with messages.pop(), and ask again.',
    ],
  },
  {
    title: 'Remember the answer',
    code: String.raw`        print("\n")
        messages.append({"role": "assistant", "content": reply})`,
    after: '\n\n',
    explain: [
      'print("\\n") — adds spacing after the answer.',
      'messages.append(... "assistant" ...) — saves the model’s reply, so the next question can build on it. This is the chatbot’s memory.',
    ],
  },
  {
    title: 'Start the program',
    code: String.raw`if __name__ == "__main__":
    main()`,
    after: '\n',
    explain: ['This standard Python line means: “if this file is run directly, call main()”. It is what actually starts the app.'],
  },
]

const FULL_CODE = CHUNKS.map((c) => c.code + c.after).join('')

const STRUCTURE = String.raw`study-buddy/
├── .venv/              # virtual environment (created by Python)
├── requirements.txt    # list of dependencies
└── study_buddy.py      # the app you just read`

const SETUP = String.raw`# 1. create a project folder and enter it
mkdir study-buddy
cd study-buddy

# 2. create and activate a virtual environment
python -m venv .venv
# macOS / Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1

# 3. install the Ollama Python library
pip install ollama

# 4. make sure the model is downloaded
ollama pull gemma3:1b`

const RUN = String.raw`python study_buddy.py`

type Tab = 'walk' | 'full'

export default function BuildApp() {
  const [tab, setTab] = useState<Tab>('walk')
  const [active, setActive] = useState(0)
  const chunk = CHUNKS[active]

  return (
    <SectionShell
      id="build"
      number="08"
      eyebrow="Build your first AI app"
      title={<>Meet <span className="text-primary">Study Buddy.</span> Your first local AI app.</>}
      intro="About 40 lines of Python. It runs a local Gemma model, streams answers word by word, and remembers the conversation."
    >
      {/* setup */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-2xl p-5 sm:p-6">
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <Folder size={18} className="text-primary" /> 1 · Project structure
            </h3>
            <CodeBlock code={STRUCTURE} language="text" title="folder" />
            <p className="mt-3 text-sm text-muted">requirements.txt only needs one line: <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">ollama</code>. A virtual environment keeps this project's packages separate from the rest of your computer.</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="glass h-full rounded-2xl p-5 sm:p-6">
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <Wrench size={18} className="text-primary" /> 2 · Set up & install
            </h3>
            <CodeBlock code={SETUP} language="bash" title="terminal" />
          </div>
        </Reveal>
      </div>

      {/* code */}
      <Reveal>
        <div className="glass mt-6 rounded-3xl p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold sm:text-xl">
              <FileCode2 size={20} className="text-primary" /> 3 · study_buddy.py
            </h3>
            <div className="flex rounded-full border border-white/10 p-1 text-xs" role="tablist" aria-label="Code view">
              {([['walk', 'Line-by-line walkthrough'], ['full', 'Full file']] as [Tab, string][]).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${tab === id ? 'bg-primary text-bg' : 'text-muted hover:text-ink'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {tab === 'full' ? (
            <div className="mt-5">
              <CodeBlock code={FULL_CODE} language="python" title="study_buddy.py" />
            </div>
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-2">
                {CHUNKS.map((c, i) => (
                  <button
                    key={c.title}
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={`block w-full rounded-xl border p-3 text-left transition-colors ${
                      active === i ? 'border-primary/60 bg-primary/[0.07]' : 'border-white/10 bg-[#0b100d] hover:border-white/25'
                    }`}
                  >
                    <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted">
                      {i + 1}. {c.title}
                    </span>
                    <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-ink/90">{c.code}</pre>
                  </button>
                ))}
              </div>
              <div className="lg:sticky lg:top-20 lg:self-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-primary/30 bg-primary/[0.05] p-5"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-wider text-primary">What it does</p>
                    <h4 className="mt-1 font-display text-lg font-bold">{chunk.title}</h4>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
                      {chunk.explain.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                    <div className="mt-5 flex gap-2">
                      <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0} className="btn-ghost !px-4 !py-1.5 text-xs disabled:opacity-30">
                        Previous
                      </button>
                      <button onClick={() => setActive((a) => Math.min(CHUNKS.length - 1, a + 1))} disabled={active === CHUNKS.length - 1} className="btn-ghost !px-4 !py-1.5 text-xs disabled:opacity-30">
                        Next
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* run */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-2xl p-5 sm:p-6">
            <h3 className="mb-3 font-display text-lg font-bold">4 · Run it</h3>
            <CodeBlock code={RUN} language="bash" title="terminal" />
            <p className="mt-3 text-sm text-muted">Keep Ollama running in the background (the desktop app, or <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-primary">ollama serve</code>). If you see "Could not reach Ollama", start it and try again.</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-[#0b100d] p-4 font-mono text-[12px] leading-relaxed">
              <p className="text-muted">Study Buddy is ready! Type 'quit' to exit.</p>
              <p><span className="text-primary">You: </span>Explain recursion simply</p>
              <p className="text-[#7ee8ff]"><span className="text-primary">Buddy: </span>Recursion is when a function solves a problem by calling itself on a smaller version of the same problem…</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="glass h-full rounded-2xl p-5 sm:p-6">
            <h3 className="mb-3 font-display text-lg font-bold">Try these upgrades</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-muted">
              <li>✏️ Edit SYSTEM_PROMPT to make a quiz master, a code reviewer or a language partner.</li>
              <li>🔁 Change MODEL to another model you have pulled.</li>
              <li>💾 Save the messages list to a file so conversations survive restarts.</li>
              <li>🌐 Wrap it in a small web page that calls the same API.</li>
            </ul>
          </div>
        </Reveal>
      </div>

      {/* chatbot vs agent */}
      <div className="mt-14">
        <Reveal>
          <p className="eyebrow">Level up</p>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Chatbot vs AI agent</h3>
          <p className="mt-2 max-w-2xl text-muted">Study Buddy is a <strong className="text-ink">chatbot</strong>. People often say "agent" for something more autonomous. Here is the difference.</p>
        </Reveal>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-2xl p-6">
              <MessageCircle className="mb-3 text-secondary" />
              <h4 className="font-display text-xl font-bold">Basic chatbot</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                <li>Waits for your message, then replies. You steer every step.</li>
                <li>Only produces text from what the model already knows.</li>
                <li>Cannot open files, browse, or run code by itself.</li>
                <li><span className="text-ink">Example:</span> Study Buddy.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-primary/40 bg-primary/[0.05] p-6 shadow-glow">
              <Bot className="mb-3 text-primary" />
              <h4 className="font-display text-xl font-bold">AI agent</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
                <li>You give it a goal; it decides the steps.</li>
                <li>Can use tools — search, read files, run calculations, call APIs.</li>
                <li>Loops: think → act → look at the result → repeat until done.</li>
                <li>Needs guardrails, because it takes actions on its own.</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="glass mt-5 rounded-2xl p-6">
            <h4 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Repeat size={18} className="text-primary" /> The agent loop
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {['Goal', 'Think / plan', 'Call a tool', 'Observe result', 'Done?'].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <motion.span
                    className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {s}
                  </motion.span>
                  {i < arr.length - 1 && <span className="text-muted">→</span>}
                </div>
              ))}
              <span className="text-muted">↺ loop back to “Think” if not done</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Ollama supports tool calling on its chat API for models that offer it — look for the "tools" label on a model's page in the library before building an agent. Not every model supports tools.
            </p>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
