# Tool Generator

Interactive CLI tool to generate new tool scaffolding for Tomorrow (OpenAI Realtime API voice agent).

## Usage

Run the tool generator:

```bash
bun run generate-tool
# or
npm run generate-tool
# or directly
node scripts/generate-tool.js
```

## What it does

The tool generator will:

1. **Ask for tool details** - name, description, parameters
2. **Generate tool file** - creates `src/tools/yourTool.ts` with proper structure
3. **Update registry** - automatically adds your tool to `src/tools/registry.ts`
4. **Provide TypeScript types** - generates proper interfaces for parameters

## Example

```bash
$ bun run generate-tool

🛠️  Tool Generator for OpenAI Realtime API

What do you want to call your tool? (e.g., "send_email", "get_weather"): send_email
Describe what your tool does: Sends an email to a specified recipient
Does your tool need parameters? (y/n): y

📝 Let's add parameters (press Enter with empty name to finish):
Parameter name: recipient
Parameter type (string/number/boolean/object/array): string
Parameter description: Email address of the recipient
Is this parameter required? (y/n): y
✅ Parameter added!

Parameter name: subject
Parameter type (string/number/boolean/object/array): string
Parameter description: Subject line of the email
Is this parameter required? (y/n): y
✅ Parameter added!

Parameter name: body
Parameter type (string/number/boolean/object/array): string  
Parameter description: Email body content
Is this parameter required? (y/n): y
✅ Parameter added!

Parameter name: 

✅ Created tool file: src/tools/sendEmail.ts
✅ Updated tool registry

🎉 Tool "send_email" generated successfully!

📋 Next steps:
1. Review the generated tool file
2. Implement your tool logic in the execute() method
3. Test your tool by asking the AI to use it
```

## Generated File Structure

The generator creates a complete tool file with:

- **Tool Definition** - OpenAI function schema
- **TypeScript Interface** - Type-safe parameter handling  
- **Tool Handler** - Execute method with TODO comments
- **Registry Integration** - Automatic registration

## Features

- ✅ Interactive prompts for all tool details
- ✅ Automatic naming conventions (snake_case, camelCase, PascalCase)
- ✅ Parameter type validation
- ✅ TypeScript interface generation
- ✅ Registry auto-update
- ✅ Overwrite protection
- ✅ Error handling
- ✅ Clear next steps guidance

## File Naming

- Input: `send_email` or `sendEmail` 
- Generated file: `src/tools/sendEmail.ts`
- Function name: `send_email`
- Export names: `sendEmailDefinition`, `sendEmailHandler` 