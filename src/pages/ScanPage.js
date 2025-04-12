import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import NFCScanner from '../components/NFCScanner';
import { colors } from '../assets/styles/colors';

const ScanPage = () => {
  const { attendees } = useContext(AttendanceContext);
  const [recentlyScanned, setRecentlyScanned] = useState([]);
  
  // Add a scanned attendee to the recently scanned list
  const addToRecentlyScanned = (attendee) => {
    setRecentlyScanned(prev => [attendee, ...prev].slice(0, 5));
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ color: colors.textPrimary, marginBottom: '24px' }}>Scan Attendance</h1>
      
      <NFCScanner onScan={addToRecentlyScanned} />
      
      {recentlyScanned.length > 0 && (
        <div style={{
          marginTop: '32px',
          backgroundColor: colors.primary,
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: '16px' }}>
            Recently Scanned
          </h2>
          
          {recentlyScanned.map((attendee, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              borderBottom: index < recentlyScanned.length - 1 ? `1px solid ${colors.border}` : 'none'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: colors.success,
                marginRight: '12px'
              }} />
              <div>
                <div style={{ fontWeight: 500 }}>{attendee.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                  {attendee.checkInTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanPage;