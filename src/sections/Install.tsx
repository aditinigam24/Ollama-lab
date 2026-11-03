import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Apple, Check, ExternalLink, Monitor, Terminal } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import CodeBlock from '../components/CodeBlock'

type OS = 'windows' | 'macos' | 'linux'

interface Step {
  title: string
  body: string
  code?: string
  lang?: string
  tip?: string
}

const OS_TABS: { id: OS; label: string; icon: typeof Monitor }[] = [
  { id: 'windows', label: 'Windows', icon: Monitor },
  { id: 'macos', label: 'macOS', icon: Apple },
  { id: 'linux', label: 'Linux', icon: Terminal },
]

const SHARED_TAIL = (lang: string, open: string): Step[] => [
  {
    title: 'Open a terminal',
    body: open,
    tip: 'You will type every Ollama command here.',
  },
  {
    title: 'Verify the installation',
    body: 'Ask Ollama for its version. If you see a version number, the command line tool is installed.',
    code: 'ollama --version',
    lang,
    tip: 'If the terminal says the command is not recognized / not found, close it, open a new one and try again.',
  },
  {
    title: 'Download a model',
    body: 'Installing Ollama does not include any model. Pull a small one — gemma3:1b is about 815 MB, so it downloads quickly and runs on most laptops.',
    code: 'ollama pull gemma3:1b',
    lang,
    tip: 'This step needs internet. Do it before class if the Wi-Fi is slow.',
  },
  {
    title: 'Run the model',
    body: 'Start an interactive session with the model. The first start is a bit slower while the model loads into memory.',
    code: 'ollama run gemma3:1b',
    lang,
  },
  {
    title: 'Start chatting',
    body: 'When you see the >>> prompt, type a question and press Enter. Type /bye to leave the chat. You are now running AI on your own machine.',
    code: '>>> Explain what an API is in one sentence.',
    lang: 'text',
    tip: 'Try asking for something about your studies. Everything stays on your computer.',
  },
]

const GUIDES: Record<OS, { intro: string; steps: Step[] }> = {
  windows: {
    intro: 'Windows uses a normal installer program. No command line is needed for installing.',
    steps: [
      {
        title: 'Download Ollama',
        body: 'Open ollama.com/download, choose Windows and download the installer (OllamaSetup.exe).',
        tip: 'Always download from the official page, not from a random link.',
      },
      {
        title: 'Install it',
        body: 'Double-click the installer and follow the prompts. When it finishes, Ollama starts in the background — look for its icon in the system tray.',
        tip: 'The desktop app starts the local server for you, so you will not usually need ollama serve.',
      },
      ...SHARED_TAIL('powershell', 'Press the Start button, type PowerShell, and open Windows PowerShell (or Windows Terminal).'),
    ],
  },
  macos: {
    intro: 'On a Mac you install Ollama like most apps: download, open, drag to Applications.',
    steps: [
      {
        title: 'Download Ollama',
        body: 'Open ollama.com/download, choose macOS and download the file. Check the download page for the minimum macOS version your Mac needs.',
      },
      {
        title: 'Install it',
        body: 'Open the downloaded file, move Ollama to your Applications folder, then launch it. If macOS asks for permission to set up the command line tool, allow it.',
        tip: 'Ollama then runs from the menu bar and starts the local server for you.',
      },
      ...SHARED_TAIL('bash', 'Press Cmd + Space, type Terminal and press Enter.'),
    ],
  },
  linux: {
    intro: 'On Linux, the official route is an install script run from the terminal.',
    steps: [
      {
        title: 'Download & install with one command',
        body: 'Open a terminal and run the official install script from ollama.com. It downloads Ollama and sets it up (normally as a background service). Prefer a manual install? The download page has manual install instructions.',
        code: 'curl -fsSL https://ollama.com/install.sh | sh',
        lang: 'bash',
        tip: 'Good habit: piping a script into a shell runs it with your permissions. Only do it for sources you trust — here, the official Ollama site.',
      },
      {
        title: 'Check the background service',
        body: 'On most distributions with systemd, the installer starts Ollama as a service so the local server is already running.',
        code: 'systemctl status ollama',
        lang: 'bash',
        tip: 'No service? Start the server yourself in a spare terminal with: ollama serve',
      },
      ...SHARED_TAIL('bash', 'You are probably already in one. If not, open your terminal app (often Ctrl + Alt + T).'),
    ],
  },
}

export default function Install() {
  const [os, setOs] = useState<OS>('windows')
  const [done, setDone] = useState<Record<string, boolean>>({})
  const guide = GUIDES[os]
  const doneCount = guide.steps.filter((_, i) => done[`${os}-${i}`]).length
  const pct = Math.round((doneCount / guide.steps.length) * 100)

  return (
    <SectionShell
      id="install"
      number="03"
      eyebrow="Installation masterclass"
      title={<>Zero to chatting in <span className="text-primary">seven steps.</span></>}
      intro="Pick your operating system and follow along. Tick each step as you finish it."
    >
      <Reveal>
        <div className="glass rounded-3xl p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex rounded-full border border-white/10 p-1" role="tablist" aria-label="Operating system">
              {OS_TABS.map((t) => {
                const TIcon = t.icon
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={os === t.id}
                    onClick={() => setOs(t.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      os === t.id ? 'bg-primary text-bg' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <TIcon size={15} /> {t.label}
                  </button>
                )
              })}
            </div>
            <a href="https://ollama.com/download" target="_blank" rel="noreferrer" className="btn-ghost">
              Official download page <ExternalLink size={14} />
            </a>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted">
              <span>{doneCount} of {guide.steps.length} steps done</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={os}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              role="tabpanel"
            >
              <p className="mt-6 text-muted">{guide.intro}</p>
              <ol className="relative mt-6 space-y-4 border-l border-white/10 pl-6 sm:pl-8">
                {guide.steps.map((s, i) => {
                  const key = `${os}-${i}`
                  const isDone = !!done[key]
                  return (
                    <li key={key} className="relative">
                      <button
                        onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                        aria-pressed={isDone}
                        aria-label={`Mark step ${i + 1} ${isDone ? 'not done' : 'done'}`}
                        className={`absolute -left-[41px] top-0 grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition-all sm:-left-[49px] ${
                          isDone ? 'border-primary bg-primary text-bg' : 'border-white/20 bg-bg text-muted hover:border-primary'
                        }`}
                      >
                        {isDone ? <Check size={15} /> : i + 1}
                      </button>
                      <div className={`rounded-2xl border p-5 transition-colors ${isDone ? 'border-primary/30 bg-primary/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                        <h3 className="font-display text-lg font-bold">{s.title}</h3>
                        <p className="mt-1.5 leading-relaxed text-muted">{s.body}</p>
                        {s.code && (
                          <div className="mt-4">
                            <CodeBlock code={s.code} language={s.lang ?? 'bash'} title={os === 'windows' ? 'PowerShell' : 'Terminal'} />
                          </div>
                        )}
                        {s.tip && (
                          <p className="mt-3 rounded-lg border-l-2 border-secondary bg-secondary/[0.07] px-3 py-2 text-sm text-ink/80">
                            <span className="font-semibold text-secondary">Tip · </span>
                            {s.tip}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </motion.div>
          </AnimatePresence>

          <p className="mt-6 text-xs text-muted">
            Installer details and system requirements can change. If something here looks different on your screen, trust the official page: ollama.com/download.
          </p>
        </div>
      </Reveal>
    </SectionShell>
  )
}
