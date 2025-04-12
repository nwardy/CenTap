import React, { useState } from 'react';
import { colors } from '../assets/styles/colors';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    automaticScanning: true,
    scanInterval: 3,
    notifyAbsent: true,
    exportFormat: 'csv',
    autoCheckout: false,
    checkoutTime: '17:00',
    showLastScanned: true,
    theme: 'white-blue',
    compactView: false,
    saveReports: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would save settings to local storage or a database
    alert('Settings saved successfully!');
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ color: colors.textPrimary, marginBottom: '24px' }}>Settings</h1>
      
      <div style={{
        backgroundColor: colors.primary,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: colors.textPrimary, fontSize: '18px', marginBottom: '16px' }}>
          NFC Scanner Settings
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="automaticScanning"
              checked={settings.automaticScanning}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Enable automatic scanning
          </label>
          <p style={{ margin: '4px 0 0 24px', fontSize: '14px', color: colors.textSecondary }}>
            Automatically scan for new NFC tags
          </p>
        </div>
        
        {settings.automaticScanning && (
          <div style={{ marginBottom: '16px', marginLeft: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Scan interval (seconds):
            </label>
            <input
              type="number"
              name="scanInterval"
              value={settings.scanInterval}
              onChange={handleChange}
              min="1"
              max="10"
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                width: '80px'
              }}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="notifyAbsent"
              checked={settings.notifyAbsent}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Notify when attendees are absent
          </label>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="autoCheckout"
              checked={settings.autoCheckout}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Auto checkout at specified time
          </label>
          
          {settings.autoCheckout && (
            <div style={{ marginLeft: '24px', marginTop: '8px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Checkout time:
              </label>
              <input
                type="time"
                name="checkoutTime"
                value={settings.checkoutTime}
                onChange={handleChange}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div style={{
        backgroundColor: colors.primary,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: colors.textPrimary, fontSize: '18px', marginBottom: '16px' }}>
          Display Settings
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="showLastScanned"
              checked={settings.showLastScanned}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Show last scanned attendee
          </label>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Theme:
          </label>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${colors.border}`,
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <option value="white-blue">White with Blue accents (Default)</option>
            <option value="dark-blue">Dark with Blue accents</option>
            <option value="white-green">White with Green accents</option>
            <option value="white-purple">White with Purple accents</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="compactView"
              checked={settings.compactView}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Use compact view for attendee list
          </label>
        </div>
      </div>
      
      <div style={{
        backgroundColor: colors.primary,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: colors.textPrimary, fontSize: '18px', marginBottom: '16px' }}>
          Export Settings
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Default export format:
          </label>
          <select
            name="exportFormat"
            value={settings.exportFormat}
            onChange={handleChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${colors.border}`,
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="pdf">PDF</option>
            <option value="json">JSON</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="saveReports"
              checked={settings.saveReports}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Automatically save daily reports
          </label>
        </div>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: colors.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;