import { ToolRegistry } from './types';
import { logHelloDefinition, logHelloHandler } from './logHello';
import { getCurrentTimeDefinition, getCurrentTimeHandler } from './getCurrentTime';
import { sendEmailDefinition, sendEmailHandler } from './sendEmail';
import { sendWaDefinition, sendWaHandler } from './sendWa';
import { makeCallDefinition, makeCallHandler } from './makeCall';
import { navigatePageDefinition, navigatePageHandler } from './navigatePage';
import { getAvailablePagesDefinition, getAvailablePagesHandler } from './getAvailablePages';
import { searchProductsDefinition, searchProductsHandler } from './searchProducts';
import { applyProductFiltersDefinition, applyProductFiltersHandler } from './applyProductFilters';
import { openFloatingChatDefinition, openFloatingChatHandler } from './openFloatingChat';

// Central registry of all available tools
export const toolRegistry: ToolRegistry = {
  log_hello: {
    definition: logHelloDefinition,
    handler: logHelloHandler
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
  }
};

// Helper functions for WebRTC client
export function getAllToolDefinitions() {
  return Object.values(toolRegistry).map(tool => tool.definition);
}

export function getToolHandler(toolName: string) {
  return toolRegistry[toolName]?.handler;
}

export function isToolRegistered(toolName: string): boolean {
  return toolName in toolRegistry;
} 