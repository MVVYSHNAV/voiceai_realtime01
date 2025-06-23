import { ToolDefinition, ToolHandler } from './types';

// Tool definition for OpenAI
export const getCurrentTimeDefinition: ToolDefinition = {
  type: 'function',
  name: 'get_current_time',
  description: 'Gets the current date and time',
  parameters: {
    type: 'object',
    properties: {
      format: {
        type: 'string',
        description: 'Time format preference: "12h" for 12-hour format, "24h" for 24-hour format',
        enum: ['12h', '24h']
      }
    },
    required: []
  }
};

// Tool handler implementation
export const getCurrentTimeHandler: ToolHandler = {
  execute(args: { format?: '12h' | '24h' }): any {
    const now = new Date();
    const format = args.format || '12h';
    
    let timeString: string;
    if (format === '24h') {
      timeString = now.toLocaleString('en-US', { 
        hour12: false,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } else {
      timeString = now.toLocaleString('en-US', { 
        hour12: true,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
    }

    console.log(`Current time (${format} format):`, timeString);
    
    return { 
      current_time: timeString,
      format_used: format,
      timestamp: now.getTime()
    };
  }
}; 