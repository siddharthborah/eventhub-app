import React from 'react';
import { Box } from '@mui/material';

const EventHubLogo = ({ 
  height = 40, 
  width = 140, 
  variant = 'default', // 'default', 'white', 'icon-only'
  onClick,
  sx = {} 
}) => {
  if (variant === 'icon-only') {
    return (
      <Box
        component="svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? { transform: 'scale(1.05)' } : {},
          ...sx
        }}
      >
        <circle cx="16" cy="16" r="10" fill="none" stroke="#667eea" strokeWidth="2.5"/>
        <circle cx="16" cy="16" r="4" fill="#764ba2"/>
        <circle cx="10" cy="10" r="2" fill="#667eea"/>
        <circle cx="22" cy="10" r="2" fill="#667eea"/>
        <circle cx="10" cy="22" r="2" fill="#667eea"/>
        <circle cx="22" cy="22" r="2" fill="#667eea"/>
      </Box>
    );
  }

  const strokeColor = variant === 'white' ? 'white' : '#667eea';
  const fillColor = variant === 'white' ? 'white' : '#764ba2';
  const textColor = variant === 'white' ? 'white' : '#2d3748';
  const hubTextColor = variant === 'white' ? 'white' : '#667eea';
  const dotOpacity = variant === 'white' ? 0.8 : 1;

  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox="0 0 140 40"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? { transform: 'scale(1.05)' } : {},
        ...sx
      }}
    >
      {/* Hub icon */}
      <circle cx="20" cy="20" r="8" fill="none" stroke={strokeColor} strokeWidth="2"/>
      <circle cx="20" cy="20" r="3" fill={fillColor}/>
      <circle cx="15" cy="15" r="1.5" fill={strokeColor} opacity={dotOpacity}/>
      <circle cx="25" cy="15" r="1.5" fill={strokeColor} opacity={dotOpacity}/>
      <circle cx="15" cy="25" r="1.5" fill={strokeColor} opacity={dotOpacity}/>
      <circle cx="25" cy="25" r="1.5" fill={strokeColor} opacity={dotOpacity}/>
      
      {/* Text */}
      <text 
        x="38" 
        y="26" 
        fontFamily="Inter, sans-serif" 
        fontSize="18" 
        fontWeight="700" 
        fill={textColor}
      >
        Event<tspan fill={hubTextColor}>Hub</tspan>
      </text>
    </Box>
  );
};

export default EventHubLogo; 