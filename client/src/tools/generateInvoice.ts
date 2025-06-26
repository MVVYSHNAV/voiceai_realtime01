import type { ToolDefinition, ToolHandler } from './types';
import { getCart } from '../app/cartStore';
import { navigateTo } from '../utils/navigation';

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
    const cart = getCart();

    if (!cart || cart.length === 0) {
      return {
        success: false,
        message: '❌ Cannot generate invoice: cart is empty.'
      };
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = total * 0.05;
    const grand = total + tax;

    const invoice = {
      customer: { name, email, address },
      items: cart,
      total,
      tax,
      grand,
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString()
    };

    // ✅ Navigate to Billing page
    navigateTo('Billing');

    return {
      success: true,
      invoice,
      message: `✅ Invoice generated for ${name}. Total: ₹${grand.toLocaleString()}`
    };
  }
};
