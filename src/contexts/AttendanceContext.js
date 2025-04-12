import React, { createContext, useState, useEffect } from 'react';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize with 200 attendees
  useEffect(() => {
    // In a real app, this would come from an API or database
    const initialAttendees = Array(200).fill().map((_, index) => ({
      id: index + 1,
      nfcTagId: `nfc-${index + 1}`,
      name: `Attendee ${index + 1}`,
      present: false,
      checkInTime: null
    }));
    
    setAttendees(initialAttendees);
    setLoading(false);
  }, []);

  // Check in an attendee using NFC tag ID
  const checkInAttendee = (nfcTagId) => {
    setAttendees(prev => prev.map(attendee => 
      attendee.nfcTagId === nfcTagId 
        ? { ...attendee, present: true, checkInTime: new Date() } 
        : attendee
    ));
  };

  // Get statistics
  const getStats = () => {
    const totalAttendees = attendees.length;
    const presentAttendees = attendees.filter(a => a.present).length;
    const absentAttendees = totalAttendees - presentAttendees;
    const attendanceRate = totalAttendees ? (presentAttendees / totalAttendees) * 100 : 0;
    
    return {
      total: totalAttendees,
      present: presentAttendees,
      absent: absentAttendees,
      rate: attendanceRate.toFixed(1)
    };
  };

  return (
    <AttendanceContext.Provider value={{
      attendees,
      loading,
      checkInAttendee,
      getStats
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};