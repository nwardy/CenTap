import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import AttendanceCard from './AttendanceCard';
import { colors } from '../assets/styles/colors';

const AttendanceList = () => {
  const { attendees } = useContext(AttendanceContext);
  const [filter, setFilter] = useState('all'); // 'all', 'present', 'absent'
  
  const filteredAttendees = attendees.filter(attendee => {
    if (filter === 'all') return true;
    if (filter === 'present') return attendee.present;
    if (filter === 'absent') return !attendee.present;
    return true;
  });
  
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: colors.primary,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <h2 style={{ color: colors.textPrimary, margin: 0 }}>Attendees</h2>
        <div style={{
          display: 'flex',
          backgroundColor: colors.hover,
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 12px',
              border: 'none',
              backgroundColor: filter === 'all' ? colors.secondary : 'transparent',
              color: filter === 'all' ? 'white' : colors.textPrimary,
              cursor: 'pointer'
            }}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('present')}
            style={{
              padding: '8px 12px',
              border: 'none',
              backgroundColor: filter === 'present' ? colors.secondary : 'transparent',
              color: filter === 'present' ? 'white' : colors.textPrimary,
              cursor: 'pointer'
            }}
          >
            Present
          </button>
          <button 
            onClick={() => setFilter('absent')}
            style={{
              padding: '8px 12px',
              border: 'none',
              backgroundColor: filter === 'absent' ? colors.secondary : 'transparent',
              color: filter === 'absent' ? 'white' : colors.textPrimary,
              cursor: 'pointer'
            }}
          >
            Absent
          </button>
        </div>
      </div>
      
      <div style={{ 
        maxHeight: 'calc(100vh - 180px)', 
        overflowY: 'auto',
        width: '100%'
      }}>
        {filteredAttendees.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: colors.textSecondary }}>
            No attendees found with the selected filter.
          </div>
        ) : (
          filteredAttendees.map(attendee => (
            <AttendanceCard key={attendee.id} attendee={attendee} />
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceList;