// Format tag ID to a consistent format
export const formatTagId = (rawTagId) => {
    // Remove any non-alphanumeric characters
    const cleanTagId = rawTagId.replace(/[^a-zA-Z0-9]/g, '');
    
    // If the tag starts with 'nfc-', return as is
    if (cleanTagId.startsWith('nfc-')) {
      return cleanTagId;
    }
    
    // Otherwise, prepend 'nfc-'
    return `nfc-${cleanTagId}`;
  };
  
  // Validate if a tag ID is in the correct format
  export const isValidTagId = (tagId) => {
    // Tag ID should start with 'nfc-' followed by a number
    const pattern = /^nfc-\d+$/;
    return pattern.test(tagId);
  };
  
  // Check if browser supports NFC
  export const isNFCSupported = () => {
    return 'NDEFReader' in window;
  };
  
  // Get error message for NFC errors
  export const getNFCErrorMessage = (error) => {
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