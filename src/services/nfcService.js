// Check if NFC is supported and polyfill if necessary
const hasNFC = typeof window !== 'undefined' && 'NDEFReader' in window;

export const scanNFCTag = async () => {
  try {
    if (hasNFC) {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      
      return new Promise((resolve) => {
        ndef.onreading = ({ message }) => {
          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const nfcTagId = textDecoder.decode(record.data);
              resolve(nfcTagId);
            }
          }
        };
      });
    } else {
      console.log('NFC not supported, using simulation mode');
      // Simulate an NFC tag reading for demo purposes
      return Promise.resolve(simulateScan());
    }
  } catch (error) {
    console.error('Error scanning NFC tag:', error);
    // Fall back to simulation in case of error
    return simulateScan();
  }
};

export const writeNFCTag = async (tagId) => {
  try {
    if (hasNFC) {
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{
          recordType: "text",
          data: tagId
        }]
      });
      return true;
    } else {
      console.log('NFC not supported, simulating write');
      return true; // Simulate successful write
    }
  } catch (error) {
    console.error('Error writing to NFC tag:', error);
    throw error;
  }
};

// This is a mock function for demo purposes
export const simulateScan = () => {
  // Generate a random tag ID between 1 and 200
  const randomId = Math.floor(Math.random() * 200) + 1;
  return `nfc-${randomId}`;
};