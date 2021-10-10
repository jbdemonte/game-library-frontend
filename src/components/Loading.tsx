import { Box, CircularProgress } from '@mui/material';

export const Loading = () => (
  <Box sx={{ width: 1, height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <CircularProgress />
  </Box>
);
