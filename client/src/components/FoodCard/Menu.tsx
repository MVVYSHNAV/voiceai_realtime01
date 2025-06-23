import React from 'react';
import menuItems from '../../menu.json';
import FoodCard from './Card';


const Menu: React.FC = () => {
  return (
    <div style={styles.scrollContainer}>
      {menuItems.map(item => (
        <div key={item.id} style={styles.cardWrapper}>
          <FoodCard item={item} />
        </div>
      ))}
    </div>
  );
};

export default Menu;

const styles: { [key: string]: React.CSSProperties } = {
  scrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    padding: '16px',
    gap: '16px',
    scrollSnapType: 'x mandatory',
  },
  cardWrapper: {
    flex: '0 0 auto',
    scrollSnapAlign: 'start',
  }
};