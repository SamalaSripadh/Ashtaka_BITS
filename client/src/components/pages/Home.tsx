import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Booking',
      description: 'Book events seamlessly with our intelligent booking system.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Access',
      description: 'Advanced security measures to protect your event access.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Updates',
      description: 'Get instant updates about your events and bookings.',
    },
    {
      icon: <QrCodeScannerIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Quick Entry',
      description: 'Hassle-free entry with digital tickets and QR codes.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
          color: 'white',
          pt: { xs: 10, md: 20 },
          pb: { xs: 10, md: 20 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E7FF 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Smart Event Access Management
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  mb: 4,
                  fontWeight: 400,
                  opacity: 0.9,
                }}
              >
                Streamline your event entry process with our cutting-edge booking and access control system.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/events')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Browse Events
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://freshproductions.co.uk/wp-content/uploads/2019/11/fresh-events-1.jpg"
                alt="Event"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            mb: 8,
            background: 'linear-gradient(45deg, #1a1a1a 30%, #4a4a4a 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Why Choose AccessHub?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
                elevation={0}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'grey.100',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Ready to Transform Your Event Management?
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem' }}
            >
              Join thousands of event organizers who trust AccessHub for their event management needs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6B21A8 30%, #DB2777 90%)',
                },
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 