import { ToolDefinition, ToolHandler } from './types';

interface SendEmailArgs {
  email: string;
}

// Tool definition for OpenAI
export const sendEmailDefinition: ToolDefinition = {
  type: 'function',
  name: 'send_email',
  description: 'send email to user',
  parameters: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'users email address'
      }
    },
    required: ['email']
  }
};

// Tool handler implementation
export const sendEmailHandler: ToolHandler = {
  execute(args: SendEmailArgs): any {
    console.log('🛠️  Executing send_email with args:', args);
    
    // TODO: Implement your tool logic here
    // This is where you add your actual functionality
    
    // Access parameters like: args.parameterName
    
    // Example implementation:
    // const result = doSomething(args);
    
    // Return the result that will be sent back to OpenAI
    return { 
      result: 'Tool executed successfully',
      message: 'Replace this with your actual tool implementation',
      receivedArgs: args
    };
  }
};
