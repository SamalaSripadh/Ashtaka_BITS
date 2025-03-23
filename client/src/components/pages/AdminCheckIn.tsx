import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../admin/QRScanner';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

interface CheckInData {
  bookingReference: string;
  bookerName: string;
  eventName: string;
  checkInTime: string;
}

const styles = {
  adminCheckIn: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  backBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#5a6268'
    }
  },
  scannerSection: {
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  recentCheckIns: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  checkInsList: {
    marginTop: '1rem'
  },
  checkInItem: {
    padding: '1rem',
    borderBottom: '1px solid #dee2e6',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  checkInDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  noCheckIns: {
    textAlign: 'center' as const,
    color: '#6c757d',
    padding: '2rem'
  }
};

const AdminCheckIn = () => {
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInData[]>([]);
  const navigate = useNavigate();

  const handleScanSuccess = (data: CheckInData) => {
    setRecentCheckIns(prev => [data, ...prev].slice(0, 10)); // Keep last 10 check-ins
  };

  return (
    <div style={styles.adminCheckIn}>
      <div style={styles.header}>
        <h1>Event Check-In</h1>
        <button 
          style={styles.backBtn}
          onClick={() => navigate('/admin/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={styles.scannerSection}>
        <QRScanner onScanSuccess={handleScanSuccess} />
      </div>

      <div style={styles.recentCheckIns}>
        <h2>Recent Check-Ins</h2>
        <div style={styles.checkInsList}>
          {recentCheckIns.map((checkIn, index) => (
            <div key={index} style={styles.checkInItem}>
              <div style={styles.checkInDetails}>
                <p><strong>Booking Ref:</strong> {checkIn.bookingReference}</p>
                <p><strong>Name:</strong> {checkIn.bookerName}</p>
                <p><strong>Event:</strong> {checkIn.eventName}</p>
                <p><strong>Time:</strong> {new Date(checkIn.checkInTime).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {recentCheckIns.length === 0 && (
            <p style={styles.noCheckIns}>No recent check-ins</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCheckIn; 