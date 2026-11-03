export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explain: string
}

export const QUIZ: QuizQuestion[] = [
  {
    q: 'What does "running AI locally" mean?',
    options: [
      'The model is processed on servers owned by a big company',
      'The model runs on your own computer using your own hardware',
      'The model only works inside a web browser tab',
      'The model is always connected to the internet',
    ],
    answer: 1,
    explain: 'Local AI means the model files live on your machine and your CPU or GPU does the work.',
  },
  {
    q: 'What is Ollama?',
    options: [
      'A search engine',
      'A programming language',
      'A tool for downloading and running language models locally',
      'A type of graphics card',
    ],
    answer: 2,
    explain: 'Ollama downloads, manages and runs models, and exposes a local API.',
  },
  {
    q: 'Which command checks that Ollama is installed?',
    options: ['ollama check', 'ollama --version', 'ollama install', 'ollama status'],
    answer: 1,
    explain: 'ollama --version prints the installed version. If it works, the CLI is installed.',
  },
  {
    q: 'You want to download Gemma 3 (1B) without chatting yet. Which command do you use?',
    options: ['ollama get gemma3:1b', 'ollama install gemma3:1b', 'ollama pull gemma3:1b', 'ollama fetch gemma3:1b'],
    answer: 2,
    explain: 'ollama pull downloads a model to your disk.',
  },
  {
    q: 'Which command shows the models that are currently loaded in memory?',
    options: ['ollama list', 'ollama ps', 'ollama show', 'ollama serve'],
    answer: 1,
    explain: 'ollama ps shows running (loaded) models. ollama list shows what is stored on disk.',
  },
  {
    q: 'What does "ollama stop gemma3:1b" do?',
    options: [
      'Deletes the model from disk',
      'Uninstalls Ollama',
      'Unloads the model from memory',
      'Stops your internet connection',
    ],
    answer: 2,
    explain: 'stop unloads the model from memory. The files stay on disk — rm is what deletes them.',
  },
  {
    q: 'Which port does the Ollama API use by default?',
    options: ['80', '3000', '8080', '11434'],
    answer: 3,
    explain: 'The local API listens on http://localhost:11434 by default.',
  },
  {
    q: 'What does "localhost" mean?',
    options: [
      'A website hosted in your city',
      'Your own computer',
      'The Ollama company server',
      'A folder named localhost',
    ],
    answer: 1,
    explain: 'localhost is a name that always points back to the computer you are using.',
  },
  {
    q: 'What does quantization do to a model?',
    options: [
      'Makes it smaller and faster by using fewer bits per number, with a small quality trade-off',
      'Connects it to the internet',
      'Translates it into another language',
      'Makes it always give correct answers',
    ],
    answer: 0,
    explain: 'Quantization compresses the model\'s numbers, saving memory and speeding things up.',
  },
  {
    q: 'What is the main difference between a chatbot and an AI agent?',
    options: [
      'A chatbot is always bigger',
      'A chatbot answers messages; an agent can plan, use tools and take steps toward a goal',
      'An agent cannot use any model',
      'There is no difference',
    ],
    answer: 1,
    explain: 'A chatbot responds to your messages. An agent can decide on steps and call tools to reach a goal.',
  },
]
