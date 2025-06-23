Great question! Let me point you to the specific parts of the code where the tool calling functionality is implemented:

## 1. Tool Definition (Where we define the function)

In `client/src/webrtc.ts`, lines 61-75:

```typescript
private configureTools(): void {
  const sessionUpdateEvent = {
    type: 'session.update',
    session: {
      tools: [
        {
          type: 'function',
          name: 'log_hello',
          description: 'Logs "hello" to the console when requested by the user',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ],
      tool_choice: 'auto'
    }
  };

  this.sendClientEvent(sessionUpdateEvent);
  console.log('Tools configured');
}
```

## 2. Making OpenAI Aware of the Tool (Session Update)

This happens in the same `configureTools()` method above. The key part is:
- We send a `session.update` event to OpenAI
- This tells the model that it has access to the `log_hello` function
- The `tool_choice: 'auto'` means the model can decide when to use it

This is called from the data channel's `onopen` event handler (line 147):

```typescript
this.dataChannel.onopen = () => {
  console.log('Data channel opened');
  // Configure tools after data channel is open
  this.configureTools();
};
```

## 3. Tool Execution (Where "hello" is actually logged)

In `client/src/webrtc.ts`, lines 81-104:

```typescript
private handleFunctionCall(functionCall: any): void {
  console.log('Function call received:', functionCall);

  // Execute the function based on the name
  if (functionCall.name === 'log_hello') {
    // This is our actual function execution - THE HELLO IS LOGGED HERE!
    console.log('hello');

    // Send the function result back to the model
    const resultEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: functionCall.call_id,
        output: JSON.stringify({ result: 'Successfully logged hello to console' })
      }
    };

    this.sendClientEvent(resultEvent);

    // Create a new response after sending function result
    const responseEvent = {
      type: 'response.create'
    };

    this.sendClientEvent(responseEvent);
  }
}
```

**The actual `console.log('hello')` happens on line 87!**

## 4. Function Call Detection (Where we detect OpenAI wants to call the function)

In `client/src/webrtc.ts`, lines 170-177:

```typescript
case 'response.done':
  console.log('Response completed:', serverEvent.response);
  // Check if response contains a function call
  if (serverEvent.response.output && serverEvent.response.output.length > 0) {
    const output = serverEvent.response.output[0];
    if (output.type === 'function_call') {
      this.handleFunctionCall(output);
    }
  }
  break;
```

## Flow Summary:

1. **Tool Registration**: `configureTools()` tells OpenAI about our `log_hello` function
2. **User Request**: User says something like "log hello" or "use the log hello function"
3. **OpenAI Decision**: Model decides to call `log_hello` function
4. **Function Call Detection**: We detect the function call in the `response.done` event
5. **Function Execution**: `handleFunctionCall()` executes `console.log('hello')`
6. **Result Reporting**: We send the result back to OpenAI
7. **Response Generation**: OpenAI generates a response acknowledging the function was executed

The key insight is that the actual `console.log('hello')` happens in your client-side JavaScript code, not on OpenAI's servers. OpenAI just tells you to call the function, and you execute it locally!