import React from 'react';
import StatusIndicator from './StatusIndicator';
import { colors } from '../assets/styles/colors';

const AttendanceCard = ({ attendee }) => {
  const { name, present, checkInTime } = attendee;
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: colors.primary
    }}>
      <StatusIndicator isPresent={present} />
      <div style={{ flex: 1 }}>
        <div style={{ color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
        {present && checkInTime && (
          <div style={{ color: colors.textSecondary, fontSize: '12px' }}>
            Checked in at {checkInTime.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCard;