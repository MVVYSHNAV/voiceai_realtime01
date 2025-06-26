import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';
import { RecommendedProvider } from './context/RecommendedContext';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecommendedProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </RecommendedProvider>
  </React.StrictMode>
);
