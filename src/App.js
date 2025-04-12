import React from 'react';
import { AttendanceProvider } from './contexts/AttendanceContext';
import Dashboard from './pages/Dashboard';
import './assets/styles/global.css';

const App = () => {
  return (
    <AttendanceProvider>
      <div className="app">
        <Dashboard />
      </div>
    </AttendanceProvider>
  );
};

export default App;