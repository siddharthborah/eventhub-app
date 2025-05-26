import React, { useState, useEffect } from 'react';
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
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Add as AddIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import EventHubLogo from './EventHubLogo';

const HeaderContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 80%, rgba(255,255,255,0.85) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: 0,
  boxShadow: '0 4px 24px 0 rgba(102, 126, 234, 0.10), 0 1.5px 0 rgba(102, 126, 234, 0.04)',
  borderBottom: '1.5px solid rgba(102, 126, 234, 0.10)',
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
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (!isMobile) return;
    let lastScrollY = window.scrollY;
    let ticking = false;
    const threshold = window.innerHeight / 2;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 20) {
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY) {
            if (currentScrollY > threshold) {
              setShowHeader(false); // scrolling down, past threshold
            } else {
              setShowHeader(true); // don't hide before threshold
            }
          } else if (currentScrollY < lastScrollY) {
            setShowHeader(true); // scrolling up
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleLogoClick = () => {
    window.location.href = '/user';
  };

  const handleNavigation = (path) => {
    if (path === '#') {
      // Placeholder links - do nothing for now
      setMobileMenuAnchor(null);
      return;
    }
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
    { label: 'Events', path: '#', icon: <EventIcon /> },
    { label: 'Calendar', path: '#', icon: <CalendarIcon /> },
    { label: 'Community', path: '#', icon: <PeopleIcon /> },
  ];

  return (
    <HeaderContainer
      sx={isMobile ? {
        transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
        transform: showHeader ? 'translateY(0)' : 'translateY(-120%)',
        pointerEvents: showHeader ? 'auto' : 'none',
      } : {}}
    >
      <HeaderContent maxWidth="lg">
        {/* Avatar on the left */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleProfileMenuOpen} size="small">
            {userInfo?.picture ? (
              <Avatar 
                src={userInfo.picture} 
                alt={userInfo.name || 'User'} 
                sx={{ width: 36, height: 36 }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : (userInfo?.nickname ? userInfo.nickname.charAt(0).toUpperCase() : 'U')}
              </Avatar>
            )}
          </IconButton>
        </Box>
        {/* Logo on the right */}
        <Logo onClick={handleLogoClick} sx={{ ml: 'auto' }}>
          <EventHubLogo 
            height={32} 
            width={112} 
            onClick={handleLogoClick}
            sx={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
        </Logo>
        {/* Desktop Navigation */}
        {!isMobile && (
          <Box display="flex" alignItems="center" gap={2}>
            {navigationItems.map((item) => (
              item.primary ? (
                <PrimaryNavButton
                  key={item.path}
                  {...(item.icon && { startIcon: item.icon })}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </PrimaryNavButton>
              ) : (
                <NavButton
                  key={item.path}
                  {...(item.icon && { startIcon: item.icon })}
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
        {/* Combined Profile & Navigation Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              borderRadius: '12px',
              mt: 1.5,
              minWidth: 180,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '& .MuiMenuItem-root': {
                borderRadius: '8px',
                margin: '4px 8px',
                padding: '8px 16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                }
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* Profile Info */}
          {userInfo?.name && (
            <MenuItem sx={{ fontWeight: 600, color: '#2d3748', '&:hover': { backgroundColor: 'transparent !important'} }} disabled>
              {userInfo.name}
            </MenuItem>
          )}
          {userInfo?.email && (
             <MenuItem sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: -0.5, mb: 0.5, '&:hover': { backgroundColor: 'transparent !important' } }} disabled>
                {userInfo.email}
            </MenuItem>
          )}
          {(userInfo?.name || userInfo?.email) && <Box sx={{ my: 0.5, mx: 1, borderTop: '1px solid #e0e0e0' }} />}
          {/* Navigation Items (always shown on mobile, optional on desktop) */}
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
                {item.icon && item.icon}
                {item.label}
              </Box>
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </HeaderContent>
    </HeaderContainer>
  );
};

// Make component available globally
window.SharedHeader = SharedHeader;

export default SharedHeader; 