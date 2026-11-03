export interface Concept {
  id: string
  emoji: string
  title: string
  short: string
  back: string
  analogy: string
  deeper: string
}

export const CONCEPTS: Concept[] = [
  {
    id: 'ai',
    emoji: '🧠',
    title: 'Artificial Intelligence',
    short: 'Software that does tasks that normally need human intelligence.',
    back: 'AI is a broad field. It covers programs that recognise images, translate languages, recommend videos, play games or write text. The common thread: the program learns patterns instead of following only hand-written rules.',
    analogy: 'Think of a spam filter. Nobody wrote a rule for every spam email — it learned what spam looks like from examples.',
    deeper:
      'Most modern AI uses machine learning: instead of being told the rules, a system is shown huge numbers of examples and adjusts itself until it makes good predictions.',
  },
  {
    id: 'genai',
    emoji: '✨',
    title: 'Generative AI',
    short: 'AI that creates new content: text, images, code, audio.',
    back: 'Traditional AI often classifies things ("is this a cat?"). Generative AI produces new things ("draw a cat wearing a hat" or "write a poem about Mondays").',
    analogy: 'A classifier is like a judge at a contest. A generative model is like the artist entering it.',
    deeper:
      'Generative models learn the patterns of their training data well enough to produce new examples that follow the same patterns. They can still be wrong, so always check important facts.',
  },
  {
    id: 'llm',
    emoji: '💬',
    title: 'Large Language Model (LLM)',
    short: 'A generative AI model trained on massive amounts of text to predict and write language.',
    back: 'An LLM reads your text and predicts what should come next, one small piece (a "token") at a time. Do that thousands of times and you get full answers, essays and code.',
    analogy: 'Like autocomplete on your phone — but trained on a huge library and able to continue whole conversations.',
    deeper:
      '"Large" refers to the number of parameters — the adjustable numbers inside the model. gemma3:1b has about one billion of them. More parameters usually means more capability and more memory needed.',
  },
  {
    id: 'local',
    emoji: '💻',
    title: 'Local LLM',
    short: 'An LLM that runs on your own computer instead of someone else\'s server.',
    back: 'You download the model files once. After that, your prompts are processed by your own CPU or GPU. The model does not need the internet to answer.',
    analogy: 'Streaming a film vs having the film file on your laptop. The file on your laptop works on a plane.',
    deeper:
      'Local models are usually smaller than the biggest cloud models, so they trade some capability for privacy, offline use and control. The right choice depends on the task.',
  },
  {
    id: 'ollama',
    emoji: '🦙',
    title: 'Ollama',
    short: 'A free tool that makes downloading and running local LLMs simple.',
    back: 'Ollama handles the hard parts: downloading models, loading them into memory, running them, and exposing a local API. You type one command and you are chatting.',
    analogy: 'If a model is a game, Ollama is the console that knows how to run it.',
    deeper:
      'Ollama gives you a command line (ollama run, pull, list…) and a local REST API on port 11434, so your own programs can use the models too.',
  },
]

export interface CompareRow {
  topic: string
  cloud: string
  local: string
}

export const COMPARE: CompareRow[] = [
  {
    topic: 'Where it runs',
    cloud: 'On the provider\'s servers. Your prompt travels over the internet.',
    local: 'On your own machine. Your prompt stays on your computer.',
  },
  {
    topic: 'Internet needed?',
    cloud: 'Yes, for every request.',
    local: 'Only to download a model. After that it can work offline.',
  },
  {
    topic: 'Privacy',
    cloud: 'Your data is handled under the provider\'s policies.',
    local: 'Your data is processed locally, which gives you more control.',
  },
  {
    topic: 'Cost',
    cloud: 'Often a free tier plus paid plans or per-use pricing.',
    local: 'No per-message fee. You pay with your own hardware, power and time.',
  },
  {
    topic: 'Model size & power',
    cloud: 'Access to very large, frontier-level models.',
    local: 'Limited by your RAM and GPU, so models are usually smaller.',
  },
  {
    topic: 'Setup',
    cloud: 'Open a website or app and start typing.',
    local: 'Install Ollama and download a model first.',
  },
  {
    topic: 'Speed',
    cloud: 'Fast on powerful data-centre hardware.',
    local: 'Depends on your hardware. A GPU helps a lot.',
  },
]
