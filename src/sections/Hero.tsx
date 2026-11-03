import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { lazy, Suspense } from 'react'
import AnimatedTerminal from '../components/AnimatedTerminal'

// the 3D scene (three.js) is the heaviest part of the page, so it loads separately
const NeuralNetwork = lazy(() => import('../components/NeuralNetwork'))

const FLOATING = [
  { text: 'ollama run gemma3:1b', className: 'left-[3%] top-[22%]', delay: 0 },
  { text: 'localhost:11434', className: 'right-[5%] top-[16%]', delay: 1.2 },
  { text: '{ "role": "user" }', className: 'left-[47%] bottom-[12%]', delay: 2.1 },
  { text: 'ollama list', className: 'right-[9%] bottom-[20%]', delay: 0.6 },
]

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid-bg relative flex min-h-screen items-center overflow-hidden px-4 pb-24 pt-24 sm:px-6">
      {/* 3D layer */}
      <div className="absolute inset-0 opacity-90 lg:left-[28%]">
        <Suspense fallback={null}>
          <NeuralNetwork />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#070A08_85%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent lg:from-bg/90" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      {/* floating code snippets */}
      {FLOATING.map((f) => (
        <motion.div
          key={f.text}
          className={`pointer-events-none absolute hidden rounded-lg border border-primary/20 bg-surface/60 px-3 py-1.5 font-mono text-xs text-primary/80 backdrop-blur md:block ${f.className}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.35, 0.8, 0.35], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
          aria-hidden
        >
          {f.text}
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Codec Club · Workshop · Your first journey into local AI
          </motion.p>

          <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            {['STOP USING AI.', 'START RUNNING AI.'].map((line, i) => (
              <motion.span
                key={line}
                className={`block ${i === 1 ? 'text-primary drop-shadow-[0_0_24px_rgba(182,255,74,0.35)]' : ''}`}
                initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            Discover the world of Local AI. Run powerful language models directly on your own machine using Ollama.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <button onClick={onStart} className="btn-primary animate-none shadow-glow">
              START YOUR AI JOURNEY <ArrowRight size={16} />
            </button>
            <span className="font-mono text-xs text-muted">12 interactive sections · no API key · no backend</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedTerminal />
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.button
        onClick={onStart}
        aria-label="Scroll to next section"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-primary"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll
        <ChevronDown size={16} />
      </motion.button>
    </section>
  )
}
