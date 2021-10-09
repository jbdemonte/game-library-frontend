import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Grid, Snackbar } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { System } from './System';
import { SystemWindow } from './SystemWindow';

let windowId = 0;

export const Desktop = () => {
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const [windows, setWindows] = useState<Array<{id: number, system: string }>>([]);

  useEffect(() => {
    systemService
      .getStatuses()
      .then(setStatuses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  function openSystem(system: string) {
    setWindows(items => [...items, { id: ++windowId, system }]);
  }

  function closeSystem(windowId: number) {
    setWindows(items => items.filter(win => win.id !== windowId));
  }

  return (
    <>
      { loading && (
        <Box sx={{ width: 1, height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) }

      { statuses && (
        <Grid container spacing={3} direction="column" sx={{p: 2}}>
          { statuses.map(status => <Grid item key={status.system}><System systemId={status.system} onDoubleClick={() => openSystem(status.system)} /></Grid> ) }
        </Grid>
      ) }

      <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
        { windows.map(win => <SystemWindow key={win.id} systemId={win.system } onCloseClick={() => closeSystem(win.id)} />) }
      </Box>


      <Snackbar open={Boolean(error)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right'}} onClose={() => setError(undefined)}>
        <Alert onClose={() => setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'Unknown error'}
        </Alert>
      </Snackbar>
    </>
  );
}
