import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

interface NavMenuItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const menuItems: NavMenuItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const authItems: NavMenuItem[] = isAuthenticated
    ? [
        {
          label: user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard',
          path: user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard',
        },
        ...(user?.role === 'admin' ? [{ label: 'Create Event', path: '/admin/create-event' }] : []),
        { label: 'Logout', onClick: handleLogout }
      ]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
        { label: 'Admin Login', path: '/admin/login' }
      ];

  const handleItemClick = (item: NavMenuItem) => {
    handleClose();
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            AccessHub
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                  },
                }}
              >
                {[...menuItems, ...authItems].map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, ml: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path || ''}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                {authItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={item.onClick}
                    component={item.path ? RouterLink : 'button'}
                    to={item.path}
                    variant={item.label === 'Register' ? 'contained' : 'text'}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        backgroundColor: item.label === 'Register' 
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 