import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

interface EventBookingProps {
  event: {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    ticketPrice: number;
    availableTickets: number;
  };
}

const EventBooking: React.FC<EventBookingProps> = ({ event }) => {
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBooking = async () => {
    try {
      if (!user) {
        toast.error('Please log in to book tickets');
        navigate('/login');
        return;
      }

      // Validate number of tickets
      if (tickets < 1 || tickets > event.availableTickets) {
        toast.error('Invalid number of tickets');
        return;
      }

      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create booking through API
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          event: event._id,
          ticketCount: tickets,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const data = await response.json();
      console.log('Booking created:', data);

      toast.success('Booking confirmed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Book Event
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">{event.title}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Date: {event.date}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Time: {event.time}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">
                Location: {event.location}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" color="primary">
                Price per ticket: ₹{event.ticketPrice}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" color={event.availableTickets < 10 ? 'error' : 'inherit'}>
                Available tickets: {event.availableTickets}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Tickets"
                type="number"
                value={tickets}
                onChange={(e) => setTickets(Math.max(1, Math.min(parseInt(e.target.value) || 1, event.availableTickets)))}
                inputProps={{
                  min: 1,
                  max: event.availableTickets,
                }}
                helperText={`Total Price: ₹${(event.ticketPrice * tickets).toFixed(2)}`}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBooking}
                disabled={loading || tickets < 1 || tickets > event.availableTickets}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventBooking; 