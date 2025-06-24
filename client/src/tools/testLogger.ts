import type { ToolDefinition } from './types';
import { loggerHandler } from './logger';

export const testLoggerDefinition: ToolDefinition = {
  type: 'function',
  name: 'testLogger',
  description: 'Test the logger tool with different log levels and messages',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

export const testLoggerHandler = {
  execute: async () => {
    try {
      const testMessages = [
        { message: 'This is an info message', level: 'info' },
        { message: 'This is a warning message', level: 'warn' },
        { message: 'This is an error message', level: 'error' },
        { message: 'This is a debug message', level: 'debug' },
        { message: 'This is a default message (no level specified)' }
      ];

      const results = [];

      for (const test of testMessages) {
        const result = loggerHandler.execute(test as any);
        results.push(result);
      }

      return {
        success: true,
        message: 'Logger test completed successfully',
        testResults: results,
        summary: `Tested ${testMessages.length} different log messages with various levels`
      };

    } catch (error) {
      return {
        success: false,
        message: `Error testing logger: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}; 