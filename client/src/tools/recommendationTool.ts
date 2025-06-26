import type { ToolDefinition, ToolHandler } from './types';
import type { Product } from '../types/product';
import { products } from '../data/products.json';

let setRecommendationCallback: ((product: Product | null) => void) | null = null;

export const registerRecommendationSetter = (fn: (product: Product | null) => void) => {
  setRecommendationCallback = fn;
};

export const recommendProductDefinition: ToolDefinition = {
  type: 'function',
  name: 'recommendProduct',
  description: `Friendly product recommendation based on situation, category, brand, or budget. 
  The AI may also ask follow-up questions if info is missing (e.g. "Where are you going?" or "What will the weather be like?")`,
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Type of product you’re looking for (e.g. phone, laptop, headphones, jacket, bag)'
      },
      brand: {
        type: 'string',
        description: 'Preferred brand (optional)'
      },
      maxPrice: {
        type: 'number',
        description: 'Your budget or maximum price (optional)'
      },
      situation: {
        type: 'string',
        description: 'Where or what it’s for (e.g. "winter trip to Kashmir", "college", "daily use") (optional)'
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
        message: '⚠️ Recommendation system isn’t ready yet. Try again shortly.'
      };
    }

    // Optional: intelligent clarification for the AI
    if (!situation) {
      return {
        success: false,
        message: `🤔 Just to tailor it better — what’s the occasion or use case? Like "for winter trip", "college", or "gaming"?`
      };
    }

    // 🌨️ Smart logic: modify category if situation hints at something else
    const lowerSituation = situation.toLowerCase();
    if (lowerSituation.includes('winter') && !category.toLowerCase().includes('jacket')) {
      category = 'Jackets';
    } else if (lowerSituation.includes('beach')) {
      category = 'Sunglasses';
    } else if (lowerSituation.includes('office')) {
      category = 'Bags';
    }

    // Filter by category
    let filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());

    if (brand) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    if (filtered.length === 0) {
      setRecommendationCallback(null);
      return {
        success: false,
        message: `😕 I couldn’t find anything in “${category}” that matches your filters.\n\nWant to try a different brand, budget or maybe tell me the occasion?`
      };
    }

    // 🎯 Sort by smart score
    const sorted = filtered.sort((a, b) => {
      const score = (p: Product) =>
        (p.rating || 3) * 20 +
        (p.inStock ? 30 : 0) +
        (10000 - p.price);
      return score(b) - score(a);
    });

    const recommended = sorted[0];
    setRecommendationCallback(recommended);

    // Build friendly response
    let reason = `It's a top-rated choice in ${category}`;
    if (brand && recommended.brand.toLowerCase() === brand.toLowerCase()) {
      reason += ` from your favorite brand **${brand}**`;
    }
    if (recommended.price <= (maxPrice || 999999)) {
      reason += ` and fits within your budget.`;
    } else {
      reason += `. It’s slightly above your budget but offers great value.`;
    }

    // 📦 Final response
    return {
      success: true,
      message: `🎯 Based on your plan (“${situation}”), I recommend the **${recommended.name}**!\n\n${reason}\n\nWant more options or something cheaper?`,
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
