import React, { useEffect, useState } from 'react';
import Menu from './FoodCard/Menu';
import { useNavigate } from 'react-router-dom';

const Altair: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(total);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  useEffect(() => {
    // Expose globally for AI call
    (window as any).display_menu = () => {
      console.log('AI called display_menu');
      setShowMenu(true);
      updateCartCount();
    };

    (window as any).update_cart = () => {
      updateCartCount();
    };

    updateCartCount();

    return () => {
      delete (window as any).display_menu;
      delete (window as any).update_cart;
    };
  }, []);

  return (
    <div style={{ position: 'relative', paddingBottom: '60px' }}>
      {showMenu ? (
        <Menu />
      ) : (
        <p style={{ fontStyle: 'italic', color: '#999' }}>
          Say "show me the menu" or call <code>display_menu()</code> to load menu items.
        </p>
      )}

      {/* Only show if there's something in the cart */}
      {cartCount > 0 && (
        <button onClick={handleCartClick} style={styles.cartButton}>
          <span style={{ position: 'relative' }}>
            🛒
            <span style={styles.badge}>{cartCount}</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Altair;

const styles: { [key: string]: React.CSSProperties } = {
  cartButton: {
    position: 'fixed',
   
    
    backgroundColor: '#fffff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: 56,
    height: 56,
    fontSize: 24,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ff3d00',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 1,
    minWidth: 20,
    textAlign: 'center',
  }
};
