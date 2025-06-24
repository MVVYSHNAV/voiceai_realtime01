import type { ToolDefinition } from './types';
import { openProductHandler } from './openProduct';

export const testOpenProductDefinition: ToolDefinition = {
  type: 'function',
  name: 'testOpenProduct',
  description: 'Test the openProduct tool with various search examples to demonstrate its capabilities',
  parameters: {
    type: 'object',
    properties: {
      testType: {
        type: 'string',
        enum: ['all', 'id', 'name', 'brand', 'category', 'combination'],
        description: 'Type of test to run: all (run all tests), id (test ID search), name (test name search), brand (test brand search), category (test category search), combination (test combined searches)'
      }
    },
    required: ['testType']
  }
};

export const testOpenProductHandler = {
  execute: async ({ testType }: { testType: string }) => {
    const testCases = {
      id: [
        { query: "1", description: "Search by exact ID" },
        { query: "15", description: "Search by another ID" }
      ],
      name: [
        { query: "iPhone 15 Pro Max", description: "Search by exact product name" },
        { query: "MacBook Pro", description: "Search by partial product name" },
        { query: "headphones", description: "Search by product type" }
      ],
      brand: [
        { query: "Apple", description: "Search by brand name" },
        { query: "Sony", description: "Search by another brand" },
        { query: "Canon", description: "Search by camera brand" }
      ],
      category: [
        { query: "Audio", description: "Search by category" },
        { query: "Photography", description: "Search by another category" },
        { query: "Wearables", description: "Search by wearables category" }
      ],
      combination: [
        { query: "Apple Watch", description: "Search by brand + product type" },
        { query: "Sony headphones", description: "Search by brand + category" },
        { query: "Canon lens", description: "Search by brand + product type" },
        { query: "Herman Miller chair", description: "Search by brand + furniture" }
      ]
    };

    const results: any[] = [];

    try {
      if (testType === 'all') {
        // Run all test types
        for (const [type, cases] of Object.entries(testCases)) {
          for (const testCase of cases) {
            const result = await openProductHandler.execute({ searchQuery: testCase.query });
            results.push({
              testType: type,
              query: testCase.query,
              description: testCase.description,
              success: result.success,
              message: result.message,
              productFound: result.product?.name || null
            });
          }
        }
      } else if (testCases[testType as keyof typeof testCases]) {
        // Run specific test type
        const cases = testCases[testType as keyof typeof testCases];
        for (const testCase of cases) {
          const result = await openProductHandler.execute({ searchQuery: testCase.query });
          results.push({
            testType,
            query: testCase.query,
            description: testCase.description,
            success: result.success,
            message: result.message,
            productFound: result.product?.name || null
          });
        }
      } else {
        return {
          success: false,
          message: `Invalid test type: ${testType}. Valid types: all, id, name, brand, category, combination`
        };
      }

      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;

      return {
        success: true,
        message: `OpenProduct test completed: ${successCount}/${totalCount} tests passed`,
        testType,
        summary: {
          total: totalCount,
          passed: successCount,
          failed: totalCount - successCount
        },
        results,
        usage: {
          description: "The openProduct tool can search for products using:",
          methods: [
            "Product ID (e.g., '1', '15')",
            "Exact product name (e.g., 'iPhone 15 Pro Max')",
            "Partial product name (e.g., 'iPhone', 'MacBook')",
            "Brand name (e.g., 'Apple', 'Sony', 'Canon')",
            "Category (e.g., 'Audio', 'Photography', 'Wearables')",
            "Brand + product type (e.g., 'Apple Watch', 'Sony headphones')",
            "Keywords in description/features"
          ],
          tips: [
            "Be specific for better matches",
            "Use brand names for brand-specific searches",
            "Combine brand + product type for targeted results",
            "Product IDs give exact matches",
            "The tool will suggest alternatives if no match is found"
          ]
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Error running openProduct tests: ${error instanceof Error ? error.message : 'Unknown error'}`,
        testType,
        results
      };
    }
  }
}; 