// Tool system types for OpenAI Realtime API

export interface ToolDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export interface FunctionCallData {
  name: string;
  call_id: string;
  arguments?: string;
}

export interface ToolHandler {
  execute(args: any): Promise<any> | any;
}

export interface ToolRegistry {
  [toolName: string]: {
    definition: ToolDefinition;
    handler: ToolHandler;
  };
} 

export {};

declare global {
  interface Window {
    display_menu: () => void;
  }
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}