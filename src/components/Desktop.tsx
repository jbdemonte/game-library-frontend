import { Box, CircularProgress } from '@mui/material';

export const Desktop = () => {
  return (
    <Box sx={{ width: 1, height: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
