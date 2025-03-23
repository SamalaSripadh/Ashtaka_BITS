import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Search, EventAvailable, LocationOn, Event, AccessTime } from '@mui/icons-material';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

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
  status: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all');
  const [page, setPage] = useState(1);
  const eventsPerPage = 6;
  const theme = useTheme();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }

      setEvents(data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventTypeChange = (event: SelectChangeEvent) => {
    setEventType(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = eventType === 'all' || event.eventType === eventType;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const displayedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (events.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No events available at the moment.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for upcoming events!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Events"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={eventType}
                label="Event Type"
                onChange={handleEventTypeChange}
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="conference">Conferences</MenuItem>
                <MenuItem value="seminar">Seminars</MenuItem>
                <MenuItem value="workshop">Workshops</MenuItem>
                <MenuItem value="tech">Tech Events</MenuItem>
                <MenuItem value="business">Business Events</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={4}>
        {displayedEvents.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.image || 'https://freshproductions.co.uk/wp-content/uploads/2019/11/fresh-events-1.jpg'}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    mb: 2,
                  }}
                >
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Event />}
                    label={new Date(event.date).toLocaleDateString()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<AccessTime />}
                    label={event.time}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={<LocationOn />}
                    label={event.location}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ₹{event.ticketPrice}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/events/${event._id}`}
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Events;