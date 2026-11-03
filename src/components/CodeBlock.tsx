import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell'
import CopyButton from './CopyButton'

SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('powershell', powershell)

const theme: Record<string, React.CSSProperties> = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...(vscDarkPlus['pre[class*="language-"]'] as React.CSSProperties),
    background: 'transparent',
    margin: 0,
    padding: 0,
    fontSize: '0.85rem',
  },
  'code[class*="language-"]': {
    ...(vscDarkPlus['code[class*="language-"]'] as React.CSSProperties),
    background: 'transparent',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  },
}

export default function CodeBlock({
  code,
  language = 'bash',
  title,
  copyText,
  showCopy = true,
}: {
  code: string
  language?: string
  title?: string
  /** What gets copied if different from the displayed code (e.g. strip prompt chars) */
  copyText?: string
  showCopy?: boolean
}) {
  return (
    <div className="group overflow-hidden rounded-xl border border-white/10 bg-[#0b100d]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80" />
          {title && <span className="ml-2 font-mono text-[11px] text-muted">{title}</span>}
        </div>
        {showCopy && <CopyButton text={copyText ?? code} />}
      </div>
      <div className="overflow-x-auto p-4">
        <SyntaxHighlighter language={language} style={theme} wrapLongLines={false}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
