import type { ToolRegistry } from './types';

import { loggerDefinition, loggerHandler } from './logger';
import { getCurrentTimeDefinition, getCurrentTimeHandler } from './getCurrentTime';
import { sendEmailDefinition, sendEmailHandler } from './sendEmail';
import { sendWaDefinition, sendWaHandler } from './sendWa';
import { makeCallDefinition, makeCallHandler } from './makeCall';
import { navigatePageDefinition, navigatePageHandler } from './navigatePage';
import { getAvailablePagesDefinition, getAvailablePagesHandler } from './getAvailablePages';
import { searchProductsDefinition, searchProductsHandler } from './searchProducts';
import { applyProductFiltersDefinition, applyProductFiltersHandler } from './applyProductFilters';
import { openFloatingChatDefinition, openFloatingChatHandler } from './openFloatingChat';
import { viewProductDefinition, viewProductHandler } from './viewProduct';
import { openProductDefinition, openProductHandler } from './openProduct';
import { getContextDefinition, getContextHandler } from './getContext';
import { testContextDefinition, testContextHandler } from './testContext';
import { testLoggerDefinition, testLoggerHandler } from './testLogger';
import { debugToolsDefinition, debugToolsHandler } from './debugTools';
import { getSpecificationDefinition, getSpecificationHandler } from './getSpecification';
import { addToCartDefinition, addToCartHandler } from './addToCart';
import { getCartContentsDefinition, getCartContentsHandler } from './getCartContent';
import { placeOrderDefinition, placeOrderHandler } from './placeOrder';
import { generateInvoiceDefinition, generateInvoiceHandler } from './generateInvoice';
import { recommendProductDefinition, recommendProductHandler } from './recommendationTool';

export const toolRegistry: ToolRegistry = {
  logger: {
    definition: loggerDefinition,
    handler: loggerHandler
  },
  get_current_time: {
    definition: getCurrentTimeDefinition,
    handler: getCurrentTimeHandler
  },
  send_email: {
    definition: sendEmailDefinition,
    handler: sendEmailHandler
  },
  send_wa: {
    definition: sendWaDefinition,
    handler: sendWaHandler
  },
  make_call: {
    definition: makeCallDefinition,
    handler: makeCallHandler
  },
  navigate_page: {
    definition: navigatePageDefinition,
    handler: navigatePageHandler
  },
  get_available_pages: {
    definition: getAvailablePagesDefinition,
    handler: getAvailablePagesHandler
  },
  search_products: {
    definition: searchProductsDefinition,
    handler: searchProductsHandler
  },
  apply_product_filters: {
    definition: applyProductFiltersDefinition,
    handler: applyProductFiltersHandler
  },
  open_floating_chat: {
    definition: openFloatingChatDefinition,
    handler: openFloatingChatHandler
  },
  view_product: {
    definition: viewProductDefinition,
    handler: viewProductHandler
  },
  open_product: {
    definition: openProductDefinition,
    handler: openProductHandler
  },
  get_context: {
    definition: getContextDefinition,
    handler: getContextHandler
  },
  test_context: {
    definition: testContextDefinition,
    handler: testContextHandler
  },
  test_logger: {
    definition: testLoggerDefinition,
    handler: testLoggerHandler
  },
  debug_tools: {
    definition: debugToolsDefinition,
    handler: debugToolsHandler
  },

  // Aliases for naming compatibility with different casing
  getContext: {
    definition: getContextDefinition,
    handler: getContextHandler
  },
  getSpecification: {
    definition: getSpecificationDefinition,
    handler: getSpecificationHandler
  },


  add_to_cart: {
    definition: addToCartDefinition,
    handler: addToCartHandler
  },

  getCartContents: {
    definition: getCartContentsDefinition,
    handler: getCartContentsHandler
  },

  place_order: {
    definition: placeOrderDefinition,
    handler: placeOrderHandler
  },
  placeOrder: {
    definition: placeOrderDefinition,
    handler: placeOrderHandler
  },

  generateInvoice: {
    definition: generateInvoiceDefinition,
    handler: generateInvoiceHandler
  },
  generate_invoice: {
    definition: generateInvoiceDefinition,
    handler: generateInvoiceHandler
  },

  recommend_product: {
    definition: recommendProductDefinition,
    handler: recommendProductHandler
  }
};

// ==============================
// ✅ Tool utility exports
// ==============================

export function getAllToolDefinitions() {
  return Object.values(toolRegistry).map(tool => tool.definition);
}

export function getToolHandler(toolName: string) {
  return toolRegistry[toolName]?.handler;
}

export function isToolRegistered(toolName: string): boolean {
  return toolName in toolRegistry;
}
