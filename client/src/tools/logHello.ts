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
    // This is our actual function execution
    console.log('hello');
    
    // Return the result that will be sent back to OpenAI
    return { result: 'Successfully logged hello to console' };
  }
}; 