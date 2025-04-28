import React, { useState, useContext, useEffect, useRef } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import { scanNFCTag } from '../services/nfcService';
import { colors } from '../assets/styles/colors';

const NFCScanner = () => {
  const { checkInAttendee, attendees, findAttendeesByName, manualCheckIn } = useContext(AttendanceContext);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [error, setError] = useState(null);
  const [scanningActive, setScanningActive] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [successScan, setSuccessScan] = useState(false);
  const photoTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);
  
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const startScanning = () => {
    try {
      setScanning(false);
      setError(null);
      setScanningActive(true);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const stopScanning = () => {
    setScanningActive(false);
    setScanning(false);
  };

  const setScannedAttendee = (attendee) => {
    setLastScanned(attendee);
    setShowPhoto(false);
    
    setSuccessScan(true);
    
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    
    successTimeoutRef.current = setTimeout(() => {
      setSuccessScan(false);
    }, 1500);
  };
  
  const handleTestScan = () => {
    if (!scanningActive) return;
    
    setScanning(true);
    
    setTimeout(() => {
      const availableAttendees = attendees.filter(a => !a.present);
      
      if (availableAttendees.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableAttendees.length);
        const randomAttendee = availableAttendees[randomIndex];
        
        checkInAttendee(randomAttendee.nfcTagId);
        setScannedAttendee(randomAttendee);
      } else {
        const randomIndex = Math.floor(Math.random() * attendees.length);
        const resetAttendee = {
          ...attendees[randomIndex],
          present: false,
          checkInTime: null
        };
        
        checkInAttendee(resetAttendee.nfcTagId);
        setScannedAttendee(resetAttendee);
      }
      
      setScanning(false);
    }, 1500);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }
    
    const results = findAttendeesByName(searchQuery);
    setSearchResults(results);
    setSearchPerformed(true);
  };
  
  const handleManualCheckIn = (attendeeId) => {
    const checkedInAttendee = manualCheckIn(attendeeId);
    if (checkedInAttendee) {
      setLastScanned(checkedInAttendee);
      setSuccessScan(true);
      
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setSuccessScan(false);
      }, 1500);
      
      setSearchQuery('');
      setSearchResults([]);
      setSearchPerformed(false);
      setShowManualEntry(false);
    }
  };
  
  useEffect(() => {
    return () => {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: colors.textPrimary, marginTop: 0, marginBottom: 0 }}>NFC Scanner</h2>
        
        {/* Simulate Scan Button (Orange Circle) */}
        <button
          onClick={handleTestScan}
          disabled={!scanningActive}
          title="Simulate ID Scan"
          style={{
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !scanningActive ? 'not-allowed' : 'pointer',
            opacity: !scanningActive ? 0.6 : 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ⚡
        </button>
      </div>
      
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
      
      <div style={{ marginTop: '16px', width: '100%' }}>
        <button
          onClick={() => setShowManualEntry(!showManualEntry)}
          style={{
            backgroundColor: colors.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {showManualEntry ? 'Cancel Manual Entry' : 'Manual Entry'}
        </button>
      </div>
      
      {/* Manual Entry Section */}
      {showManualEntry && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: colors.hover,
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: colors.textPrimary }}>
            Manual Check-in
          </h3>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter attendee name"
              style={{
                flex: '1',
                padding: '8px 12px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                fontSize: '14px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: colors.secondary,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
          
          {/* Search Results */}
          {searchPerformed && (
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: searchResults.length ? `1px solid ${colors.border}` : 'none'
            }}>
              {searchResults.length === 0 ? (
                <div style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  color: colors.textSecondary 
                }}>
                  No attendees found with that name
                </div>
              ) : (
                searchResults.map(attendee => (
                  <div 
                    key={attendee.id}
                    style={{
                      padding: '12px',
                      borderBottom: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: attendee.present ? 'default' : 'pointer',
                      backgroundColor: attendee.present ? 'rgba(52, 168, 83, 0.05)' : 'white'
                    }}
                    onClick={() => !attendee.present && handleManualCheckIn(attendee.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={attendee.photoUrl} 
                        alt={attendee.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <div style={{ 
                          fontWeight: '500',
                          color: colors.textPrimary
                        }}>
                          {attendee.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px',
                          color: colors.textSecondary 
                        }}>
                          ID: {attendee.nfcTagId}
                        </div>
                      </div>
                    </div>
                    
                    {attendee.present ? (
                      <div style={{ 
                        color: colors.success,
                        fontWeight: '500',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ fontSize: '16px' }}>✓</span> Present
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManualCheckIn(attendee.id);
                        }}
                        style={{
                          backgroundColor: colors.secondary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Check In
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
      
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