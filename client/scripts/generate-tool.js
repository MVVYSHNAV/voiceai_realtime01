#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to convert camelCase to snake_case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Helper function to convert snake_case to camelCase
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Helper function to convert snake_case to PascalCase
function snakeToPascal(str) {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function generateTool() {
  console.log('🛠️  Tool Generator for OpenAI Realtime API\n');

  try {
    // Get tool details from user
    const toolName = await question('What do you want to call your tool? (e.g., "send_email", "get_weather"): ');
    
    if (!toolName.trim()) {
      console.log('❌ Tool name is required!');
      process.exit(1);
    }

    const snakeCaseName = camelToSnake(toolName.trim());
    const camelCaseName = snakeToCamel(snakeCaseName);
    const pascalCaseName = snakeToPascal(snakeCaseName);

    const description = await question('Describe what your tool does: ');
    
    if (!description.trim()) {
      console.log('❌ Tool description is required!');
      process.exit(1);
    }

    // Ask about parameters
    const hasParams = await question('Does your tool need parameters? (y/n): ');
    
    let parameters = [];
    if (hasParams.toLowerCase() === 'y' || hasParams.toLowerCase() === 'yes') {
      console.log('\n📝 Let\'s add parameters (press Enter with empty name to finish):');
      
      while (true) {
        const paramName = await question('Parameter name: ');
        if (!paramName.trim()) break;
        
        const paramType = await question('Parameter type (string/number/boolean/object/array): ');
        const paramDesc = await question('Parameter description: ');
        const isRequired = await question('Is this parameter required? (y/n): ');
        
        parameters.push({
          name: paramName.trim(),
          type: paramType.trim() || 'string',
          description: paramDesc.trim(),
          required: isRequired.toLowerCase() === 'y' || isRequired.toLowerCase() === 'yes'
        });
        
        console.log('✅ Parameter added!\n');
      }
    }

    // Generate the tool file
    const toolFileContent = generateToolFile(snakeCaseName, pascalCaseName, description.trim(), parameters);
    
    // Write the tool file
    const toolsDir = join(__dirname, '../src/tools');
    const toolFilePath = join(toolsDir, `${camelCaseName}.ts`);
    
    if (existsSync(toolFilePath)) {
      const overwrite = await question(`⚠️  Tool file ${camelCaseName}.ts already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Tool generation cancelled.');
        process.exit(1);
      }
    }
    
    writeFileSync(toolFilePath, toolFileContent);
    console.log(`✅ Created tool file: src/tools/${camelCaseName}.ts`);

    // Update registry
    try {
      updateRegistry(snakeCaseName, camelCaseName, pascalCaseName);
      console.log('✅ Updated tool registry');
      
      // Validate the registry file by trying to parse it
      const updatedRegistry = readFileSync(join(__dirname, '../src/tools/registry.ts'), 'utf8');
      if (!updatedRegistry.includes(`${snakeCaseName}: {`)) {
        throw new Error('Tool was not properly added to registry');
      }
      
    } catch (registryError) {
      console.error('❌ Error updating registry:', registryError.message);
      console.log('⚠️  Tool file was created but registry update failed.');
      console.log('Please manually add the following to src/tools/registry.ts:');
      console.log(`\n// Add this import:`);
      console.log(`import { ${camelCaseName}Definition, ${camelCaseName}Handler } from './${camelCaseName}';`);
      console.log(`\n// Add this to the toolRegistry object:`);
      console.log(`  ${snakeCaseName}: {`);
      console.log(`    definition: ${camelCaseName}Definition,`);
      console.log(`    handler: ${camelCaseName}Handler`);
      console.log(`  },`);
      process.exit(1);
    }

    console.log(`\n🎉 Tool "${snakeCaseName}" generated successfully!`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated tool file');
    console.log('2. Implement your tool logic in the execute() method');
    console.log('3. Test your tool by asking the AI to use it');
    
  } catch (error) {
    console.error('❌ Error generating tool:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateToolFile(snakeCaseName, pascalCaseName, description, parameters) {
  const hasParams = parameters.length > 0;
  
  // Generate properties object
  const propertiesObj = hasParams ? 
    parameters.map(p => `      ${p.name}: {\n        type: '${p.type}',\n        description: '${p.description}'\n      }`).join(',\n') : '';
  
  // Generate required array
  const requiredParams = parameters.filter(p => p.required).map(p => `'${p.name}'`);
  const requiredArray = requiredParams.length > 0 ? `[${requiredParams.join(', ')}]` : '[]';
  
  // Generate TypeScript interface for parameters
  const paramInterface = hasParams ? 
    `interface ${pascalCaseName}Args {\n  ${parameters.map(p => `${p.name}${p.required ? '' : '?'}: ${getTypeScriptType(p.type)};`).join('\n  ')}\n}\n\n` : '';
  
  // Generate execute method parameters
  const executeParams = hasParams ? `args: ${pascalCaseName}Args` : 'args?: any';
  
  return `import { ToolDefinition, ToolHandler } from './types';

${paramInterface}// Tool definition for OpenAI
export const ${snakeToCamel(snakeCaseName)}Definition: ToolDefinition = {
  type: 'function',
  name: '${snakeCaseName}',
  description: '${description}',
  parameters: {
    type: 'object',
    properties: {${propertiesObj ? '\n' + propertiesObj + '\n    ' : ''}},
    required: ${requiredArray}
  }
};

// Tool handler implementation
export const ${snakeToCamel(snakeCaseName)}Handler: ToolHandler = {
  execute(${executeParams}): any {
    console.log('🛠️  Executing ${snakeCaseName} with args:', args);
    
    // TODO: Implement your tool logic here
    // This is where you add your actual functionality
    
    ${hasParams ? '// Access parameters like: args.parameterName' : '// No parameters needed for this tool'}
    
    // Example implementation:
    // const result = doSomething(args);
    
    // Return the result that will be sent back to OpenAI
    return { 
      result: 'Tool executed successfully',
      message: 'Replace this with your actual tool implementation'${hasParams ? ',\n      receivedArgs: args' : ''}
    };
  }
};
`;
}

function getTypeScriptType(paramType) {
  switch (paramType) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return 'any[]';
    case 'object': return 'any';
    default: return 'any';
  }
}

function updateRegistry(snakeCaseName, camelCaseName, pascalCaseName) {
  const registryPath = join(__dirname, '../src/tools/registry.ts');
  let registryContent = readFileSync(registryPath, 'utf8');
  
  // Add import
  const importStatement = `import { ${camelCaseName}Definition, ${camelCaseName}Handler } from './${camelCaseName}';`;
  
  // Find the line with other imports and add after the last import
  const importLines = registryContent.split('\n').filter(line => line.startsWith('import'));
  if (importLines.length > 0) {
    const lastImportIndex = registryContent.lastIndexOf(importLines[importLines.length - 1]);
    const afterLastImport = registryContent.indexOf('\n', lastImportIndex) + 1;
    registryContent = registryContent.slice(0, afterLastImport) + importStatement + '\n' + registryContent.slice(afterLastImport);
  }
  
  // More robust registry object matching - handle both complete and incomplete objects
  const registryStartMatch = registryContent.match(/export const toolRegistry: ToolRegistry = \{/);
  if (!registryStartMatch) {
    throw new Error('Could not find toolRegistry object in registry.ts');
  }
  
  const registryStart = registryStartMatch.index + registryStartMatch[0].length;
  
  // Find the end of the registry object - look for the closing }; pattern
  let registryEnd = -1;
  let braceCount = 1;
  let i = registryStart;
  
  while (i < registryContent.length && braceCount > 0) {
    if (registryContent[i] === '{') {
      braceCount++;
    } else if (registryContent[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        registryEnd = i;
        break;
      }
    }
    i++;
  }
  
  // If we couldn't find the closing brace, it might be incomplete
  if (registryEnd === -1) {
    // Look for the helper functions comment as a fallback
    const helperFunctionsMatch = registryContent.match(/\/\/ Helper functions for WebRTC client/);
    if (helperFunctionsMatch) {
      registryEnd = helperFunctionsMatch.index;
      // Insert the missing closing brace
      registryContent = registryContent.slice(0, registryEnd) + '};\n\n' + registryContent.slice(registryEnd);
      registryEnd = helperFunctionsMatch.index;
    } else {
      throw new Error('Could not find end of toolRegistry object');
    }
  }
  
  // Extract the existing entries
  const existingEntries = registryContent.substring(registryStart, registryEnd).trim();
  
  // Build the new registry content
  const beforeRegistry = registryContent.substring(0, registryStart);
  const afterRegistry = registryContent.substring(registryEnd);
  
  // Create the new tool entry
  const newToolEntry = `  ${snakeCaseName}: {\n    definition: ${camelCaseName}Definition,\n    handler: ${camelCaseName}Handler\n  }`;
  
  // Combine everything
  let newRegistryContent;
  if (existingEntries) {
    // Add comma to existing entries if needed
    const cleanedEntries = existingEntries.endsWith(',') ? existingEntries : existingEntries + ',';
    newRegistryContent = beforeRegistry + '\n' + cleanedEntries + '\n' + newToolEntry + '\n' + afterRegistry;
  } else {
    // First tool
    newRegistryContent = beforeRegistry + '\n' + newToolEntry + '\n' + afterRegistry;
  }
  
  writeFileSync(registryPath, newRegistryContent);
}

// Run the generator
generateTool().catch(console.error); 