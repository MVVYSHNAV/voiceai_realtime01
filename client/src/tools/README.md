# Tools System

This directory contains the modular tool system for Tomorrow (OpenAI Realtime API voice agent). Tools are completely separated from the main WebRTC logic, making it easy to add new functionality without risking breaking existing code.

## Architecture

- **`types.ts`** - TypeScript interfaces and types for the tool system
- **`registry.ts`** - Central registry that manages all available tools
- **Individual tool files** - Each tool has its own file with definition and handler

## How to Add a New Tool

Adding a new tool is simple and requires only 3 steps:

### 1. Create a new tool file

Create a new file in the `tools/` directory (e.g., `myNewTool.ts`):

```typescript
import { ToolDefinition, ToolHandler } from './types';

// Tool definition for OpenAI
export const myNewToolDefinition: ToolDefinition = {
  type: 'function',
  name: 'my_new_tool',
  description: 'Description of what your tool does',
  parameters: {
    type: 'object',
    properties: {
      // Define your parameters here
      param1: {
        type: 'string',
        description: 'Description of param1'
      }
    },
    required: ['param1'] // List required parameters
  }
};

// Tool handler implementation
export const myNewToolHandler: ToolHandler = {
  execute(args: { param1: string }): any {
    // Your tool logic here
    console.log('Executing my new tool with:', args);
    
    // Return the result that will be sent back to OpenAI
    return { result: 'Tool executed successfully' };
  }
};
```

### 2. Register the tool

Add your tool to `registry.ts`:

```typescript
import { myNewToolDefinition, myNewToolHandler } from './myNewTool';

export const toolRegistry: ToolRegistry = {
  // ... existing tools
  my_new_tool: {
    definition: myNewToolDefinition,
    handler: myNewToolHandler
  }
};
```

### 3. That's it!

Your tool is now automatically available to the OpenAI model. The WebRTC client will:
- Include your tool in the session configuration
- Route function calls to your handler
- Handle errors gracefully
- Send results back to OpenAI

## Current Tools

### Basic Tools

#### log_hello
- **Purpose**: Simple example tool that logs "hello" to console
- **Parameters**: None
- **Usage**: Ask the AI to "log hello" or "use the log hello function"

#### get_current_time
- **Purpose**: Gets the current date and time
- **Parameters**: 
  - `format` (optional): "12h" or "24h" format preference
- **Usage**: Ask the AI "what time is it?" or "get current time in 24h format"

### Communication Tools

#### send_email
- **Purpose**: Send email to user (placeholder implementation)
- **Parameters**:
  - `email` (required): User's email address
- **Usage**: Ask the AI to "send email to user@example.com"

#### send_wa
- **Purpose**: Send WhatsApp message to a phone number (placeholder implementation)
- **Parameters**:
  - `phone_number` (required): Phone number with international code
- **Usage**: Ask the AI to "send WhatsApp to +1234567890"

#### make_call
- **Purpose**: Make a phone call and read a message (placeholder implementation)
- **Parameters**:
  - `phone_number` (required): Phone number with international code
- **Usage**: Ask the AI to "call +1234567890"

### Navigation Tools

#### navigate_page
- **Purpose**: Navigate to different pages in the application
- **Parameters**:
  - `page` (required): Page to navigate to ("", "products", "util")
  - `params` (optional): Query parameters for the page
- **Usage**: 
  - "Go to the products page"
  - "Navigate to home"
  - "Take me to the utilities page"

#### get_available_pages
- **Purpose**: Get information about all available pages and current location
- **Parameters**: None
- **Usage**: 
  - "What pages are available?"
  - "Where am I currently?"
  - "Show me all available pages"

### Product Tools

#### search_products
- **Purpose**: Search for products and navigate to results
- **Parameters**:
  - `search_term` (required): Keyword to search for
  - `category` (optional): Filter by category
  - `brand` (optional): Filter by brand
  - `sort` (optional): Sort order for results
- **Usage**:
  - "Search for headphones"
  - "Find Sony audio products"
  - "Search for cameras sorted by price"

#### apply_product_filters
- **Purpose**: Apply comprehensive filters to the products page
- **Parameters**:
  - `search` (optional): Search term
  - `category` (optional): Product category
  - `brand` (optional): Product brand
  - `min_price` (optional): Minimum price
  - `max_price` (optional): Maximum price
  - `sort` (optional): Sort order
  - `page` (optional): Page number
- **Usage**:
  - "Show me Apple products under $500"
  - "Filter products by Audio category"
  - "Show expensive products over $1000"
  - "Sort products by rating"

### UI Tools

#### open_floating_chat
- **Purpose**: Open the floating chat widget for text-based support
- **Parameters**:
  - `mode` (optional): "welcome" or "chat" mode
  - `message` (optional): Initial message to send in chat
- **Usage**:
  - "Open the chat widget"
  - "Show me the text chat"
  - "Open chat with a message about my order"
  - "Switch to text-based support"

## Available Categories
- Audio, Wearables, Photography, Furniture, Lighting
- Computers, Phones, Electronics, Gaming, Accessories

## Available Brands
- Sony, Apple, Canon, Herman Miller, Dyson
- JBL, Samsung, Bose, Nintendo, Tesla

## Sort Options
- featured, price-low, price-high, rating, newest

## Benefits of This Architecture

1. **Modularity**: Each tool is completely self-contained
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Automatic error handling and reporting
4. **Easy Testing**: Tools can be tested independently
5. **No Risk**: Adding tools won't break existing WebRTC functionality
6. **Async Support**: Tools can be synchronous or asynchronous
7. **Automatic Registration**: Tools are automatically available once registered

## Tool Handler Guidelines

- Always return a meaningful result object
- Use `console.log()` for debugging/logging within your tool
- Handle errors gracefully within your execute function
- Support both sync and async operations
- Validate input parameters as needed
- Return structured data that OpenAI can understand and relay to the user 