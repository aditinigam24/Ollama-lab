import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ChevronLeft, ChevronRight, Menu, Presentation, X } from 'lucide-react'
import Hero from './sections/Hero'
import Basics from './sections/Basics'
import Architecture from './sections/Architecture'
import Install from './sections/Install'
import CommandCenter from './sections/CommandCenter'
import TerminalPlayground from './sections/TerminalPlayground'
import Models from './sections/Models'
import ApiExplorer from './sections/ApiExplorer'
import BuildApp from './sections/BuildApp'
import Troubleshooting from './sections/Troubleshooting'
import Quiz from './sections/Quiz'
import Mission from './sections/Mission'

interface SectionDef {
  id: string
  label: string
  render: (go: (id: string) => void) => ReactElement
}

const SECTIONS: SectionDef[] = [
  { id: 'hero', label: 'Start', render: (go) => <Hero onStart={() => go('basics')} /> },
  { id: 'basics', label: 'Basics', render: () => <Basics /> },
  { id: 'how', label: 'How it works', render: () => <Architecture /> },
  { id: 'install', label: 'Install', render: () => <Install /> },
  { id: 'commands', label: 'Commands', render: () => <CommandCenter /> },
  { id: 'terminal', label: 'Terminal', render: () => <TerminalPlayground /> },
  { id: 'models', label: 'Models', render: () => <Models /> },
  { id: 'api', label: 'API', render: () => <ApiExplorer /> },
  { id: 'build', label: 'Build an app', render: () => <BuildApp /> },
  { id: 'troubleshoot', label: 'Troubleshoot', render: () => <Troubleshooting /> },
  { id: 'quiz', label: 'Quiz', render: () => <Quiz /> },
  { id: 'mission', label: 'Mission', render: () => <Mission /> },
]

export default function App() {
  const [presenting, setPresenting] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('hero')

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  const ids = useMemo(() => SECTIONS.map((s) => s.id), [])

  /* ---------- normal scrolling mode ---------- */
  const scrollToId = useCallback((id: string) => {
    setMenuOpen(false)
    // Wait a beat so the mobile menu finishes closing; starting the smooth scroll
    // in the same tick as the layout change can cancel it.
    window.setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: id === 'hero' ? 0 : top, behavior: 'smooth' })
    }, 80)
  }, [])

  useEffect(() => {
    if (presenting) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [presenting, ids])

  /* ---------- presentation mode ---------- */
  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(SECTIONS.length - 1, next))
      setIndex((cur) => {
        if (clamped !== cur) setDirection(clamped > cur ? 1 : -1)
        return clamped
      })
    },
    [],
  )

  const startPresenting = () => {
    const current = Math.max(0, ids.indexOf(active))
    setIndex(current)
    setDirection(1)
    setPresenting(true)
    setMenuOpen(false)
  }

  const stopPresenting = useCallback(() => {
    setPresenting(false)
    const id = ids[index]
    // restore scroll position to the section we left
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 50)
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
  }, [ids, index])

  const requestFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => undefined)
    else document.exitFullscreen().catch(() => undefined)
  }

  useEffect(() => {
    if (!presenting) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if (e.key === 'Escape') {
        stopPresenting()
        return
      }
      if (typing) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        goTo(index + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(index - 1)
      } else if (e.key === 'Home') goTo(0)
      else if (e.key === 'End') goTo(SECTIONS.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [presenting, index, goTo, stopPresenting])

  useEffect(() => {
    if (presenting) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [presenting])

  /* ---------- render ---------- */
  return (
    <div className="relative min-h-screen bg-bg text-ink">
      {/* scroll progress */}
      {!presenting && (
        <motion.div style={{ scaleX: progress }} className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-primary" />
      )}

      {/* navbar */}
      {!presenting && (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-bg/70 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <button onClick={() => scrollToId('hero')} className="flex items-center gap-2 font-display text-sm font-bold tracking-wide">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-[11px] font-black text-bg">O</span>
              OLLAMA<span className="text-primary">LAB</span>
            </button>

            <nav className="hidden items-center gap-1 xl:flex" aria-label="Sections">
              {SECTIONS.slice(1).map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToId(s.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    active === s.id ? 'bg-primary/15 text-primary' : 'text-muted hover:text-ink'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={startPresenting} className="btn-ghost !px-4 !py-2 text-xs">
                <Presentation size={14} /> <span className="hidden sm:inline">Presentation mode</span>
                <span className="sm:hidden">Present</span>
              </button>
              <button
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 xl:hidden"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/5 xl:hidden"
                aria-label="Sections mobile"
              >
                <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
                  {SECTIONS.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToId(s.id)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm ${
                        active === s.id ? 'border-primary/50 text-primary' : 'border-white/10 text-muted'
                      }`}
                    >
                      <span className="mr-2 font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* normal page */}
      {!presenting && (
        <main>
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id === 'hero' ? 'hero' : undefined}>
              {s.render(scrollToId)}
            </div>
          ))}
          <footer className="border-t border-white/5 px-4 py-10 text-center text-sm text-muted">
            <p className="font-display text-base text-ink">
              OLLAMA<span className="text-primary">LAB</span> · Your First Journey Into Local AI
            </p>
            <p className="mt-2">
              Built for the Codec Club workshop. Always check the official docs at{' '}
              <a className="text-primary underline-offset-4 hover:underline" href="https://docs.ollama.com/" target="_blank" rel="noreferrer">
                docs.ollama.com
              </a>{' '}
              for the latest details.
            </p>
          </footer>
        </main>
      )}

      {/* presentation mode */}
      <AnimatePresence>
        {presenting && (
          <motion.div
            key="presenter"
            className="presenting fixed inset-0 z-[70] flex flex-col bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-display text-sm font-bold">
                  OLLAMA<span className="text-primary">LAB</span>
                </span>
                <span className="hidden h-4 w-px bg-white/15 sm:block" />
                <span className="hidden truncate text-sm text-muted sm:block">
                  {index + 1} / {SECTIONS.length} · {SECTIONS[index].label}
                </span>
              </div>

              {/* progress dots */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Section progress">
                {SECTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to ${s.label}`}
                    title={s.label}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? 'w-7 bg-primary' : i < index ? 'w-2 bg-primary/50' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={requestFullscreen} className="btn-ghost !px-3 !py-1.5 text-xs">
                  Fullscreen
                </button>
                <button onClick={stopPresenting} className="btn-ghost !px-3 !py-1.5 text-xs" aria-label="Exit presentation mode">
                  <X size={14} /> Exit
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={SECTIONS[index].id}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: 80 * d }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: -80 * d }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 overflow-y-auto"
                >
                  {SECTIONS[index].render((id) => goTo(ids.indexOf(id)))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
              <button onClick={() => goTo(index - 1)} disabled={index === 0} className="btn-ghost disabled:cursor-not-allowed disabled:opacity-30">
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="hidden font-mono text-xs text-muted md:block">← → arrow keys to navigate · Esc to exit</span>
              <button onClick={() => goTo(index + 1)} disabled={index === SECTIONS.length - 1} className="btn-primary disabled:cursor-not-allowed disabled:opacity-30">
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
