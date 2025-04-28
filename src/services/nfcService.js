//Our NFC service that handles all tag scanning operations

export const isNFCSupported = () => {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
};
export const formatTagId = (rawTagId) => {
  const cleanTagId = String(rawTagId).replace(/[^a-zA-Z0-9]/g, '');
  
  if (cleanTagId.startsWith('nfc-')) {
    return cleanTagId;
  }
  
  return `nfc-${cleanTagId}`;
};

export const scanNFCTag = async () => {
  try {
    if (isNFCSupported()) {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      
      return new Promise((resolve) => {
        ndef.onreading = ({ message }) => {
          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const nfcTagId = textDecoder.decode(record.data);
              resolve(formatTagId(nfcTagId));
            }
          }
        };
      });
    } else {
      console.log('NFC not supported, using simulation mode');
      return Promise.resolve(simulateScan());
    }
  } catch (error) {
    console.error('Error scanning NFC tag:', error);
    return simulateScan();
  }
};

export const simulateScan = () => {
  const randomId = Math.floor(Math.random() * 200) + 1;
  return `nfc-${randomId}`;
};

export const getNFCErrorMessage = (error) => {
  if (!error) return 'Unknown error';
  
  switch (error.name) {
    case 'NotAllowedError':
      return 'Permission to use NFC was denied';
    case 'NotSupportedError':
      return 'NFC is not supported on this device';
    case 'TimeoutError':
      return 'The NFC operation timed out';
    case 'AbortError':
      return 'The NFC operation was aborted';
    default:
      return error.message || 'An unknown NFC error occurred';
  }
};