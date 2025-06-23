# Tools System

This directory contains the modular tool system for the OpenAI Realtime API voice agent. Tools are completely separated from the main WebRTC logic, making it easy to add new functionality without risking breaking existing code.

## Architecture

- **`types.ts`** - TypeScript interfaces and types for the tool system
- **`registry.ts`** - Central registry that manages all available tools
- **Individual tool files** - Each tool has its own file with definition and handler

## How to Add a New Tool

Adding a new tool is simple and requires only 3 steps:

### 1. Create a new tool file

Create a new file in the `tools/` directory (e.g., `myNewTool.ts`):

```typescript
import { ToolDefinition, ToolHandler } from './types';

// Tool definition for OpenAI
export const myNewToolDefinition: ToolDefinition = {
  type: 'function',
  name: 'my_new_tool',
  description: 'Description of what your tool does',
  parameters: {
    type: 'object',
    properties: {
      // Define your parameters here
      param1: {
        type: 'string',
        description: 'Description of param1'
      }
    },
    required: ['param1'] // List required parameters
  }
};

// Tool handler implementation
export const myNewToolHandler: ToolHandler = {
  execute(args: { param1: string }): any {
    // Your tool logic here
    console.log('Executing my new tool with:', args);
    
    // Return the result that will be sent back to OpenAI
    return { result: 'Tool executed successfully' };
  }
};
```

### 2. Register the tool

Add your tool to `registry.ts`:

```typescript
import { myNewToolDefinition, myNewToolHandler } from './myNewTool';

export const toolRegistry: ToolRegistry = {
  // ... existing tools
  my_new_tool: {
    definition: myNewToolDefinition,
    handler: myNewToolHandler
  }
};
```

### 3. That's it!

Your tool is now automatically available to the OpenAI model. The WebRTC client will:
- Include your tool in the session configuration
- Route function calls to your handler
- Handle errors gracefully
- Send results back to OpenAI

## Current Tools

### log_hello
- **Purpose**: Simple example tool that logs "hello" to console
- **Parameters**: None
- **Usage**: Ask the AI to "log hello" or "use the log hello function"

### get_current_time
- **Purpose**: Gets the current date and time
- **Parameters**: 
  - `format` (optional): "12h" or "24h" format preference
- **Usage**: Ask the AI "what time is it?" or "get current time in 24h format"

## Benefits of This Architecture

1. **Modularity**: Each tool is completely self-contained
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Automatic error handling and reporting
4. **Easy Testing**: Tools can be tested independently
5. **No Risk**: Adding tools won't break existing WebRTC functionality
6. **Async Support**: Tools can be synchronous or asynchronous
7. **Automatic Registration**: Tools are automatically available once registered

## Tool Handler Guidelines

- Always return a meaningful result object
- Use `console.log()` for debugging/logging within your tool
- Handle errors gracefully within your execute function
- Support both sync and async operations
- Validate input parameters as needed
- Return structured data that OpenAI can understand and relay to the user 