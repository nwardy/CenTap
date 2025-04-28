import React, { useState } from 'react';
import StatusIndicator from './StatusIndicator';
import { colors } from '../assets/styles/colors';

const AttendanceCard = ({ attendee }) => {
  const { name, present, checkInTime, photoUrl, nfcTagId } = attendee;
  const [showDetails, setShowDetails] = useState(false);
  
  const handleClick = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: showDetails ? colors.hover : colors.primary,
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onClick={handleClick}
        className="attendance-card"
      >
        <div style={{ marginRight: '16px' }}>
          <StatusIndicator isPresent={present} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
          {present && checkInTime && (
            <div style={{ color: colors.textSecondary, fontSize: '12px' }}>
              Checked in at {checkInTime.toLocaleTimeString()}
            </div>
          )}
        </div>
        {/* Small arrow indicator */}
        <div style={{ marginLeft: '8px', transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
          ›
        </div>
      </div>
      
      {/* Details panel that expands below */}
      {showDetails && (
        <div 
          style={{
            padding: '16px',
            backgroundColor: 'white',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <img 
            src={photoUrl} 
            alt={name}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: `3px solid ${present ? colors.success : colors.error}`
            }}
          />
          <div>
            <h3 style={{ 
              margin: '0 0 8px 0',
              fontSize: '18px'
            }}>
              {name}
            </h3>
            <div style={{ 
              color: colors.textSecondary,
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              <strong>ID:</strong> {nfcTagId}
            </div>
            <div style={{ 
              color: colors.textSecondary,
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              <strong>Status:</strong> <span style={{ color: present ? colors.success : colors.error, fontWeight: 'bold' }}>
                {present ? 'Present' : 'Absent'}
              </span>
            </div>
            {present && checkInTime && (
              <div style={{ 
                color: colors.textSecondary,
                fontSize: '14px'
              }}>
                <strong>Check-in time:</strong> {checkInTime.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
      `}</style>
    </>
  );
};

export default AttendanceCard;