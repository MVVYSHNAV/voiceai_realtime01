import { Navigation } from './components/Navigation';
import { Homepage } from './components/Homepage';
import { Products } from './components/Products';
import { ProductDetail } from './components/ProductDetail';
import { Util } from './components/Util';
import { FloatingChat } from './components/FloatingChat';
import { useRouter } from './hooks/useRouter';

function App() {
  const { currentPath, navigate } = useRouter();

  const renderPage = () => {
    switch (currentPath) {
      case 'products':
        return <Products />;
      case 'product':
        return <ProductDetail />;
      case 'util':
        return <Util />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navigation currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <FloatingChat />
    </div>
  );
}

export default App; 