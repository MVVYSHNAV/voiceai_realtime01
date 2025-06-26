// Core tool definition interface for OpenAI-style function calling
export interface ToolDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameter>; // Typed better below
    required: string[];
  };
}

// Each parameter in the tool's schema
export interface ToolParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  default?: any;
  enum?: string[]; // Optional enum for valid values
}

// When a tool is called via function_call
export interface FunctionCallData {
  name: string;              // Tool name
  call_id: string;           // Unique call session ID
  arguments?: string;        // JSON string of arguments
}

// Each tool must have an execute function
export interface ToolHandler {
  execute(args: any): Promise<any> | any;
}

// Master tool registry mapping tool names to definitions and logic
export interface ToolRegistry {
  [toolName: string]: {
    definition: ToolDefinition;
    handler: ToolHandler;
  };
}
