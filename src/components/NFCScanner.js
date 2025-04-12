import React, { useState, useContext, useEffect } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import { scanNFCTag } from '../services/nfcService';
import { colors } from '../assets/styles/colors';

const NFCScanner = () => {
  const { checkInAttendee, attendees } = useContext(AttendanceContext);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [error, setError] = useState(null);
  const [scanningActive, setScanningActive] = useState(false);

  // Start NFC scanning
  const startScanning = async () => {
    try {
      setScanning(true);
      setError(null);
      setScanningActive(true);
      
      // In a real implementation, this would be a continuous process
      // For demo purposes, we're using a single scan
      const nfcTagId = await scanNFCTag();
      
      // Find the attendee with this tag
      const attendee = attendees.find(a => a.nfcTagId === nfcTagId);
      
      if (attendee) {
        checkInAttendee(nfcTagId);
        setLastScanned(attendee);
      } else {
        setError(`Unknown NFC tag: ${nfcTagId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  // For demo purposes, simulate continuous scanning
  useEffect(() => {
    let interval;
    
    if (scanningActive) {
      interval = setInterval(() => {
        // Simulate scanning a random tag
        const randomIndex = Math.floor(Math.random() * attendees.length);
        const randomAttendee = attendees[randomIndex];
        
        if (randomAttendee && !randomAttendee.present) {
          checkInAttendee(randomAttendee.nfcTagId);
          setLastScanned(randomAttendee);
        }
      }, 3000); // Scan every 3 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanningActive, attendees, checkInAttendee]);

  return (
    <div style={{
      padding: '16px',
      backgroundColor: colors.primary,
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      margin: '16px'
    }}>
      <h2 style={{ color: colors.textPrimary, marginTop: 0 }}>NFC Scanner</h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '16px 0'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: scanning ? colors.secondary : colors.hover,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
          transition: 'all 0.3s ease',
          animation: scanning ? 'pulse 1.5s infinite' : 'none'
        }}>
          <span style={{ color: scanning ? 'white' : colors.textPrimary }}>
            {scanning ? 'Scanning...' : 'Ready'}
          </span>
        </div>
        
        <button 
          onClick={() => {
            if (scanningActive) {
              setScanningActive(false);
            } else {
              startScanning();
            }
          }}
          style={{
            backgroundColor: scanningActive ? colors.error : colors.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {scanningActive ? 'Stop Scanning' : 'Start Scanning'}
        </button>
      </div>
      
      {lastScanned && (
        <div style={{
          padding: '12px',
          backgroundColor: colors.hover,
          borderRadius: '4px',
          marginTop: '16px'
        }}>
          <strong>Last checked in:</strong> {lastScanned.name} 
          <span style={{ 
            color: colors.success, 
            marginLeft: '8px',
            fontWeight: 'bold'
          }}>✓</span>
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#FFEBEE',
          color: colors.error,
          borderRadius: '4px',
          marginTop: '16px'
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default NFCScanner;