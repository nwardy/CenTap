import React, { useState, useContext, useEffect, useRef } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import { scanNFCTag } from '../services/nfcService';
import { colors } from '../assets/styles/colors';

const NFCScanner = () => {
  const { checkInAttendee, attendees } = useContext(AttendanceContext);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [error, setError] = useState(null);
  const [scanningActive, setScanningActive] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [successScan, setSuccessScan] = useState(false);
  const photoTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);

  // Start NFC scanning
  const startScanning = () => {
    try {
      setScanning(false); // Just set state to active, no actual scanning
      setError(null);
      setScanningActive(true);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Stop NFC scanning
  const stopScanning = () => {
    setScanningActive(false);
    setScanning(false);
  };

  // Set the last scanned attendee
  const setScannedAttendee = (attendee) => {
    setLastScanned(attendee);
    setShowPhoto(false); // No popup animation
    
    // Trigger success animation
    setSuccessScan(true);
    
    // Clear any previous timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    
    // Reset success animation after 1.5 seconds
    successTimeoutRef.current = setTimeout(() => {
      setSuccessScan(false);
    }, 1500);
  };
  
  // Simulate an ID scan (for demo button)
  const handleTestScan = () => {
    if (!scanningActive) return;
    
    setScanning(true);
    
    // Show scanning animation for 1.5 seconds
    setTimeout(() => {
      // Pick a random attendee that isn't already checked in
      const availableAttendees = attendees.filter(a => !a.present);
      
      if (availableAttendees.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableAttendees.length);
        const randomAttendee = availableAttendees[randomIndex];
        
        checkInAttendee(randomAttendee.nfcTagId);
        setScannedAttendee(randomAttendee);
      } else {
        // If all attendees are checked in, reset one random attendee to not present
        const randomIndex = Math.floor(Math.random() * attendees.length);
        const resetAttendee = {
          ...attendees[randomIndex],
          present: false,
          checkInTime: null
        };
        
        // Then check them in
        checkInAttendee(resetAttendee.nfcTagId);
        setScannedAttendee(resetAttendee);
      }
      
      setScanning(false);
    }, 1500);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear timeouts on unmount
      if (photoTimeoutRef.current) {
        clearTimeout(photoTimeoutRef.current);
      }
      
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      padding: '16px',
      backgroundColor: colors.primary,
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      margin: '0',
      height: '100%'
    }}>
      <h2 style={{ color: colors.textPrimary, marginTop: 0 }}>NFC Scanner</h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '16px 0',
        position: 'relative'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: successScan ? colors.success : scanning ? colors.secondary : scanningActive ? colors.secondary : colors.hover,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
          transition: 'all 0.3s ease',
          animation: successScan ? 'successScan 1.5s forwards' : 
                    scanning ? 'pulse 1.5s infinite' : 
                    scanningActive ? 'activeScanner 2s infinite' : 'none',
          position: 'relative',
          zIndex: 1
        }}>
          {successScan ? (
            <span style={{ 
              color: 'white',
              fontSize: '42px',
              fontWeight: 'normal',
              display: 'inline-block',
              animation: 'checkmarkPop 0.5s forwards',
              fontFamily: 'Arial, sans-serif',
              transform: 'rotate(-5deg)',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              ✓
            </span>
          ) : (
            <span style={{ 
              color: scanning ? 'white' : scanningActive ? 'white' : colors.textPrimary,
              fontWeight: scanning ? 'bold' : 'normal',
              fontSize: '14px'
            }}>
              {scanning ? 'Scanning...' : scanningActive ? 'Ready' : 'Inactive'}
            </span>
          )}
        </div>
        
        
        <div>
          <button 
            onClick={() => {
              if (scanningActive) {
                stopScanning();
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
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {scanningActive ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>
      </div>
      
      {false && (
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
      
      <button
        onClick={handleTestScan}
        disabled={!scanningActive}
        style={{
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '12px 24px',
          fontWeight: 'bold',
          cursor: !scanningActive ? 'not-allowed' : 'pointer',
          opacity: !scanningActive ? 0.6 : 1,
          marginTop: '16px',
          width: '100%',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        Simulate ID Scan (Demo Only)
      </button>
      
      {lastScanned && (
        <div 
          style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginTop: '16px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          className="attendee-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <img 
            src={lastScanned.photoUrl} 
            alt={lastScanned.name}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: `3px solid ${colors.success}`
            }}
          />
          <div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '4px',
              color: colors.textPrimary
            }}>
              {lastScanned.name}
            </div>
            <div style={{ color: colors.textSecondary }}>
              ID: {lastScanned.nfcTagId}
            </div>
            <div style={{ 
              color: colors.success,
              fontWeight: 'bold',
              marginTop: '4px'
            }}>
              ✓ Checked In at {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          {/* Popup that appears on hover */}
          <div 
            style={{
              position: 'absolute',
              top: '-100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              width: '250px',
              pointerEvents: 'none',
              opacity: 0,
              visibility: 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s ease',
              zIndex: 20,
              textAlign: 'center'
            }}
            className="attendee-popup"
          >
            <img 
              src={lastScanned.photoUrl} 
              alt={lastScanned.name}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '50%',
                margin: '0 auto 12px',
                border: `3px solid ${colors.success}`
              }}
            />
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '20px',
              marginBottom: '8px'
            }}>
              {lastScanned.name}
            </div>
            <div style={{ 
              color: colors.textSecondary,
              fontSize: '16px',
              marginBottom: '8px'
            }}>
              ID: {lastScanned.nfcTagId}
            </div>
            <div style={{ 
              color: colors.success,
              fontWeight: 'bold'
            }}>
              Attendee Verified
            </div>
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .attendee-card:hover .attendee-popup {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
      
      {false && error && (
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