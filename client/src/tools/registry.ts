import { ToolRegistry } from './types';
import { logHelloDefinition, logHelloHandler } from './logHello';
import { getCurrentTimeDefinition, getCurrentTimeHandler } from './getCurrentTime';
import { sendEmailDefinition, sendEmailHandler } from './sendEmail';
import { sendWaDefinition, sendWaHandler } from './sendWa';
import { displayMenuDefinition, displayMenuHandler } from './displayMenu';
import { addToCartDefinition, addToCartHandler } from './addToCart';

// Central registry of all available tools
export const toolRegistry: ToolRegistry = {
log_hello: {
    definition: logHelloDefinition,
    handler: logHelloHandler
  },
  get_current_time: {
    definition: getCurrentTimeDefinition,
    handler: getCurrentTimeHandler
  },
  send_email: {
    definition: sendEmailDefinition,
    handler: sendEmailHandler
  },
  send_wa: {
    definition: sendWaDefinition,
    handler: sendWaHandler
  },
   display_menu: {
    definition: displayMenuDefinition,
    handler: displayMenuHandler
  },
   add_to_cart: {
    definition: addToCartDefinition,
    handler: addToCartHandler
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