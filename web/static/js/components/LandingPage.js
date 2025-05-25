import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme, 
  useMediaQuery,
  Paper,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EventHubLogo from './EventHubLogo';

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

const GetStartedButton = styled(Button)(({ theme }) => ({
  padding: '16px 48px',
  borderRadius: '16px',
  fontWeight: 700,
  fontSize: '1.1rem',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
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
          <EventHubLogo 
            variant="white" 
            height={32} 
            width={112}
          />
          
          {/* Header Login Link for existing users */}
          {!isMobile && (
            <Link
              href="/login"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'white',
                  textDecoration: 'underline',
                },
              }}
            >
              Already have an account? Sign in
            </Link>
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
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <GetStartedButton
                variant="contained"
                size="large"
                href="/signup"
              >
                Get Started Free
              </GetStartedButton>
              
              <Link
                href="/login"
                sx={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#5a6fd8',
                  },
                }}
              >
                Already have an account? Sign in
              </Link>
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