# OpenAI Realtime API Voice Agent

A modern voice agent interface built with OpenAI's Realtime API, featuring real-time voice conversations and a modular tool system.

## Features

- 🎙️ **Real-time Voice Conversations** - Direct voice interaction with OpenAI's Realtime API
- 🛠️ **Modular Tool System** - Extensible function calling with automatic registration
- 🎨 **Modern UI** - Clean, responsive interface with real-time status indicators
- 📝 **Live Transcription** - Real-time conversation transcript with message bubbles
- ⚡ **Fast Development** - Built with Vite, React, and TypeScript

## Quick Start

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Add your OpenAI API key to server/.env
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Start development servers**
   ```bash
   bun run dev
   ```

4. **Open the app**
   - Client: http://localhost:5174
   - Server: http://localhost:3000

## Tool Development

### Quick Tool Generation

Generate new tools with the interactive CLI:

```bash
# From project root
bun run generate-tool

# Or from client directory
cd client && bun run generate-tool
```

The generator will:
- ✅ Ask for tool details (name, description, parameters)
- ✅ Generate complete TypeScript tool file
- ✅ Update the tool registry automatically
- ✅ Provide type-safe parameter interfaces

### Manual Tool Creation

See [client/src/tools/README.md](client/src/tools/README.md) for detailed documentation on the modular tool system.

## Project Structure

```
voice-agent/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── tools/          # Modular tool system
│   │   └── webrtc.ts       # WebRTC client
│   └── scripts/
│       └── generate-tool.js # Tool generator CLI
├── server/                 # Express backend
│   ├── routes/
│   └── index.ts
└── doc/                    # Documentation
    └── KT/
        └── AddingTool.md   # Tool system guide
```

## Available Scripts

### Root Level
- `bun run dev` - Start both client and server
- `bun run dev:client` - Start only client
- `bun run dev:server` - Start only server  
- `bun run generate-tool` - Generate new tool scaffolding

### Client
- `bun run dev` - Start Vite dev server
- `bun run build` - Build for production
- `bun run generate-tool` - Generate new tool

### Server
- `bun run dev` - Start Express server with hot reload

## Tool System

The voice agent features a modular tool system that allows the AI to call JavaScript functions. Tools are:

- **Modular** - Each tool is a separate file
- **Type-safe** - Full TypeScript support
- **Auto-registered** - Automatic registration with OpenAI
- **Easy to test** - Independent testing capability

### Example Tools

- `log_hello` - Simple console logging
- `get_current_time` - Returns current time with timezone support

## Development Workflow

1. **Generate a new tool**
   ```bash
   bun run generate-tool
   ```

2. **Implement tool logic**
   - Edit the generated file in `client/src/tools/`
   - Replace TODO comments with actual functionality

3. **Test your tool**
   - Start the dev server: `bun run dev`
   - Connect to the voice agent
   - Ask the AI to use your tool

## Environment Variables

### Server (.env)
```env
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Generate tools using `bun run generate-tool`
4. Implement your functionality
5. Submit a pull request

## Documentation

- [Tool System Guide](doc/KT/AddingTool.md) - Comprehensive tool development guide
- [Tool Generator README](client/scripts/README.md) - CLI tool documentation
- [Tools README](client/src/tools/README.md) - Modular system overview

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Real-time**: WebRTC, OpenAI Realtime API
- **Development**: Bun, Concurrently, ESLint

## License

MIT License - see LICENSE file for details. 