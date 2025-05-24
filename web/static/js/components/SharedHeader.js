import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Add as AddIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const HeaderContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const HeaderContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  fontSize: '0.9rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  color: '#4a5568',
  '&:hover': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
  },
}));

const PrimaryNavButton = styled(NavButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
  },
}));

const SharedHeader = ({ currentPage, userInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleLogoClick = () => {
    window.location.href = '/user';
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setMobileMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    // Clear any local storage or session data
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to logout endpoint
    window.location.href = '/logout';
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/user', icon: <DashboardIcon /> },
    { label: 'My Events', path: '/events', icon: <EventIcon /> },
    { label: 'Create Event', path: '/create-event', icon: <AddIcon />, primary: true },
  ];

  return (
    <HeaderContainer>
      <HeaderContent maxWidth="lg">
        {/* Logo */}
        <Logo onClick={handleLogoClick}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#667eea',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            🎪 EventHub
          </Typography>
        </Logo>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box display="flex" alignItems="center" gap={2}>
            {navigationItems.map((item) => (
              item.primary ? (
                <PrimaryNavButton
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </PrimaryNavButton>
              ) : (
                <NavButton
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    backgroundColor: currentPage === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    color: currentPage === item.path ? '#667eea' : '#4a5568',
                  }}
                >
                  {item.label}
                </NavButton>
              )
            ))}
          </Box>
        )}

        {/* User Profile & Mobile Menu */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* User Profile */}
          <IconButton onClick={handleProfileMenuOpen} size="small">
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton onClick={handleMobileMenuOpen} size="small">
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* Mobile Navigation Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              mt: 1,
              '& .MuiMenuItem-root': {
                borderRadius: '8px',
                margin: '2px 8px',
                fontWeight: 600,
              },
            },
          }}
        >
          {navigationItems.map((item) => (
            <MenuItem 
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                color: item.primary ? '#667eea' : 'inherit',
                fontWeight: item.primary ? 700 : 600,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {item.icon}
                {item.label}
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              mt: 1,
              '& .MuiMenuItem-root': {
                borderRadius: '8px',
                margin: '2px 8px',
                fontWeight: 600,
              },
            },
          }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {userInfo?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userInfo?.email || 'user@example.com'}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <AccountIcon sx={{ mr: 1 }} />
            Profile Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default SharedHeader; 