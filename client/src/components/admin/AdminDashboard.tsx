import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { QrCodeScanner, Event, Group, BarChart } from '@mui/icons-material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* QR Code Scanner Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(45deg, #7E57C2 30%, #B388FF 90%)',
              color: 'white'
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <QrCodeScanner sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="div">
                    Event Check-In
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Scan QR codes to check in attendees at events. View real-time check-in status and history.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to="/admin/check-in"
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#7E57C2',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Open Scanner
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Events Management Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(45deg, #26A69A 30%, #80CBC4 90%)',
              color: 'white'
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Event sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="div">
                    Events Management
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Create and manage events, track ticket sales, and monitor event performance.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to="/admin/events"
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#26A69A',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Manage Events
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* User Management Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(45deg, #EF5350 30%, #EF9A9A 90%)',
              color: 'white'
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Group sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="div">
                    User Management
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Manage user accounts, roles, and permissions. View user activity and bookings.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to="/admin/users"
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#EF5350',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Manage Users
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Analytics Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(45deg, #5C6BC0 30%, #9FA8DA 90%)',
              color: 'white'
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChart sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="div">
                    Analytics
                  </Typography>
                </Box>
                <Typography variant="body1">
                  View detailed analytics and reports for events, ticket sales, and user engagement.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to="/admin/analytics"
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#5C6BC0',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  View Analytics
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Events Overview Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Events Overview
          </Typography>
          <TableContainer component={Paper}>
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
                {/* Event rows will be mapped here */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Recent Bookings Section */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Recent Bookings
          </Typography>
          <TableContainer component={Paper}>
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
                {/* Booking rows will be mapped here */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 