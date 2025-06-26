// tools/generateInvoice.ts
import type { ToolDefinition, ToolHandler } from './types';
import type { CartItem } from '../types/product';
import { navigateTo } from '../utils/navigation';

let getCartCallback: (() => { items: CartItem[]; total: number }) | null = null;

export const registerInvoiceCartFunction = (
  fn: () => { items: CartItem[]; total: number }
) => {
  getCartCallback = fn;
};

export const generateInvoiceDefinition: ToolDefinition = {
  type: 'function',
  name: 'generateInvoice',
  description: 'Generate invoice for current cart using customer info.',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' }
    },
    required: ['name', 'email', 'address']
  }
};

export const generateInvoiceHandler: ToolHandler = {
  execute: async ({ name, email, address }) => {
    if (!getCartCallback) {
      return {
        success: false,
        message: '❌ Cannot generate invoice: cart context not available.'
      };
    }

    const { items: cart, total } = getCartCallback();

    if (!cart || cart.length === 0) {
      return {
        success: false,
        message: '❌ Cannot generate invoice: cart is empty.'
      };
    }

    const tax = total * 0.05;
    const grand = total + tax;

    const invoice = {
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customer: { name, email, address },
      items: cart,
      total,
      tax,
      grand
    };

    navigateTo('Billing');

    return {
      success: true,
      invoice,
      message: `✅ Invoice generated for ${name}. Total: ₹${grand.toLocaleString()}`
    };
  }
};
