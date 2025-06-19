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