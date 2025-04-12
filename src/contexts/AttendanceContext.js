import React, { createContext, useState, useEffect } from 'react';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize with 200 attendees
  useEffect(() => {
    // First names and last names to generate realistic attendee names
    const firstNames = [
      "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", 
      "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
      "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
      "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley",
      "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
      "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
      "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon",
      "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
      "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
      "Larry", "Pamela", "Justin", "Nicole", "Scott", "Ruth", "Brandon", "Katherine"
    ];
    
    const lastNames = [
      "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
      "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
      "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
      "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez",
      "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
      "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans",
      "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook",
      "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox",
      "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson",
      "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross"
    ];
    
    // Generate a random CN ID number
    const generateCNID = () => {
      const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
      return `CN${randomNum}`;
    };
    
    // Generate a random full name
    const generateName = () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };
    
    // In a real app, this would come from an API or database
    const initialAttendees = Array(200).fill().map((_, index) => ({
      id: index + 1,
      nfcTagId: generateCNID(),
      name: generateName(),
      present: false,
      checkInTime: null,
      photoUrl: `https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${(index % 70) + 1}.jpg`
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