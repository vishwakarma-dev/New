import React from 'react';
import { Box } from '@mui/material';

interface RulersProps {
  show: boolean;
}

const Rulers: React.FC<RulersProps> = ({ show }) => {
  if (!show) return null;
  const tickColor = 'divider';
  return (
    <>
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 20, zIndex: 2,
        bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider',
        backgroundImage: `linear-gradient(to right, transparent 0, transparent 9px, rgba(0,0,0,0.1) 9px), linear-gradient(to right, transparent 0, transparent 49px, rgba(0,0,0,0.15) 49px)`,
        backgroundSize: '10px 100%, 50px 100%'
      }} />
      <Box sx={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 20, zIndex: 2,
        bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider',
        backgroundImage: `linear-gradient(to bottom, transparent 0, transparent 9px, rgba(0,0,0,0.1) 9px), linear-gradient(to bottom, transparent 0, transparent 49px, rgba(0,0,0,0.15) 49px)`,
        backgroundSize: '100% 10px, 100% 50px'
      }} />
    </>
  );
};

export default Rulers;
