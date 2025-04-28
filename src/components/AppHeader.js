import React from 'react';
import { colors } from '../assets/styles/colors';

const AppHeader = ({ stats }) => {
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: colors.primary,
      borderBottom: `1px solid ${colors.border}`,
      gap: '16px'
    }}>
      <div style={{ 
        height: '40px',
        width: '160px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img 
          src={require('../assets/images/logo.png')} 
          alt="CenTap Logo" 
          style={{
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <strong>{stats.present}</strong>/{stats.total} Present ({stats.rate}%)
        </div>
      </div>
    </header>
  );
};

export default AppHeader;