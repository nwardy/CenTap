import React, { useContext } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import StatusIndicator from './StatusIndicator';
import { colors } from '../assets/styles/colors';

const TotalView = () => {
  const { attendees, getStats } = useContext(AttendanceContext);
  const stats = getStats();
  
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: colors.primary,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div>
          <h2 style={{ color: colors.textPrimary, margin: 0 }}>Total Attendance</h2>
          <div style={{ color: colors.textSecondary }}>
            {stats.present} present / {stats.total} total ({stats.rate}%)
          </div>
        </div>
        <button style={{
          backgroundColor: colors.secondary,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer'
        }}>
          Export Data
        </button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
        gap: '12px',
        padding: '16px'
      }}>
        {attendees.map(attendee => (
          <div key={attendee.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: attendee.present ? colors.hover : 'transparent',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <StatusIndicator isPresent={attendee.present} />
            </div>
            <div style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'center',
              fontSize: '12px',
              color: colors.textPrimary
            }}>
              {attendee.name.split(' ')[1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalView;