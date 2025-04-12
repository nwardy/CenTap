import React from 'react';
import { colors } from '../assets/styles/colors';

const StatusIndicator = ({ isPresent }) => {
  const backgroundColor = isPresent ? colors.success : colors.error;
  
  return (
    <div 
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor,
        margin: '0'
      }}
    />
  );
};

export default StatusIndicator;