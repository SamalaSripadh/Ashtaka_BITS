import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

interface QRScannerProps {
  onScanSuccess?: (data: any) => void;
}

const styles = {
  qrScannerContainer: {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  scannerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  scanToggleBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#5a6268'
    },
    '&.active': {
      backgroundColor: '#28a745'
    }
  },
  scannerView: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto'
  },
  scannerPaused: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  scannerError: {
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    border: '1px solid #f5c6cb'
  }
};

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    const success = async (decodedText: string) => {
      try {
        const response = await fetch(`${API_URL}/api/bookings/check-in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ qrCode: decodedText })
        });

        const result = await response.json();

        if (response.ok) {
          toast.success('Check-in successful!');
          if (onScanSuccess) {
            onScanSuccess(result.data);
          }
        } else {
          toast.error(result.message || 'Check-in failed');
        }
      } catch (err) {
        toast.error('Error processing check-in');
      }
    };

    const errorHandler = (errorMessage: string) => {
      setError(errorMessage);
    };

    if (scanning) {
      scanner.render(success, errorHandler);
    } else {
      scanner.clear();
    }

    return () => {
      scanner.clear();
    };
  }, [scanning, onScanSuccess]);

  return (
    <div style={styles.qrScannerContainer}>
      <div style={styles.scannerHeader}>
        <h2>Scan QR Code for Check-in</h2>
        <button 
          style={{
            ...styles.scanToggleBtn,
            backgroundColor: scanning ? '#28a745' : '#6c757d'
          }}
          onClick={() => setScanning(!scanning)}
        >
          {scanning ? 'Pause Scanning' : 'Resume Scanning'}
        </button>
      </div>

      <div style={styles.scannerView}>
        {scanning ? (
          <div id="reader"></div>
        ) : (
          <div style={styles.scannerPaused}>
            <p>Scanner paused</p>
          </div>
        )}
      </div>

      {error && (
        <div style={styles.scannerError}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner; 