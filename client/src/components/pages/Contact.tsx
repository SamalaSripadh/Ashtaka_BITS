import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Contact = () => {
  const theme = useTheme();

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      content: 'support@accesshub.com',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Address',
      content: '123 Tech Street, San Francisco, CA 94105',
    },
  ];

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      subject: Yup.string().required('Subject is required'),
      message: Yup.string().required('Message is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      // In a real application, you would send this to your backend
      console.log('Form submitted:', values);
      toast.success('Message sent successfully! We will get back to you soon.');
      resetForm();
    },
  });

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
            Contact Us
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
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      {/* Contact Information */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {contactInfo.map((info, index) => (
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
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{info.icon}</Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {info.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.content}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 4,
              }}
            >
              Send us a Message
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Your Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subject"
                    name="subject"
                    label="Subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="message"
                    name="message"
                    label="Message"
                    multiline
                    rows={4}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #6B21A8 30%, #DB2777 90%)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact; 