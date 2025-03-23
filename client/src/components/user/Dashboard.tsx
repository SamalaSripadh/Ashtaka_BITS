import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  CircularProgress,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Event,
  QrCode,
  AccessTime,
  LocationOn,
  CalendarMonth,
  EventSeat,
  QrCode2 as QrCodeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

interface Booking {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    ticketPrice: number;
  };
  ticketCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  qrCodeImage: string;
  bookingReference: string;
}

const UserDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<{ image: string; reference: string } | null>(null);

  const loadBookings = async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/bookings/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.data);

      // Fetch user name
      const userResponse = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await userResponse.json();
      localStorage.setItem('userName', userData.data.name);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on component mount and when user changes
  useEffect(() => {
    loadBookings();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleShowQR = (qrCodeImage: string, bookingReference: string) => {
    setSelectedQR({ image: qrCodeImage, reference: bookingReference });
  };

  const handleCloseQR = () => {
    setSelectedQR(null);
  };

  const handleDownloadQR = () => {
    if (selectedQR) {
      const link = document.createElement('a');
      link.href = selectedQR.image;
      link.download = `ticket-${selectedQR.reference}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Please log in to view your dashboard
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: { xs: 3, md: 6 },
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(https://freshproductions.co.uk/wp-content/uploads/2019/11/fresh-events-1.jpg)',
            opacity: 0.1,
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Welcome, {localStorage.getItem('userName') || 'Guest'}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Manage your event bookings and tickets
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/events"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px 0 rgba(0,0,0,0.3)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Browse Events
          </Button>
        </Box>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CalendarMonth sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {bookings.length}
              </Typography>
              <Typography variant="subtitle1">Upcoming Events</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <EventSeat sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {bookings.reduce((acc, booking) => acc + booking?.ticketCount || 0, 0)}
              </Typography>
              <Typography variant="subtitle1">Total Tickets</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bookings Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Your Bookings
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Bookings Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start exploring events and book your tickets today!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/events"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Browse Events
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h6" gutterBottom>
                  My Bookings
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Tickets</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>QR Code</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>{booking.event.title}</TableCell>
                          <TableCell>{booking.event.date}</TableCell>
                          <TableCell>{booking.event.time}</TableCell>
                          <TableCell>{booking.ticketCount}</TableCell>
                          <TableCell>₹{booking.totalAmount}</TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              color={getStatusColor(booking.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<QrCodeIcon />}
                              onClick={() => handleShowQR(booking.qrCodeImage, booking.bookingReference)}
                            >
                              View Ticket
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* QR Code Dialog */}
      <Dialog open={!!selectedQR} onClose={handleCloseQR}>
        <DialogTitle>Your Ticket QR Code</DialogTitle>
        <DialogContent>
          {selectedQR && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <img 
                src={selectedQR.image} 
                alt="Ticket QR Code"
                style={{ width: '200px', height: '200px' }}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Booking Reference: {selectedQR.reference}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Show this QR code at the event entrance
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQR}>Close</Button>
          <Button onClick={handleDownloadQR} variant="contained" color="primary">
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard; 