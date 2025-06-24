import { ToolDefinition, ToolHandler } from './types';

// Tool definition for OpenAI
export const loggerDefinition: ToolDefinition = {
  type: 'function',
  name: 'logger',
  description: 'Logs any message to the console. Can be used to log information, debug messages, or any text output.',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'The message to log to the console'
      },
      level: {
        type: 'string',
        description: 'Log level (info, warn, error, debug)',
        enum: ['info', 'warn', 'error', 'debug']
      }
    },
    required: ['message']
  }
};

// Tool handler implementation
export const loggerHandler: ToolHandler = {
  execute({ message, level = 'info' }: { message: string; level?: 'info' | 'warn' | 'error' | 'debug' }): any {
    // Log based on the specified level
    switch (level) {
      case 'warn':
        console.warn(`[WARN] ${message}`);
        break;
      case 'error':
        console.error(`[ERROR] ${message}`);
        break;
      case 'debug':
        console.debug(`[DEBUG] ${message}`);
        break;
      case 'info':
      default:
        console.log(`[INFO] ${message}`);
        break;
    }
    
    // Return the result that will be sent back to OpenAI
    return { 
      result: `Successfully logged message to console`,
      message,
      level,
      timestamp: new Date().toISOString()
    };
  }
}; 