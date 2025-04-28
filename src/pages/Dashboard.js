import React, { useContext } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import TotalView from '../components/TotalView';
import NFCScanner from '../components/NFCScanner';
import AppHeader from '../components/AppHeader';


const Dashboard = () => {
  const { loading, getStats } = useContext(AttendanceContext);
  const stats = getStats();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <AppHeader stats={stats} />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ 
          flex: '1 1 600px',
          minWidth: '0'
        }}>
          <TotalView />
        </div>
        <div style={{ 
          flex: '0 1 350px',
          minWidth: '300px'
        }}>
          <NFCScanner />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;