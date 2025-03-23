import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  People,
  ConfirmationNumber,
  TrendingUp,
} from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import { Link } from 'react-router-dom';

interface AdminEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  availableTickets: number;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface Booking {
  id: string;
  eventId: string;
  userId: string;
  eventName: string;
  userName: string;
  date: string;
  time: string;
  tickets: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
}

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadData = () => {
    try {
      // Load events
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        console.log('Loaded events:', parsedEvents); // Debug log
        setEvents(Array.isArray(parsedEvents) ? parsedEvents : []);
      }

      // Load bookings
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const parsedBookings = JSON.parse(storedBookings);
        console.log('Loaded bookings:', parsedBookings); // Debug log
        setBookings(Array.isArray(parsedBookings) ? parsedBookings : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Add event listener for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'events' || e.key === 'bookings') {
        console.log('Storage changed:', e.key); // Debug log
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also add interval to check for changes
    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const deleteEvent = (eventId: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== eventId);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);

      // Also delete associated bookings
      const updatedBookings = bookings.filter(booking => booking.eventId !== eventId);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);

      // Force reload data
      loadData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/admin/create-event"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                },
              }}
            >
              Create New Event
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Events Overview
              </Typography>
              {events.length === 0 ? (
                <Typography color="textSecondary">
                  No events created yet. Click "Create New Event" to add one.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Available Tickets</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.time}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>{event.capacity}</TableCell>
                          <TableCell>{event.availableTickets}</TableCell>
                          <TableCell>{event.category}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              component={Link}
                              to={`/events/${event.id}`}
                              sx={{ mr: 1 }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => deleteEvent(event.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h3">{events.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h3">{bookings.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h3">
                {bookings.reduce((total, booking) => total + booking.totalPrice, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <EventIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{events.length}</Typography>
            <Typography variant="subtitle1">Total Events</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <People sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">
              {new Set(bookings.map(booking => booking.userId)).size}
            </Typography>
            <Typography variant="subtitle1">Active Users</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <ConfirmationNumber sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{bookings.length}</Typography>
            <Typography variant="subtitle1">Total Bookings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
              color: 'white',
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">
              {bookings.reduce((total, booking) => total + booking.tickets, 0)}
            </Typography>
            <Typography variant="subtitle1">Tickets Sold</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bookings Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Recent Bookings</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.eventName}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>₹{booking.totalPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status) as any}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 