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
  background: '#F8F9FA',
  color: '#2C3E50',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
}));

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <HeroSection>
      <Container maxWidth="md">
        <StyledPaper elevation={0}>
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
            }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 300,
                mb: 4,
                color: '#2C3E50',
                letterSpacing: '0.5px',
              }}
            >
              Welcome
            </Typography>
            
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="h2"
              gutterBottom
              sx={{
                mb: 6,
                color: '#5D6D7E',
                fontWeight: 300,
                letterSpacing: '0.3px',
              }}
            >
              Experience simplicity redefined
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Button
                variant="contained"
                size="large"
                href="/login"
                sx={{
                  bgcolor: '#2C3E50',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#34495E',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/signup"
                sx={{
                  borderColor: '#2C3E50',
                  color: '#2C3E50',
                  '&:hover': {
                    borderColor: '#34495E',
                    bgcolor: 'rgba(44, 62, 80, 0.04)',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    </HeroSection>
  );
};

export default LandingPage; 