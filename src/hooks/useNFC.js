import { useState, useEffect } from 'react';
import { scanNFCTag } from '../services/nfcService';

export const useNFC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTag, setLastScannedTag] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  // Check if NFC is supported
  useEffect(() => {
    setIsSupported('NDEFReader' in window);
  }, []);

  const startScanning = async () => {
    if (!isSupported) {
      setError('NFC is not supported on this device');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      
      // Listen for NFC tags
      const nfcTagId = await scanNFCTag();
      setLastScannedTag(nfcTagId);
      
      return nfcTagId;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    // In a real implementation, this would cancel any ongoing scan
    setIsScanning(false);
  };

  return {
    isScanning,
    lastScannedTag,
    error,
    isSupported,
    startScanning,
    stopScanning
  };
};

export default useNFC;