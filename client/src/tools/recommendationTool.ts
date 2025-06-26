// tools/recommendProduct.ts
import type { ToolDefinition, ToolHandler } from './types';
import type { Product } from '../types/product';
import { products } from '../data/products.json';

let setRecommendationCallback: ((product: Product | null) => void) | null = null;

export const registerRecommendationSetter = (
  fn: (product: Product | null) => void
) => {
  setRecommendationCallback = fn;
};

export const recommendProductDefinition: ToolDefinition = {
  type: 'function',
  name: 'recommendProduct',
  description: `Friendly product recommendation based on situation, category, brand, or budget.`,
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Type of product (e.g. phone, jacket, bag)'
      },
      brand: {
        type: 'string',
        description: 'Preferred brand (optional)'
      },
      maxPrice: {
        type: 'number',
        description: 'Maximum budget (optional)'
      },
      situation: {
        type: 'string',
        description: 'What it’s for (e.g. "college", "winter trip") (optional)'
      }
    },
    required: ['category']
  }
};

export const recommendProductHandler: ToolHandler = {
  execute: async ({ category, brand, maxPrice, situation }) => {
    if (!setRecommendationCallback) {
      return {
        success: false,
        message: '⚠️ Recommendation system isn’t ready yet.'
      };
    }

    if (!situation) {
      return {
        success: false,
        message: `🤔 What’s the occasion or use case?`
      };
    }

    const lowerSituation = situation.toLowerCase();
    if (lowerSituation.includes('winter') && !category.toLowerCase().includes('jacket')) {
      category = 'Jackets';
    } else if (lowerSituation.includes('beach')) {
      category = 'Sunglasses';
    } else if (lowerSituation.includes('office')) {
      category = 'Bags';
    }

    let filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (brand) filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);

    if (filtered.length === 0) {
      setRecommendationCallback(null);
      return {
        success: false,
        message: `😕 Couldn't find anything in “${category}”. Try a different brand, budget or occasion?`
      };
    }

    const sorted = filtered.sort((a, b) => {
      const score = (p: Product) =>
        (p.rating || 3) * 20 + (p.inStock ? 30 : 0) + (10000 - p.price);
      return score(b) - score(a);
    });

    const recommended = sorted[0];
    setRecommendationCallback(recommended);

    let reason = `It's a top-rated choice in ${category}`;
    if (brand && recommended.brand.toLowerCase() === brand.toLowerCase()) {
      reason += ` from **${brand}**`;
    }
    if (recommended.price <= (maxPrice || 999999)) {
      reason += ` and fits your budget.`;
    } else {
      reason += `. It’s slightly above budget but worth it.`;
    }

    return {
      success: true,
      message: `🎯 Based on your plan (“${situation}”), I recommend **${recommended.name}**!\n\n${reason}`,
      product: {
        id: recommended.id,
        name: recommended.name,
        brand: recommended.brand,
        category: recommended.category,
        price: recommended.price,
        rating: recommended.rating,
        inStock: recommended.inStock
      }
    };
  }
};
