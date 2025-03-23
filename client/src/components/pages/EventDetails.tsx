import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { EventAvailable, LocationOn, AttachMoney, Person } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  ticketPrice: number;
  capacity: number;
  availableTickets: number;
  image: string;
  eventType: string;
}

interface Attendee {
  name: string;
  email: string;
  phone: string;
}

interface FormValues {
  ticketCount: number;
  attendees: Attendee[];
  paymentMethod: string;
  bookerName: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const [openBooking, setOpenBooking] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/events/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event details');
      }

      setEvent(data.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Select Tickets', 'Attendee Details', 'Payment & Confirmation'];

  const handleBookingSubmit = async (values: FormValues) => {
    try {
      if (!event) return;

      // Update available tickets
      const ticketsBooked = values.ticketCount;
      const updatedAvailableTickets = event.availableTickets - ticketsBooked;
      
      // Store updated ticket count in localStorage
      const eventKey = `event_${event._id}`;
      const updatedEvent = {
        ...event,
        availableTickets: updatedAvailableTickets
      };
      localStorage.setItem(eventKey, JSON.stringify(updatedEvent));
      
      setEvent(updatedEvent);

      // Store booking in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        ...event,
        bookingId: Math.random().toString(36).substr(2, 9),
        ticketCount: ticketsBooked,
        status: 'confirmed',
        bookerName: values.bookerName,
        attendees: values.attendees,
        bookingDate: new Date().toISOString(),
      };
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

      setBookingConfirmed(true);
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      ticketCount: 1,
      bookerName: '',
      attendees: [{
        name: '',
        email: '',
        phone: '',
      }],
      paymentMethod: 'card',
    },
    validationSchema: Yup.object({
      ticketCount: Yup.number()
        .required('Number of tickets is required')
        .min(1, 'Must book at least 1 ticket')
        .max(event?.availableTickets || 0, `Maximum ${event?.availableTickets || 0} tickets per booking`),
      bookerName: Yup.string().required('Booker name is required'),
      attendees: Yup.array().of(
        Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          phone: Yup.string().required('Phone number is required'),
        })
      ),
      paymentMethod: Yup.string().required('Payment method is required'),
    }),
    onSubmit: handleBookingSubmit,
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTicketCountChange = (event: any) => {
    const count = event.target.value;
    formik.setFieldValue('ticketCount', count);
    
    // Update attendees array based on ticket count
    const currentAttendees = [...formik.values.attendees];
    if (count > currentAttendees.length) {
      // Add more attendee forms
      for (let i = currentAttendees.length; i < count; i++) {
        currentAttendees.push({ name: '', email: '', phone: '' });
      }
    } else {
      // Remove excess attendee forms
      currentAttendees.splice(count);
    }
    formik.setFieldValue('attendees', currentAttendees);
  };

  const renderStepContent = (step: number) => {
    if (!event) return null;

    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="bookerName"
                  value={formik.values.bookerName}
                  onChange={formik.handleChange}
                  error={formik.touched.bookerName && Boolean(formik.errors.bookerName)}
                  helperText={formik.touched.bookerName && formik.errors.bookerName}
                  variant="outlined"
                  sx={{
                    '& .MuiInputLabel-root': {
                      background: '#fff',
                      px: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel 
                    id="ticket-count-label"
                    sx={{
                      background: '#fff',
                      px: 1,
                    }}
                  >
                    Number of Tickets
                  </InputLabel>
                  <Select
                    labelId="ticket-count-label"
                    value={formik.values.ticketCount}
                    onChange={handleTicketCountChange}
                    error={formik.touched.ticketCount && Boolean(formik.errors.ticketCount)}
                    label="Number of Tickets"
                  >
                    {[...Array(Math.min(10, event.availableTickets))].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Ticket' : 'Tickets'} - ₹{(i + 1) * event.ticketPrice}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'primary.light', 
                  borderRadius: 1,
                  color: 'white'
                }}>
                  <Typography variant="subtitle2">
                    * Each ticket includes:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    • Full conference access
                  </Typography>
                  <Typography variant="body2">
                    • Lunch and refreshments
                  </Typography>
                  <Typography variant="body2">
                    • Workshop materials
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            {formik.values.attendees.map((attendee, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 4,
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  Attendee {index + 1}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name={`attendees.${index}.name`}
                      value={attendee.name}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.attendees?.[index]?.name &&
                        Boolean((formik.errors.attendees?.[index] as any)?.name)
                      }
                      helperText={
                        formik.touched.attendees?.[index]?.name &&
                        (formik.errors.attendees?.[index] as any)?.name
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          background: '#fff',
                          px: 1,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name={`attendees.${index}.email`}
                      value={attendee.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.attendees?.[index]?.email &&
                        Boolean((formik.errors.attendees?.[index] as any)?.email)
                      }
                      helperText={
                        formik.touched.attendees?.[index]?.email &&
                        (formik.errors.attendees?.[index] as any)?.email
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          background: '#fff',
                          px: 1,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name={`attendees.${index}.phone`}
                      value={attendee.phone}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.attendees?.[index]?.phone &&
                        Boolean((formik.errors.attendees?.[index] as any)?.phone)
                      }
                      helperText={
                        formik.touched.attendees?.[index]?.phone &&
                        (formik.errors.attendees?.[index] as any)?.phone
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          background: '#fff',
                          px: 1,
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Order Summary
            </Typography>
            <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Event
                    </Typography>
                    <Typography variant="subtitle1">
                      {event.title}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="subtitle1">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Number of Tickets
                    </Typography>
                    <Typography variant="subtitle1">
                      {formik.values.ticketCount}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{formik.values.ticketCount * event.ticketPrice}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel 
                  id="payment-method-label"
                  sx={{
                    background: '#fff',
                    px: 1,
                  }}
                >
                  Select Payment Method
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                  name="paymentMethod"
                  label="Select Payment Method"
                >
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderBookingConfirmation = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom color="primary">
        Booking Confirmed!
      </Typography>
      <Typography variant="body1" paragraph>
        Thank you for your booking. A confirmation email has been sent to your email address.
      </Typography>
      <Alert severity="success" sx={{ mb: 3 }}>
        Booking Reference: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </Alert>
      <Button
        variant="contained"
        onClick={() => {
          setOpenBooking(false);
          setBookingConfirmed(false);
          setActiveStep(0);
        }}
      >
        Close
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ my: 4 }}>
          Event not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Event Image */}
        <Grid item xs={12}>
          <Box
            component="img"
            src={event.image || 'https://freshproductions.co.uk/wp-content/uploads/2019/11/fresh-events-1.jpg'}
            alt={event.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = 'https://freshproductions.co.uk/wp-content/uploads/2019/11/fresh-events-1.jpg';
            }}
            sx={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </Grid>

        {/* Event Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            {event.title}
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventAvailable sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{event.location}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">₹{event.ticketPrice}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Booking Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Book Your Tickets
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography color="text.secondary" gutterBottom>
                Available Tickets
              </Typography>
              <Typography variant="h6" color="primary.main">
                {event.availableTickets} / {event.capacity}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => setOpenBooking(true)}
            >
              Book Now
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              * Tickets are non-refundable
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog
        open={openBooking}
        onClose={() => !bookingConfirmed && setOpenBooking(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {bookingConfirmed ? 'Booking Confirmation' : 'Book Event Tickets'}
        </DialogTitle>
        <DialogContent>
          {bookingConfirmed ? (
            renderBookingConfirmation()
          ) : (
            <>
              <Stepper activeStep={activeStep} sx={{ py: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderStepContent(activeStep)}
            </>
          )}
        </DialogContent>
        {!bookingConfirmed && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
            {activeStep > 0 && (
              <Button onClick={handleBack}>Back</Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};

export default EventDetails; 