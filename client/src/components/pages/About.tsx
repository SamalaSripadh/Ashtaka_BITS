import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';

const About = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Security First',
      description: 'We prioritize the security of your data and event access with state-of-the-art encryption and authentication systems.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Efficiency',
      description: 'Our platform is designed to streamline the event management process, saving you time and resources.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'User-Centric',
      description: 'We build our solutions around your needs, ensuring an intuitive and seamless experience for organizers and attendees.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              textAlign: 'center',
              mb: 3,
            }}
          >
            About AccessHub
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.9,
            }}
          >
            Revolutionizing event access management with smart technology and seamless experiences
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 3,
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                color: 'text.secondary',
                lineHeight: 1.8,
              }}
            >
              At AccessHub, we're committed to transforming the way events are managed and experienced. 
              Our platform combines cutting-edge technology with user-friendly design to create 
              seamless experiences for both event organizers and attendees. We believe that great 
              events should be focused on creating memorable moments, not managing logistics.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://freshproductions.co.uk/wp-content/uploads/2019/11/fresh-events-1.jpg"
              alt="Our Mission"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 6,
            }}
          >
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 4,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      mb: 3,
                    }}
                  >
                    {value.icon}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                  >
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 