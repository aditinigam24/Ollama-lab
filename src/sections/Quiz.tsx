import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'
import SectionShell from '../components/SectionShell'
import Reveal from '../components/Reveal'
import { QUIZ } from '../data/quiz'

function verdict(score: number) {
  if (score === QUIZ.length) return { title: 'Perfect score!', msg: 'You are ready to run local AI on your own machine.' }
  if (score >= 8) return { title: 'Excellent!', msg: 'You clearly understand the essentials. Just revisit the one or two you missed.' }
  if (score >= 5) return { title: 'Good progress', msg: 'You have the basics. Skim the sections for the questions you missed, then try again.' }
  return { title: 'Keep going', msg: 'No problem — this is all new. Review the earlier sections and retry; it gets easier quickly.' }
}

export default function Quiz() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUIZ.length).fill(null))

  const q = QUIZ[index]
  const answered = picked !== null
  const correct = picked === q.answer
  const progress = ((finished ? QUIZ.length : index + (answered ? 1 : 0)) / QUIZ.length) * 100

  const choose = (i: number) => {
    if (answered) return
    setPicked(i)
    const ok = i === q.answer
    if (ok) setScore((s) => s + 1)
    setAnswers((a) => a.map((x, idx) => (idx === index ? ok : x)))
  }

  const next = () => {
    if (index + 1 >= QUIZ.length) {
      setFinished(true)
    } else {
      setIndex(index + 1)
      setPicked(null)
    }
  }

  const retry = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setAnswers(Array(QUIZ.length).fill(null))
  }

  const v = verdict(score)

  return (
    <SectionShell
      id="quiz"
      number="10"
      eyebrow="Interactive quiz"
      title={<>Check what <span className="text-primary">stuck.</span></>}
      intro="Ten beginner questions with instant feedback. No pressure — you can retry as often as you like."
    >
      <Reveal>
        <div className="glass mx-auto max-w-3xl rounded-3xl p-5 sm:p-8">
          {/* progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted">
              <span>{finished ? 'Finished' : `Question ${index + 1} of ${QUIZ.length}`}</span>
              <span>
                Score: <span className="text-primary">{score}</span> / {QUIZ.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden>
              {answers.map((a, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${a === null ? 'bg-white/10' : a ? 'bg-primary' : 'bg-[#ff6b6b]'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">{q.q}</h3>
                <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Answer options">
                  {q.options.map((opt, i) => {
                    const isPicked = picked === i
                    const isRight = i === q.answer
                    let style = 'border-white/10 hover:border-primary/50 hover:bg-white/[0.03]'
                    if (answered) {
                      if (isRight) style = 'border-primary bg-primary/10'
                      else if (isPicked) style = 'border-[#ff6b6b] bg-[#ff6b6b]/10'
                      else style = 'border-white/10 opacity-50'
                    }
                    return (
                      <button
                        key={opt}
                        role="radio"
                        aria-checked={isPicked}
                        disabled={answered}
                        onClick={() => choose(i)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all sm:text-base ${style}`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-xs ${answered && isRight ? 'border-primary bg-primary text-bg' : answered && isPicked ? 'border-[#ff6b6b] bg-[#ff6b6b] text-bg' : 'border-white/20 text-muted'}`}>
                          {answered && isRight ? <Check size={14} /> : answered && isPicked ? <X size={14} /> : String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed ${correct ? 'border-primary/40 bg-primary/[0.07]' : 'border-[#ff6b6b]/40 bg-[#ff6b6b]/[0.07]'}`}
                      role="status"
                    >
                      <p className={`mb-1 font-display font-bold ${correct ? 'text-primary' : 'text-[#ff6b6b]'}`}>{correct ? 'Correct!' : 'Not quite.'}</p>
                      <p className="text-ink/90">{q.explain}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex justify-end">
                  <button onClick={next} disabled={!answered} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
                    {index + 1 >= QUIZ.length ? 'See my score' : 'Next question'} <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="final" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                <motion.div
                  initial={{ rotate: -20, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-primary/15 text-primary shadow-glow"
                >
                  <Trophy size={38} />
                </motion.div>
                <p className="font-display text-6xl font-bold text-primary">
                  {score}
                  <span className="text-3xl text-muted">/{QUIZ.length}</span>
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold">{v.title}</h3>
                <p className="mx-auto mt-2 max-w-md text-muted">{v.msg}</p>
                <button onClick={retry} className="btn-primary mt-7">
                  <RotateCcw size={15} /> Retry quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </SectionShell>
  )
}
