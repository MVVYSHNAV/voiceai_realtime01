import { RealtimeCall } from './components/RealtimeCall';
import { Routes, Route } from 'react-router-dom';
import CartPage from './components/FoodCard/cartpage';

function App() {
  return (

    <Routes>
      <Route path="/" element={ <RealtimeCall />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}

export default App; 