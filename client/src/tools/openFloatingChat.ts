import { ToolDefinition, ToolHandler } from './types';

// Tool definition for OpenAI
export const openFloatingChatDefinition: ToolDefinition = {
  type: 'function',
  name: 'open_floating_chat',
  description: 'Open the floating chat widget for text-based support when voice interaction is not preferred',
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        description: 'The mode to open the chat in',
        enum: ['welcome', 'chat']
      },
      message: {
        type: 'string',
        description: 'Optional initial message to send in the chat'
      }
    },
    required: []
  }
};

// Tool handler implementation
export const openFloatingChatHandler: ToolHandler = {
  execute(args: { mode?: 'welcome' | 'chat'; message?: string }): any {
    console.log('💬 Executing open_floating_chat with args:', args);
    
    try {
      // Dispatch a custom event to communicate with the FloatingChat component
      const event = new CustomEvent('openFloatingChat', {
        detail: {
          mode: args.mode || 'welcome',
          message: args.message
        }
      });
      
      window.dispatchEvent(event);
      
      let message = 'Floating chat widget opened';
      if (args.mode === 'chat') {
        message += ' in chat mode';
      } else {
        message += ' in welcome mode';
      }
      
      if (args.message) {
        message += ` with initial message: "${args.message}"`;
      }
      
      return {
        result: 'Floating chat opened successfully',
        message: message,
        mode: args.mode || 'welcome',
        initialMessage: args.message || null
      };
    } catch (error) {
      console.error('Error opening floating chat:', error);
      return {
        result: 'Failed to open floating chat',
        error: `Error: ${error}`,
        requestedMode: args.mode,
        requestedMessage: args.message
      };
    }
  }
}; 