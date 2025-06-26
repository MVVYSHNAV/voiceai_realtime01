import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Homepage } from './components/Homepage';
import { Products } from './components/Products';
import { ProductDetail } from './components/ProductDetail';
import { Util } from './components/Util';
import { FloatingChat } from './components/FloatingChat';
import { useRouter } from './hooks/useRouter';
import ToolCheck from './tools/devtool';
import BillingPage from './components/Billingpage';
import Recommended from './components/RecommendedProductCard';
import Cart from './components/AddtoCart';


function App() {
  const { currentPath, navigate } = useRouter();  

  const renderPage = () => {
    switch (currentPath) {
      case 'products': return <Products />;
      case 'product': return <ProductDetail />;
      case 'util': return <Util />;
      case 'Cart': return <Cart />;
      case 'Billing': return <BillingPage />;
      case 'toolCheck': return <ToolCheck />;
      case 'Recommended': return <Recommended />;
      default: return <Homepage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navigation currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      <FloatingChat />
    </div>
  );
}

export default App;