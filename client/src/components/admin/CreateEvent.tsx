import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

interface EventFormValues {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  ticketPrice: number;
  capacity: number;
  image: string;
  eventType: string;
}

const CreateEvent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const formik = useFormik<EventFormValues>({
    initialValues: {
      title: '',
      description: '',
      date: '',
      time: '12:00',
      location: '',
      ticketPrice: 0,
      capacity: 0,
      image: '',
      eventType: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .max(100, 'Title must be at most 100 characters'),
      description: Yup.string()
        .required('Description is required')
        .max(500, 'Description must be at most 500 characters'),
      date: Yup.string().required('Date is required'),
      time: Yup.string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)')
        .required('Time is required'),
      location: Yup.string().required('Location is required'),
      ticketPrice: Yup.number()
        .min(0, 'Price must be positive')
        .required('Price is required'),
      capacity: Yup.number()
        .min(1, 'Capacity must be at least 1')
        .required('Capacity is required'),
      image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
      eventType: Yup.string()
        .oneOf(['tech', 'business', 'workshop', 'conference', 'seminar'], 'Invalid event type')
        .required('Event type is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        // Send request to create event
        const response = await fetch(`${API_URL}/api/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create event');
        }

        const data = await response.json();
        console.log('Event created:', data);

        toast.success('Event created successfully!');
        navigate('/admin/dashboard');
      } catch (error) {
        console.error('Error creating event:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create event');
      } finally {
        setLoading(false);
      }
    },
  });

  const eventTypes = [
    { value: 'tech', label: 'Tech Event' },
    { value: 'business', label: 'Business Event' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'seminar', label: 'Seminar' },
  ];

  const handleEventTypeChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue('eventType', event.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Create New Event
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Event Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Event Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="time"
                name="time"
                label="Event Time"
                type="time"
                value={formik.values.time}
                onChange={formik.handleChange}
                error={formik.touched.time && Boolean(formik.errors.time)}
                helperText={(formik.touched.time && formik.errors.time) || 'Format: HH:mm (24-hour)'}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  step: 300 // 5 min intervals
                }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="ticketPrice"
                name="ticketPrice"
                label="Ticket Price"
                type="number"
                value={formik.values.ticketPrice}
                onChange={formik.handleChange}
                error={formik.touched.ticketPrice && Boolean(formik.errors.ticketPrice)}
                helperText={formik.touched.ticketPrice && formik.errors.ticketPrice}
                InputProps={{ inputProps: { min: 0 } }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="capacity"
                name="capacity"
                label="Capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
                InputProps={{ inputProps: { min: 1 } }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="image"
                name="image"
                label="Image URL"
                value={formik.values.image}
                onChange={formik.handleChange}
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.eventType && Boolean(formik.errors.eventType)}>
                <InputLabel id="eventType-label">Event Type</InputLabel>
                <Select
                  labelId="eventType-label"
                  id="eventType"
                  name="eventType"
                  value={formik.values.eventType}
                  onChange={handleEventTypeChange}
                  label="Event Type"
                  disabled={loading}
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    minWidth: 200,
                    background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Event'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateEvent;