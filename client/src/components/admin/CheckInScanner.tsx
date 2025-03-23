import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

interface CheckInData {
  bookingReference: string;
  bookerName: string;
  eventName: string;
  checkInTime: string;
  ticketCount: number;
}

const styles = {
  scannerContainer: {
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  recentScans: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  scanItem: {
    borderLeft: '4px solid #4caf50',
    marginBottom: '10px',
    backgroundColor: '#f8f9fa'
  },
  scannerView: {
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    '& video': {
      width: '100%',
      borderRadius: '8px'
    }
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px'
  }
};

const CheckInScanner: React.FC = () => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<CheckInData[]>([]);
  const [scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    // Initialize scanner
    const newScanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      },
      false
    );

    setScanner(newScanner);

    // Start scanning
    if (scanning) {
      newScanner.render(handleScanSuccess, handleScanError);
    }

    // Cleanup
    return () => {
      if (newScanner) {
        newScanner.clear();
      }
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    try {
      // Parse the QR code data
      const qrData = JSON.parse(decodedText);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`${API_URL}/api/bookings/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ qrCode: decodedText })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Check-in successful!');
        setRecentScans(prev => [data.data, ...prev].slice(0, 10)); // Keep last 10 scans
        setError(null);
      } else {
        toast.error(data.message || 'Check-in failed');
        setError(data.message || 'Check-in failed');
      }
    } catch (err) {
      console.error('Check-in error:', err);
      toast.error('Failed to process check-in');
      setError('Failed to process check-in');
    }
  };

  const handleScanError = (error: string) => {
    // Only show errors that aren't related to normal scanning process
    if (!error.includes('NotFound')) {
      setError(error);
    }
  };

  const toggleScanning = () => {
    if (scanning) {
      scanner?.stop();
    } else {
      scanner?.resume();
    }
    setScanning(!scanning);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Event Check-In Scanner
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Scan QR Code
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            maxWidth: 500, 
            mx: 'auto',
            '& #reader': {
              width: '100% !important'
            },
            '& #reader__scan_region': {
              minHeight: '300px !important'
            },
            '& #reader__camera_selection': {
              display: 'none'
            }
          }}>
            <div id="reader"></div>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color={scanning ? "error" : "primary"}
              onClick={toggleScanning}
              sx={{ minWidth: 200 }}
            >
              {scanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Check-ins
          </Typography>
          
          {recentScans.length > 0 ? (
            <List>
              {recentScans.map((scan, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {scan.bookerName} - {scan.eventName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Booking Reference: {scan.bookingReference}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Check-in Time: {new Date(scan.checkInTime).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tickets: {scan.ticketCount}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentScans.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No recent check-ins
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckInScanner; 