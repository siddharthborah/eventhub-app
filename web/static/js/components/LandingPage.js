import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme, 
  useMediaQuery,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: '12px 32px',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  transition: 'all 0.3s ease',
}));

const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  },
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'white',
  color: '#667eea',
  border: '2px solid #667eea',
  '&:hover': {
    background: '#667eea',
    color: 'white',
    transform: 'translateY(-2px)',
  },
}));

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <HeroSection>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🎪 EventHub
          </Typography>
          
          {/* Header Login/Signup Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                href="/login"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                href="/signup"
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <StyledPaper elevation={0}>
          <Box
            sx={{
              textAlign: 'center',
              py: 2,
            }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#2d3748',
                letterSpacing: '-0.5px',
              }}
            >
              Create Amazing Events
            </Typography>
            
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="h2"
              gutterBottom
              sx={{
                mb: 6,
                color: '#718096',
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Plan, organize, and share memorable events with friends and family. 
              Create beautiful event pages, send invitations, and track RSVPs - all in one place.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
              }}
            >
              <PrimaryButton
                variant="contained"
                size="large"
                href="/login"
              >
                Login
              </PrimaryButton>
              <SecondaryButton
                variant="outlined"
                size="large"
                href="/signup"
              >
                Sign Up
              </SecondaryButton>
            </Box>

            {/* Feature highlights */}
            <Box
              sx={{
                mt: 6,
                pt: 4,
                borderTop: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 4,
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '2rem', mb: 1 }}
                >
                  🎉
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                  Easy Planning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create events in minutes with our intuitive interface
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '2rem', mb: 1 }}
                >
                  ✅
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                  RSVP Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send invites and track who's coming with Yes/No/Maybe responses
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontSize: '2rem', mb: 1 }}
                >
                  📱
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                  Mobile Ready
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access your events anywhere, on any device
                </Typography>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    </HeroSection>
  );
};

export default LandingPage; 