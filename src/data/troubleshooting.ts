export interface TroubleCard {
  id: string
  title: string
  symptom: string
  why: string
  identify: string[]
  fix: { step: string; code?: string }[]
}

export const TROUBLES: TroubleCard[] = [
  {
    id: 'not-recognized',
    title: 'Ollama command not recognized',
    symptom: "'ollama' is not recognized… / command not found: ollama",
    why: 'Your terminal cannot find the ollama program. Usually Ollama is not installed yet, the installation did not finish, or the terminal was opened before installation and has an old PATH.',
    identify: [
      'The error appears immediately, before anything downloads.',
      'The message says "not recognized" (Windows) or "command not found" (macOS / Linux).',
    ],
    fix: [
      { step: 'Close the terminal completely and open a new one.' },
      { step: 'Check the install:', code: 'ollama --version' },
      { step: 'macOS: open the Ollama app once from Applications so it can set up the command line tool.' },
      { step: 'Linux: re-run the official install script.', code: 'curl -fsSL https://ollama.com/install.sh | sh' },
      { step: 'Still failing? Re-download the installer from ollama.com/download and reinstall.' },
    ],
  },
  {
    id: 'download-failed',
    title: 'Model download failed',
    symptom: 'pull stops, errors out, or says the manifest does not exist',
    why: 'Network interruptions, a proxy or firewall, a full disk, or a mistyped model name or tag.',
    identify: [
      'Error text mentions "pull model manifest", a timeout or "no such host".',
      'Download progress freezes or restarts.',
    ],
    fix: [
      { step: 'Check the spelling of the name and tag on ollama.com/library.' },
      { step: 'Just run the pull again. Downloads resume.', code: 'ollama pull gemma3:1b' },
      { step: 'Check your internet connection, VPN or campus proxy.' },
      { step: 'Check free disk space. Model files can be many gigabytes.' },
    ],
  },
  {
    id: 'memory',
    title: 'Insufficient memory',
    symptom: 'model requires more system memory than is available',
    why: 'The model is too big for the free RAM (or GPU memory) on your machine.',
    identify: [
      'The error mentions memory when you run or load a model.',
      'Your whole computer slows down or freezes while a big model loads.',
    ],
    fix: [
      { step: 'Choose a smaller model or tag.', code: 'ollama run gemma3:1b' },
      { step: 'Close memory-hungry apps such as browsers with many tabs.' },
      { step: 'Unload anything already running.', code: 'ollama ps\nollama stop <model>' },
      { step: 'Compare the model size from ollama list with your free RAM.' },
    ],
  },
  {
    id: 'connection-refused',
    title: 'Connection refused',
    symptom: 'could not connect to ollama server / connection refused on localhost:11434',
    why: 'The Ollama server is not running, so nothing is listening on port 11434.',
    identify: [
      'Appears when running CLI commands or when your code calls the API.',
      'Opening http://localhost:11434 in a browser does not show "Ollama is running".',
    ],
    fix: [
      { step: 'Start the Ollama desktop app (Windows / macOS).' },
      { step: 'Or start the server yourself in a terminal and leave it open:', code: 'ollama serve' },
      { step: 'In a second terminal, test it:', code: 'ollama list' },
      { step: 'Linux with the service installed: check whether the service is running.', code: 'systemctl status ollama' },
    ],
  },
  {
    id: 'port-in-use',
    title: 'Port already in use',
    symptom: 'bind: address already in use (port 11434)',
    why: 'Something is already listening on port 11434 — most often Ollama itself, already started by the desktop app or a background service.',
    identify: [
      'You ran ollama serve and got a bind / address-in-use error.',
      'Opening http://localhost:11434 shows "Ollama is running".',
    ],
    fix: [
      { step: 'Good news: the server is probably already running. You do not need ollama serve.' },
      { step: 'Confirm it works:', code: 'ollama list' },
      { step: 'If you really need a second server, give it another address with OLLAMA_HOST.', code: 'OLLAMA_HOST=127.0.0.1:11500 ollama serve' },
      { step: 'Windows PowerShell version of the same idea:', code: '$env:OLLAMA_HOST="127.0.0.1:11500"; ollama serve' },
    ],
  },
  {
    id: 'slow',
    title: 'Model running slowly',
    symptom: 'very slow replies, long pauses before the first word',
    why: 'The model is large for your hardware, it is running on the CPU instead of a GPU, memory is being swapped to disk, or it is still loading on the first request.',
    identify: [
      'ollama ps shows the PROCESSOR as CPU, or part CPU / part GPU.',
      'The first reply is slow but later ones are better — that is model loading.',
    ],
    fix: [
      { step: 'Check how the model is running:', code: 'ollama ps' },
      { step: 'Switch to a smaller model or a smaller tag.', code: 'ollama run gemma3:1b' },
      { step: 'Close other heavy applications to free memory.' },
      { step: 'Keep prompts and conversations short — very long context slows things down.' },
    ],
  },
]
