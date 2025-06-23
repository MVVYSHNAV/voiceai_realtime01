// tools/displayMenu.ts
import { ToolDefinition, ToolHandler } from './types';

interface DisplayMenuArgs {} // No arguments

export const displayMenuDefinition: ToolDefinition = {
  type: 'function',
  name: 'display_menu',
  description: 'Display the food menu in the Altair UI.',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  }
};

export const displayMenuHandler: ToolHandler = {
  execute(_: DisplayMenuArgs): any {
    console.log('🛠️ Executing display_menu');

    if (typeof window !== 'undefined' && typeof window.display_menu === 'function') {
      window.display_menu();
      return {
        result: 'success',
        message: 'Menu display triggered successfully'
      };
    } else {
      return {
        result: 'failure',
        message: 'display_menu is not defined on window'
      };
    }
  }
};
