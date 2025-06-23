# Tool System Architecture & Adding New Tools

This document explains how the modular tool system works and how to add new tools to the OpenAI Realtime API voice agent.

## Current Architecture Overview

The tool system has been refactored into a modular architecture with these components:

```
client/src/tools/
├── types.ts           # TypeScript interfaces for type safety
├── registry.ts        # Central tool registry and helper functions  
├── logHello.ts        # Example: log_hello tool implementation
├── getCurrentTime.ts  # Example: get_current_time tool with parameters
└── README.md          # Complete documentation
```

## 1. Tool Definition & Implementation

### Example: logHello.ts

```typescript
import { ToolDefinition, ToolHandler } from './types';

// Tool definition for OpenAI
export const logHelloDefinition: ToolDefinition = {
  type: 'function',
  name: 'log_hello',
  description: 'Logs "hello" to the console when requested by the user',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

// Tool handler implementation
export const logHelloHandler: ToolHandler = {
  execute(): any {
    // This is our actual function execution - THE HELLO IS LOGGED HERE!
    console.log('hello');
    
    // Return the result that will be sent back to OpenAI
    return { result: 'Successfully logged hello to console' };
  }
};
```

## 2. Tool Registration (registry.ts)

```typescript
import { ToolRegistry } from './types';
import { logHelloDefinition, logHelloHandler } from './logHello';
import { getCurrentTimeDefinition, getCurrentTimeHandler } from './getCurrentTime';

// Central registry of all available tools
export const toolRegistry: ToolRegistry = {
  log_hello: {
    definition: logHelloDefinition,
    handler: logHelloHandler
  },
  get_current_time: {
    definition: getCurrentTimeDefinition,
    handler: getCurrentTimeHandler
  }
};

// Helper functions for WebRTC client
export function getAllToolDefinitions() {
  return Object.values(toolRegistry).map(tool => tool.definition);
}

export function getToolHandler(toolName: string) {
  return toolRegistry[toolName]?.handler;
}

export function isToolRegistered(toolName: string): boolean {
  return toolName in toolRegistry;
}
```

## 3. Tool Configuration in WebRTC (webrtc.ts)

### Session Update (Making OpenAI Aware of Tools)

In `client/src/webrtc.ts`, lines ~188-198:

```typescript
private configureTools(): void {
  const sessionUpdateEvent = {
    type: 'session.update',
    session: {
      tools: getAllToolDefinitions(),  // Loads all tools from registry
      tool_choice: 'auto'
    }
  };

  this.sendClientEvent(sessionUpdateEvent);
  this.systemLog('Tools configured:', getAllToolDefinitions().map(tool => tool.name));
}
```

This is called from the data channel's `onopen` event handler:

```typescript
this.dataChannel.onopen = () => {
  this.systemLog('Data channel opened');
  // Configure tools after data channel is open
  this.configureTools();
};
```

## 4. Tool Execution (webrtc.ts)

In `client/src/webrtc.ts`, lines ~200-270:

```typescript
private async handleFunctionCall(functionCall: FunctionCallData): Promise<void> {
  this.systemLog('Function call received:', functionCall);

  // Check if the tool is registered
  if (!isToolRegistered(functionCall.name)) {
    console.error(`Unknown tool: ${functionCall.name}`);
    return;
  }

  try {
    // Get the tool handler from registry
    const handler = getToolHandler(functionCall.name);
    if (!handler) {
      console.error(`No handler found for tool: ${functionCall.name}`);
      return;
    }

    // Parse arguments if provided
    let args = {};
    if (functionCall.arguments) {
      try {
        args = JSON.parse(functionCall.arguments);
      } catch (error) {
        console.error('Failed to parse function arguments:', error);
        args = {};
      }
    }

    // Execute the tool function - THIS IS WHERE THE TOOL RUNS!
    const result = await handler.execute(args);

    // Send the function result back to the model
    const resultEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: functionCall.call_id,
        output: JSON.stringify(result)
      }
    };

    this.sendClientEvent(resultEvent);

    // Create a new response after sending function result
    const responseEvent = {
      type: 'response.create'
    };

    this.sendClientEvent(responseEvent);

    this.systemLog(`Tool ${functionCall.name} executed successfully`);
  } catch (error) {
    console.error(`Error executing tool ${functionCall.name}:`, error);
    
    // Send error result back to the model
    const errorEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: functionCall.call_id,
        output: JSON.stringify({ error: `Failed to execute ${functionCall.name}: ${error}` })
      }
    };

    this.sendClientEvent(errorEvent);
  }
}
```

## 5. Function Call Detection

In the WebRTC message handler:

```typescript
case 'response.done':
  this.systemLog('Response completed:', serverEvent.response);
  
  // Check if response contains a function call
  if (serverEvent.response.output && serverEvent.response.output.length > 0) {
    const output = serverEvent.response.output[0];
    if (output.type === 'function_call') {
      this.handleFunctionCall(output);  // Routes to modular handler
    }
  }
  break;
```

## How to Add a New Tool (3 Simple Steps)

### Step 1: Create Tool File

Create `client/src/tools/myNewTool.ts`:

```typescript
import { ToolDefinition, ToolHandler } from './types';

export const myNewToolDefinition: ToolDefinition = {
  type: 'function',
  name: 'my_new_tool',
  description: 'Description of what your tool does',
  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of param1'
      }
    },
    required: ['param1']
  }
};

export const myNewToolHandler: ToolHandler = {
  execute(args: { param1: string }): any {
    // Your tool logic here
    console.log('Executing my new tool with:', args);
    
    // Return the result that will be sent back to OpenAI
    return { result: 'Tool executed successfully', input: args.param1 };
  }
};
```

### Step 2: Register in Registry

Add to `client/src/tools/registry.ts`:

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

### Step 3: That's It!

Your tool is now automatically:
- ✅ Loaded into the OpenAI session
- ✅ Available for the AI to call
- ✅ Routed to your handler when called
- ✅ Error handled gracefully

## Flow Summary

1. **Tool Registration**: Registry loads all tool definitions into session
2. **User Request**: User asks AI to use a tool
3. **OpenAI Decision**: Model decides to call the tool
4. **Function Call Detection**: WebRTC detects function call in response
5. **Tool Execution**: Registry routes call to appropriate handler
6. **Result Reporting**: Handler result sent back to OpenAI
7. **Response Generation**: OpenAI generates response with tool results

## Key Benefits of New Architecture

- **Modular**: Each tool is completely self-contained
- **Type Safe**: Full TypeScript support with proper interfaces
- **Error Handling**: Automatic error handling and reporting
- **Easy Testing**: Tools can be tested independently
- **No Risk**: Adding tools won't break existing WebRTC functionality
- **Async Support**: Tools can be synchronous or asynchronous
- **Automatic Registration**: Tools are automatically available once registered

The key insight remains: the actual tool execution happens in your client-side JavaScript code, not on OpenAI's servers. OpenAI just tells you to call the function, and the modular system routes it to the appropriate handler!