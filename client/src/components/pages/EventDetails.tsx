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
import { EventAvailable, LocationOn, AttachMoney, Person, QrCode } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';
import { QRCodeSVG } from 'qrcode.react';

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

interface BookingResponse {
  success: boolean;
  message?: string;
  data: {
    qrCode: {
      id: string;
      e: string;
      t: number;
      ts: number;
    };
    qrCodeImage: string;
    bookingReference: string;
    // ... other booking fields
  };
}

const styles = {
  bookingSuccess: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center' as const
  },
  ticketDetails: {
    marginTop: '1rem'
  },
  qrCodeContainer: {
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem'
  },
  downloadTicketBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  }
};

const EventDetails = () => {
  const { id } = useParams();
  const [openBooking, setOpenBooking] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [bookingData, setBookingData] = useState<BookingResponse['data'] | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.role === 'admin');
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      if (!id) {
        throw new Error('Event ID is missing');
      }

      setLoading(true);
      const response = await fetch(`${API_URL}/api/events/${id}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch event details');
      }

      const data = await response.json();
      if (!data.data) {
        throw new Error('Event not found');
      }

      setEvent(data.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Select Tickets', 'Attendee Details', 'Payment & Confirmation'];

  const handleBookingSubmit = async (values: FormValues) => {
    try {
      if (!event) return;

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book tickets');
        return;
      }

      const bookingData = {
        event: event._id,
        ticketCount: values.ticketCount,
        totalAmount: values.ticketCount * event.ticketPrice,
        attendees: values.attendees,
        paymentMethod: values.paymentMethod,
        bookerName: values.bookerName,
        status: 'confirmed',
        paymentStatus: 'completed'
      };

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result: BookingResponse = await response.json();

      if (response.ok) {
        toast.success('Booking successful!');
        setBookingSuccess(true);
        setBookingData(result.data);
        setBookingConfirmed(true);
        setBookingReference(result.data.bookingReference);
        setEvent(prev => prev ? {
          ...prev,
          availableTickets: prev.availableTickets - values.ticketCount
        } : null);
      } else {
        toast.error(result.message || 'Booking failed');
      }

    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error instanceof Error ? error.message : 'Booking failed. Please try again.');
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
        Booking Reference: {bookingData?.bookingReference}
      </Alert>
      {bookingData && (
        <Box sx={{
          mt: 3,
          p: 3,
          bgcolor: '#f8f9fa',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h6">Your Ticket</Typography>
          <Box sx={{
            width: 250,
            height: 250,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'white',
            p: 2,
            borderRadius: 1,
            boxShadow: 1
          }}>
            <Box className="qr-code">
              <QRCodeSVG
                value={JSON.stringify({
                  bookingReference: bookingData.bookingReference,
                  eventId: event?._id,
                  ticketCount: formik.values.ticketCount
                })}
                size={200}
                level="H"
                includeMargin={true}
              />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Scan this QR code at the event entrance
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const svg = document.querySelector('.qr-code svg');
              if (!svg) return;

              const canvas = document.createElement('canvas');
              const svgData = new XMLSerializer().serializeToString(svg);
              const img = new Image();
              
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                  if (!blob) return;
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ticket-${bookingData.bookingReference}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }, 'image/png');
              };
              
              img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            }}
            startIcon={<QrCode />}
            sx={{ mt: 2 }}
          >
            Download Ticket
          </Button>
        </Box>
      )}
      <Button
        variant="contained"
        onClick={() => {
          setOpenBooking(false);
          setBookingConfirmed(false);
          setActiveStep(0);
          window.location.href = '/dashboard';
        }}
        sx={{ mt: 3 }}
      >
        View My Bookings
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Event not found or has been removed.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <EventAvailable />
                  <Typography>
                    {event.date} at {event.time}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn />
                  <Typography>{event.location}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoney />
                  <Typography>₹{event.ticketPrice} per ticket</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person />
                  <Typography>{event.availableTickets} tickets available</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Information
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                Available Tickets: {event.availableTickets}
              </Typography>
              <Typography variant="body1">
                Price per Ticket: ₹{event.ticketPrice}
              </Typography>
            </Box>
            {!isAdmin && event.availableTickets > 0 && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenBooking(true)}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                  },
                }}
              >
                Book Now
              </Button>
            )}
            {!isAdmin && event.availableTickets === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Sorry, this event is sold out!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Booking Dialog */}
      {!isAdmin && (
        <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="md" fullWidth>
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
      )}
    </Container>
  );
};

export default EventDetails; 