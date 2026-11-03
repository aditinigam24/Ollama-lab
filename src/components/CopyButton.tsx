import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export default function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string
  label?: string
  className?: string
}) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')

  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const ok = await copyText(text)
    setState(ok ? 'ok' : 'fail')
    setTimeout(() => setState('idle'), 1600)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${text.slice(0, 40)}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-all hover:border-primary/50 hover:text-primary active:scale-95 ${className}`}
    >
      {state === 'ok' ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
      {state === 'ok' ? 'Copied' : state === 'fail' ? 'Press Ctrl+C' : label}
    </button>
  )
}
