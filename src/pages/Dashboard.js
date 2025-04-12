import React, { useContext, useState } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';
import AttendanceList from '../components/AttendanceList';
import TotalView from '../components/TotalView';
import NFCScanner from '../components/NFCScanner';
import AppHeader from '../components/AppHeader';
import { colors } from '../assets/styles/colors';

const Dashboard = () => {
  const { loading, getStats } = useContext(AttendanceContext);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const stats = getStats();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <AppHeader stats={stats} viewMode={viewMode} setViewMode={setViewMode} />
      
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {viewMode === 'list' ? <AttendanceList /> : <TotalView />}
        </div>
        <div style={{ width: '350px' }}>
          <NFCScanner />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;