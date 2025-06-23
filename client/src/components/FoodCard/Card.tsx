import React, { useState } from 'react';

interface FoodItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem, quantity: number) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(q => q + 1);
  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  

  return (
    <div className="food-card" style={styles.card}>
      <img src={item.image} alt={item.name} style={styles.image} />
      <div style={styles.details}>
        <h3>{item.name}</h3>
        <p style={{ fontStyle: 'italic', color: '#777' }}>{item.category}</p>
        <p>{item.description}</p>
        <p><strong>₹{item.price}</strong></p>

        <div style={styles.controls}>
          <button onClick={decrease} style={styles.qtyBtn}>−</button>
          <span>{quantity}</span>
          <button onClick={increase} style={styles.qtyBtn}>+</button>
        </div>

        <button
          disabled={!item.available}
          onClick={() => onAddToCart(item, quantity)}
          style={{
            ...styles.addToCart,
            backgroundColor: item.available ? '#28a745' : '#ccc',
          }}
        >
          {item.available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: '1px solid #eee',
    borderRadius: 12,
    overflow: 'hidden',
    width: 280,
    margin: 16,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: 160,
    objectFit: 'cover'
  },
  details: {
    padding: 16
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '12px 0'
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: '1px solid #aaa',
    background: 'white',
    cursor: 'pointer'
  },
  addToCart: {
    width: '100%',
    padding: 10,
    border: 'none',
    borderRadius: 6,
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
