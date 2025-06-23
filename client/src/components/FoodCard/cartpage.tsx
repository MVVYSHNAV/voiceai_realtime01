import React, { useEffect, useState } from 'react';
import { CartItem } from '../../tools/types';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p style={styles.empty}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={styles.list}>
            {cartItems.map(item => (
              <li key={item.id} style={styles.item}>
                <img src={item.image} alt={item.name} style={styles.image} />
                <div style={styles.info}>
                  <h4>{item.name}</h4>
                  <p style={styles.price}>₹{item.price} x {item.quantity}</p>
                  <div style={styles.controls}>
                    <button onClick={() => decreaseQty(item.id)} style={styles.qtyBtn}>−</button>
                    <span style={styles.qty}>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)} style={styles.qtyBtn}>＋</button>
                    <button onClick={() => removeItem(item.id)} style={styles.removeBtn}>🗑️</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <h3 style={styles.total}>Total: ₹{total}</h3>

          <div style={styles.buttons}>
            <button onClick={clearCart} style={styles.clearBtn}>Clear Cart</button>
            <button onClick={() => alert('Proceeding to checkout...')} style={styles.checkoutBtn}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 700,
    margin: '40px auto',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: 24,
    color: '#333'
  },
  empty: {
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    marginTop: 40
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  item: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderBottom: '1px solid #eee'
  },
  image: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  price: {
    margin: '4px 0',
    color: '#555'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontSize: 18
  },
  qty: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center'
  },
  removeBtn: {
    backgroundColor: '#ff4d4f',
    border: 'none',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 6,
    cursor: 'pointer'
  },
  total: {
    textAlign: 'right',
    fontSize: 20,
    marginTop: 16,
    color: '#222'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24
  },
  clearBtn: {
    padding: '10px 16px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  checkoutBtn: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    border: 'none',
    color: 'white',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
