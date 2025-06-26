import { getProductSpecificationHandler } from './getSpecification'; // Adjust path if necessary

async function testProductSpecificationTool() {
  console.log("--- Testing getProductSpecificationHandler ---");

  // Test Case 1: Valid Product ID (prod123)
  console.log("\nTesting with valid Product ID: 'prod123'");
  const result1 = await getProductSpecificationHandler.execute({ productId: 'prod123' });
  console.log("Result 1:", result1);

  // Test Case 2: Valid Product ID (prod456)
  console.log("\nTesting with valid Product ID: 'prod456'");
  const result2 = await getProductSpecificationHandler.execute({ productId: 'prod456' });
  console.log("Result 2:", result2);

  // Test Case 3: Unknown Product ID (not in mock data)
  console.log("\nTesting with unknown Product ID: 'nonExistentProd'");
  const result3 = await getProductSpecificationHandler.execute({ productId: 'nonExistentProd' });
  console.log("Result 3:", result3);

  // Test Case 4: Missing Product ID (productId is undefined)
  console.log("\nTesting with missing Product ID:");
  const result4 = await getProductSpecificationHandler.execute({}); // Pass an empty object or undefined productId
  console.log("Result 4:", result4);

  // Test Case 5: Empty String Product ID
  console.log("\nTesting with empty string Product ID:");
  const result5 = await getProductSpecificationHandler.execute({ productId: '' });
  console.log("Result 5:", result5);

  console.log("\n--- Testing Complete ---");
}

// Call the test function to run the tests
testProductSpecificationTool();