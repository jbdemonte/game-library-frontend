import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Grid, Snackbar } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { System } from './System';

export const Desktop = () => {
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    systemService
      .getStatuses()
      .then(setStatuses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      { loading && (
        <Box sx={{ width: 1, height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) }

      { statuses && (
        <Grid container spacing={3} direction="column" sx={{p: 2}}>
          { statuses.map(status => <Grid item key={status.system}><System system={status.system} /></Grid> ) }
        </Grid>
      ) }

      <Snackbar open={Boolean(error)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right'}} onClose={() => setError(undefined)}>
        <Alert onClose={() => setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'Unknown error'}
        </Alert>
      </Snackbar>
    </>
  );
}
