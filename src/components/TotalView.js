import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import StatusIndicator from './StatusIndicator';
import AttendanceCard from './AttendanceCard';
import { colors } from '../assets/styles/colors';

const TotalView = () => {
  const { attendees, getStats, resetAttendance } = useContext(AttendanceContext);
  const [filter, setFilter] = useState('all'); // 'all', 'present', 'absent'
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [exporting, setExporting] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true); // Controls the collapse state
  const stats = getStats();
  
  const exportAndResetEvent = () => {
    if (!eventName.trim()) {
      alert('Please enter an event name');
      return;
    }
    
    setExporting(true);
    
    // Create CSV content
    const headers = ['Name', 'Status', 'Check-in Time', 'Notes'];
    const now = new Date().toLocaleString();
    const csvContent = [
      `Event: ${eventName}`,
      `Exported: ${now}`,
      `Present: ${stats.present} / Total: ${stats.total} (${stats.rate}%)`,
      '',
      headers.join(','),
      ...attendees.map(attendee => {
        const status = attendee.present ? 'Present' : 'Absent';
        // Format the date if it exists, otherwise use N/A
        let time = 'N/A';
        if (attendee.present && attendee.checkInTime) {
          if (attendee.checkInTime instanceof Date) {
            time = attendee.checkInTime.toLocaleString();
          } else {
            time = String(attendee.checkInTime);
          }
        }
        const notes = attendee.notes || '';
        return `"${attendee.name}","${status}","${time}","${notes}"`;
      })
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset attendance data
    resetAttendance();
    
    // Close modal and reset state
    setTimeout(() => {
      setExportModalOpen(false);
      setEventName('');
      setExporting(false);
    }, 1000);
  };
  
  const filteredAttendees = attendees.filter(attendee => {
    if (filter === 'all') return true;
    if (filter === 'present') return attendee.present;
    if (filter === 'absent') return !attendee.present;
    return true;
  });
  
  return (
    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setExportModalOpen(true)} 
            style={{
              backgroundColor: colors.error,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '500'
            }}
          >
End & Export Event
          </button>
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
      </div>
      
      {/* Grid View */}
      <div style={{ padding: '16px 16px 0' }}>
        <h3 style={{ margin: '0 0 16px 0', color: colors.textPrimary, fontWeight: '500' }}>
          Attendance Grid
        </h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '16px',
        padding: '0 16px 16px'
      }}>
        {filteredAttendees.map(attendee => (
          <div key={attendee.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px',
            border: `2px solid ${attendee.present ? colors.success : colors.error}`,
            backgroundColor: attendee.present ? 'rgba(46, 204, 113, 0.05)' : 'rgba(231, 76, 60, 0.05)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: '#ddd',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '8px',
              overflow: 'hidden',
              border: `2px solid ${attendee.present ? colors.success : colors.error}`
            }}>
              {attendee.photoUrl ? (
                <img 
                  src={attendee.photoUrl} 
                  alt={attendee.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#555'
                }}>
                  {attendee.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: colors.textPrimary
            }}>
              {attendee.name.split(' ')[1]}
            </div>
            <div style={{ marginTop: '4px' }}>
              <StatusIndicator isPresent={attendee.present} />
            </div>
          </div>
        ))}
      </div>
      
      {/* List View (now below the grid) */}
      <div style={{ 
        width: '100%',
        marginTop: '16px',
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease'
      }}>
        <div 
          style={{ 
            padding: '16px',
            borderBottom: detailsExpanded ? `1px solid ${colors.border}` : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setDetailsExpanded(!detailsExpanded)}
        >
          <h3 style={{ margin: 0, color: colors.textPrimary, fontWeight: '500' }}>
            Attendee Details
          </h3>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: detailsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: colors.textSecondary
          }}>
            ▼
          </div>
        </div>
        
        {detailsExpanded && (
          <div style={{
            maxHeight: 'calc(100vh - 380px)', 
            overflowY: 'auto',
            width: '100%',
            padding: '16px 0'
          }}>
            {filteredAttendees.length === 0 ? (
              <div style={{ padding: '0 16px 16px', textAlign: 'center', color: colors.textSecondary }}>
                No attendees found with the selected filter.
              </div>
            ) : (
              filteredAttendees.map(attendee => (
                <AttendanceCard key={attendee.id} attendee={attendee} />
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Export Modal */}
      {exportModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: colors.textPrimary }}>End Event & Export Data</h3>
            <div style={{ 
              margin: '0 0 16px', 
              padding: '12px', 
              backgroundColor: 'rgba(231, 76, 60, 0.1)', 
              borderLeft: `4px solid ${colors.error}`,
              borderRadius: '4px'
            }}>
              <p style={{ margin: '0 0 8px', color: colors.textPrimary, fontWeight: '500' }}>
                Important
              </p>
              <p style={{ margin: '0', color: colors.textSecondary }}>
                This will export current attendance data and <strong>reset all attendance records</strong>. 
                Make sure you've completed all check-ins before proceeding.
              </p>
            </div>
            <p style={{ margin: '0 0 16px', color: colors.textSecondary }}>
              Enter a name for this event to save with the exported data:
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="eventName" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: colors.textPrimary,
                fontWeight: '500'
              }}>
                Event Name:
              </label>
              <input
                id="eventName"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setExportModalOpen(false);
                  setEventName('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: colors.textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={exportAndResetEvent}
                disabled={exporting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: exporting ? '#999' : colors.error,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: exporting ? 'default' : 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {exporting ? 'Processing...' : (
                  <>
End & Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalView;