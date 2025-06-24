import type { ToolDefinition } from './types';
import { toolRegistry, getAllToolDefinitions, isToolRegistered } from './registry';

export const debugToolsDefinition: ToolDefinition = {
  type: 'function',
  name: 'debug_tools',
  description: 'Debug tool to list all registered tools and check tool registration status',
  parameters: {
    type: 'object',
    properties: {
      check_tool: {
        type: 'string',
        description: 'Optional: specific tool name to check registration status'
      }
    },
    required: []
  }
};

export const debugToolsHandler = {
  execute: async ({ check_tool }: { check_tool?: string } = {}) => {
    try {
      // Get all registered tools
      const registeredTools = Object.keys(toolRegistry);
      const toolDefinitions = getAllToolDefinitions();
      
      const result: any = {
        success: true,
        registeredToolCount: registeredTools.length,
        registeredTools: registeredTools,
        toolDefinitions: toolDefinitions.map(def => ({
          name: def.name,
          description: def.description
        })),
        timestamp: new Date().toISOString()
      };

      // If checking a specific tool
      if (check_tool) {
        result.toolCheck = {
          toolName: check_tool,
          isRegistered: isToolRegistered(check_tool),
          existsInRegistry: check_tool in toolRegistry,
          registryKeys: Object.keys(toolRegistry)
        };
      }

      // Log to console for debugging
      console.log('=== TOOL DEBUG INFO ===');
      console.log('Registered tools:', registeredTools);
      console.log('Tool definitions:', toolDefinitions.map(d => d.name));
      
      if (check_tool) {
        console.log(`Checking tool "${check_tool}":`, {
          isRegistered: isToolRegistered(check_tool),
          existsInRegistry: check_tool in toolRegistry
        });
      }

      return result;

    } catch (error) {
      return {
        success: false,
        message: `Error debugging tools: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      };
    }
  }
}; 