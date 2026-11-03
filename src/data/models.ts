export interface ModelVariant {
  tag: string
  command: string
  /** Download size — only shown when verified against Ollama's published model list */
  size?: string
  note?: string
}

export interface ModelDoc {
  id: string
  name: string
  developer: string
  blurb: string
  uses: string[]
  hardware: string
  verifiedNote: string
  variants: ModelVariant[]
  accent: string
}

export const MODELS: ModelDoc[] = [
  {
    id: 'gemma3',
    name: 'Gemma 3',
    developer: 'Google DeepMind',
    blurb:
      'A family of open-weight models from Google. It comes in small sizes that are friendly to laptops, which makes it a great first model for beginners.',
    uses: ['Learning and experiments', 'Summaries and Q&A', 'Study assistants', 'Light writing help'],
    hardware:
      'The 1B tag is small enough for most modern laptops. The 4B tag is a comfortable next step. 12B and 27B need much more memory — check your RAM first.',
    verifiedNote: 'Sizes from the Ollama library listing. Larger tags (4B and up) can also accept images.',
    accent: '#B6FF4A',
    variants: [
      { tag: '1b', command: 'ollama run gemma3:1b', size: '815 MB', note: 'Best for this workshop' },
      { tag: '4b', command: 'ollama run gemma3:4b', size: '3.3 GB', note: 'Default tag' },
      { tag: '12b', command: 'ollama run gemma3:12b', size: '8.1 GB' },
      { tag: '27b', command: 'ollama run gemma3:27b', size: '17 GB', note: 'Needs a powerful machine' },
    ],
  },
  {
    id: 'llama',
    name: 'Llama',
    developer: 'Meta',
    blurb:
      'One of the most widely used open model families. Llama 3.2 offers compact versions for everyday devices, and Llama 3.3 offers a very large version for powerful hardware.',
    uses: ['General chat', 'Writing and brainstorming', 'Coding help', 'Building apps'],
    hardware:
      'The 1B and 3B versions suit laptops. 8B is a popular middle ground. 70B needs workstation-class memory — do not try it on a normal laptop.',
    verifiedNote: 'Sizes from the Ollama library listing.',
    accent: '#00D68F',
    variants: [
      { tag: 'llama3.2:1b', command: 'ollama run llama3.2:1b', size: '1.3 GB' },
      { tag: 'llama3.2', command: 'ollama run llama3.2', size: '2.0 GB', note: '3B, default tag' },
      { tag: 'llama3.1', command: 'ollama run llama3.1', size: '4.7 GB', note: '8B' },
      { tag: 'llama3.3', command: 'ollama run llama3.3', size: '43 GB', note: '70B — very large' },
    ],
  },
  {
    id: 'qwen',
    name: 'Qwen',
    developer: 'Alibaba Cloud',
    blurb:
      'A strong open model family with a wide range of sizes, known for solid coding, maths and multilingual ability.',
    uses: ['Multilingual chat', 'Coding assistance', 'Reasoning tasks', 'Experiments across many sizes'],
    hardware:
      'Qwen is offered in many sizes, from very small to very large. Start with a small tag, check the size on its library page, and move up only if your RAM allows.',
    verifiedNote:
      'Download sizes are not listed here because they change between versions. Check ollama.com/library/qwen3 for current tags and sizes.',
    accent: '#7CFFB2',
    variants: [
      { tag: 'qwen3:4b', command: 'ollama run qwen3:4b', note: 'Check size on the library page' },
      { tag: 'qwen3:8b', command: 'ollama run qwen3:8b', note: 'Check size on the library page' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek-R1',
    developer: 'DeepSeek',
    blurb:
      'A reasoning-focused model that "thinks" step by step before answering. The small tags on Ollama are distilled models — smaller models trained to imitate the reasoning of the huge one — not the full model.',
    uses: ['Maths and logic puzzles', 'Step-by-step problem solving', 'Exploring how reasoning models behave'],
    hardware:
      'Reasoning models write a lot of "thinking" text, so they feel slower than chat models of the same size. The full 671B model needs a data-centre class machine — pick a small distilled tag instead.',
    verifiedNote: 'The 7B (default) and 671B sizes are from the Ollama library listing.',
    accent: '#4AE3FF',
    variants: [
      { tag: 'deepseek-r1:1.5b', command: 'ollama run deepseek-r1:1.5b', note: 'Smallest distilled tag' },
      { tag: 'deepseek-r1', command: 'ollama run deepseek-r1', size: '4.7 GB', note: '7B, default tag' },
      { tag: 'deepseek-r1:671b', command: 'ollama run deepseek-r1:671b', size: '404 GB', note: 'Not for normal computers' },
    ],
  },
]

export const HARDWARE_GUIDE = [
  {
    title: 'RAM (memory)',
    body: 'A model must fit in memory while it runs. As a rough guide, the model needs at least about as much free memory as its download size, plus extra for the conversation. If it does not fit, Ollama may refuse to run it or it will be extremely slow.',
  },
  {
    title: 'Storage',
    body: 'Models are files on your disk, from under 1 GB to hundreds of GB. Each model you pull takes its own space. Use ollama list to see sizes and ollama rm to clean up.',
  },
  {
    title: 'Quantization',
    body: 'Quantization compresses a model by storing its numbers with fewer bits (for example 4-bit instead of 16-bit). The model becomes much smaller and faster, with a small loss in quality. Most Ollama downloads are already quantized.',
  },
  {
    title: 'GPU vs CPU',
    body: 'A supported GPU with enough video memory makes responses much faster. Without one, Ollama runs on the CPU, which works but is slower. Use ollama ps to see which processor your model is using.',
  },
]
