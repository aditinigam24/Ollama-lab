export interface CommandDoc {
  id: string
  syntax: string
  /** the exact text copied by the Copy button */
  copy: string
  name: string
  tagline: string
  explanation: string
  output: string
  realWorld: string
  errors: { error: string; fix: string }[]
  tips: string[]
  keywords: string[]
}

export const COMMANDS: CommandDoc[] = [
  {
    id: 'version',
    syntax: 'ollama --version',
    copy: 'ollama --version',
    name: 'Check your version',
    tagline: 'Is Ollama installed?',
    explanation:
      'Prints the installed Ollama version. This is the quickest way to confirm that the installation worked and that your terminal can find the ollama program.',
    output: 'ollama version is 0.12.3',
    realWorld:
      'The first command to run after installing, and the first thing to include when you ask someone for help with a bug. (Your version number will differ.)',
    errors: [
      {
        error: "'ollama' is not recognized as an internal or external command",
        fix: 'Close and reopen your terminal so it picks up the updated PATH. If it still fails, reinstall Ollama.',
      },
      {
        error: 'command not found: ollama',
        fix: 'On macOS, open the Ollama app once so it can finish setting up the command line tool. On Linux, re-run the install script.',
      },
    ],
    tips: [
      'A version number means the CLI is installed — it does not prove the server is running.',
      'Updating Ollama regularly gives you support for newer models.',
    ],
    keywords: ['version', 'verify', 'install', 'check'],
  },
  {
    id: 'pull',
    syntax: 'ollama pull <model>:<tag>',
    copy: 'ollama pull gemma3:1b',
    name: 'Download a model',
    tagline: 'Fetch weights to disk',
    explanation:
      'Downloads a model from the Ollama library to your computer. A model is named <name>:<tag>. The tag usually tells you the size, such as 1b for one billion parameters. Models are downloaded in layers, so resuming and updating is efficient.',
    output:
      'pulling manifest\npulling 7cd4618c1faf: 100% ▕████████████████▏ 815 MB\npulling e0a42594d802: 100% ▕████████████████▏  358 B\n...\nverifying sha256 digest\nwriting manifest\nsuccess',
    realWorld:
      'Do this once on good Wi-Fi before a workshop or a flight. After that the model works fully offline.',
    errors: [
      {
        error: 'Error: pull model manifest: file does not exist',
        fix: 'The model name or tag is misspelled, or it does not exist. Check the spelling on ollama.com/library.',
      },
      {
        error: 'connection refused / no such host',
        fix: 'Check your internet connection, proxy or VPN. Pulling needs the internet; running afterwards does not.',
      },
      {
        error: 'no space left on device',
        fix: 'Free up disk space or choose a smaller tag. gemma3:1b is about 815 MB.',
      },
    ],
    tips: [
      'If a download is interrupted, run the same pull again — it continues from where it stopped.',
      'Start small (gemma3:1b) so the first download finishes quickly in class.',
      'Leaving the tag off (ollama pull gemma3) downloads the default tag, which is a bigger model.',
    ],
    keywords: ['pull', 'download', 'fetch', 'get', 'model'],
  },
  {
    id: 'run',
    syntax: 'ollama run <model>:<tag> ["prompt"]',
    copy: 'ollama run gemma3:1b',
    name: 'Chat with a model',
    tagline: 'Start an interactive chat',
    explanation:
      'Loads the model into memory and opens an interactive chat in your terminal. If the model is not downloaded yet, run pulls it first. Type your message and press Enter. Type /bye to leave the chat. You can also add a prompt in quotes for a one-shot answer.',
    output:
      '>>> Send a message (/? for help)\n>>> Explain what an API is in one sentence.\nAn API is a set of rules that lets one program ask another program to do something and get a result back.\n>>> /bye',
    realWorld:
      'Quickly testing a model, brainstorming, summarising text, or checking if a model feels fast enough on your hardware.',
    errors: [
      {
        error: 'Error: model requires more system memory than is available',
        fix: 'Pick a smaller model or tag (for example gemma3:1b), and close other heavy apps.',
      },
      {
        error: 'Error: could not connect to ollama server',
        fix: 'The server is not running. Open the Ollama desktop app, or run ollama serve in another terminal.',
      },
    ],
    tips: [
      'Type /bye (or press Ctrl+D) to exit the chat.',
      'Type /? inside the chat to see special commands.',
      'The first answer is slower because the model is being loaded into memory. Later ones are faster.',
      'One-shot mode: ollama run gemma3:1b "Give me 3 study tips"',
    ],
    keywords: ['run', 'chat', 'talk', 'start', 'interactive', 'prompt'],
  },
  {
    id: 'list',
    syntax: 'ollama list',
    copy: 'ollama list',
    name: 'List downloaded models',
    tagline: 'What is on my disk?',
    explanation:
      'Shows every model stored on your computer, with its ID, size on disk and when it was last modified. Also works as ollama ls.',
    output:
      'NAME           ID              SIZE      MODIFIED\ngemma3:1b      8648f39daa8f    815 MB    2 minutes ago',
    realWorld:
      'Checking what you already have before downloading again, and finding the exact model name to use in code.',
    errors: [
      {
        error: 'The list is empty',
        fix: 'Nothing has been downloaded yet. Run ollama pull gemma3:1b.',
      },
      {
        error: 'Error: could not connect to ollama server',
        fix: 'Start the server through the desktop app or ollama serve.',
      },
    ],
    tips: [
      'The NAME column is exactly what you pass to run, show, stop and rm.',
      'Check the SIZE column regularly — models add up quickly.',
    ],
    keywords: ['list', 'ls', 'installed', 'downloaded', 'models'],
  },
  {
    id: 'ps',
    syntax: 'ollama ps',
    copy: 'ollama ps',
    name: 'See running models',
    tagline: 'What is loaded in memory?',
    explanation:
      'Lists the models that are currently loaded in memory. It shows how much memory they use and whether they run on the CPU, the GPU or both. The UNTIL column says when an idle model will be unloaded automatically.',
    output:
      'NAME         ID              SIZE      PROCESSOR    UNTIL\ngemma3:1b    8648f39daa8f    1.9 GB    100% GPU     4 minutes from now',
    realWorld:
      'Diagnosing slowness (is the model running on the CPU instead of the GPU?) and seeing how much memory a model is using.',
    errors: [
      {
        error: 'Nothing is listed',
        fix: 'No model is loaded right now. Models unload after a period of inactivity. Run a model, then check again.',
      },
    ],
    tips: [
      'ps stands for "process status", a name borrowed from Linux.',
      'ollama list is what is stored on disk; ollama ps is what is loaded in memory.',
    ],
    keywords: ['ps', 'running', 'memory', 'loaded', 'gpu', 'cpu', 'process'],
  },
  {
    id: 'stop',
    syntax: 'ollama stop <model>:<tag>',
    copy: 'ollama stop gemma3:1b',
    name: 'Unload a model',
    tagline: 'Free up memory',
    explanation:
      'Unloads a running model from memory. The model stays on disk, and the Ollama server keeps running. This is useful when you want your RAM back.',
    output: '(no output on success — check with ollama ps)',
    realWorld:
      'Freeing memory before opening a game, a video editor or loading a different, larger model.',
    errors: [
      {
        error: 'model not found / not running',
        fix: 'Run ollama ps to see the exact name of the loaded model, then use that name.',
      },
    ],
    tips: [
      'stop does not delete anything. It only unloads the model.',
      'Confirm it worked by running ollama ps.',
    ],
    keywords: ['stop', 'unload', 'free', 'memory', 'kill'],
  },
  {
    id: 'rm',
    syntax: 'ollama rm <model>:<tag>',
    copy: 'ollama rm gemma3:1b',
    name: 'Delete a model',
    tagline: 'Remove from disk',
    explanation:
      'Permanently removes a downloaded model from your disk. You can download it again later with ollama pull.',
    output: "deleted 'gemma3:1b'",
    realWorld: 'Cleaning up space after experimenting with several large models.',
    errors: [
      {
        error: "Error: model 'xyz' not found",
        fix: 'Run ollama list and copy the exact name, including the tag.',
      },
    ],
    tips: [
      'There is no confirmation prompt — double check the name before you press Enter.',
      'Deleting frees disk space, not RAM. Use stop for RAM.',
    ],
    keywords: ['rm', 'remove', 'delete', 'uninstall', 'disk'],
  },
  {
    id: 'show',
    syntax: 'ollama show <model>:<tag>',
    copy: 'ollama show gemma3:1b',
    name: 'Inspect a model',
    tagline: 'Read the model card',
    explanation:
      'Prints details about a downloaded model: architecture, parameter count, context length, embedding length and quantization. Flags such as --modelfile, --parameters and --template show specific parts.',
    output:
      '  Model\n    architecture        gemma3\n    parameters          1.0B\n    context length      32768\n    quantization        Q4_K_M\n\n  Capabilities\n    completion\n\n  (exact values vary by model and version)',
    realWorld:
      'Checking the context length or quantization before deciding if a model fits your project and hardware.',
    errors: [
      {
        error: "Error: model 'xyz' not found",
        fix: 'The model has to be downloaded first. Run ollama pull, then try again.',
      },
    ],
    tips: [
      'Quantization (like Q4) tells you how compressed the model is. Fewer bits mean a smaller, faster model with a small quality trade-off.',
      'Try ollama show gemma3:1b --modelfile to see how the model is configured.',
    ],
    keywords: ['show', 'info', 'details', 'inspect', 'quantization', 'context', 'parameters', 'modelfile'],
  },
  {
    id: 'serve',
    syntax: 'ollama serve',
    copy: 'ollama serve',
    name: 'Start the local API server',
    tagline: 'Power the localhost API',
    explanation:
      'Starts the Ollama server, which exposes the local API on http://localhost:11434. Other programs (your Python app, a web UI, an editor plugin) talk to Ollama through this server. The Ollama desktop app on Windows and macOS usually starts the server automatically in the background, and the Linux installer sets it up as a background service — so you often do not need to run ollama serve yourself. Use it when you want to start Ollama without the desktop app.',
    output:
      'time=... level=INFO source=routes.go msg="Listening on 127.0.0.1:11434 (version 0.12.3)"\n(the command keeps running — press Ctrl+C to stop it)',
    realWorld:
      'Running Ollama on a server or in a script, debugging server logs, or starting the API when the desktop app is not running.',
    errors: [
      {
        error: 'listen tcp 127.0.0.1:11434: bind: Only one usage of each socket address is normally permitted',
        fix: 'Port 11434 is already in use — usually because Ollama is already running. You do not need a second server. Check with ollama ps or open http://localhost:11434 in a browser.',
      },
    ],
    tips: [
      'This command keeps running in the foreground. Open a second terminal window for your other commands.',
      'If a browser at http://localhost:11434 shows "Ollama is running", the server is already up.',
      'Press Ctrl+C to stop the server you started manually.',
    ],
    keywords: ['serve', 'server', 'api', 'localhost', '11434', 'port', 'start', 'background'],
  },
]
