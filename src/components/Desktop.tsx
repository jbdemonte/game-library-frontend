import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Grid, Snackbar } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { System } from './System';
import { IBaseDescriptor, WinManager } from './Win/WinManager';
import { SystemWindow } from './SystemWindow';
import { guid } from '../tools/guid';

interface ISystemDescriptor extends IBaseDescriptor {
  system: string;
}

export const Desktop = () => {
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const [descriptors, setDescriptors] = useState<ISystemDescriptor[]>([]);

  useEffect(() => {
    systemService
      .getStatuses()
      .then(setStatuses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  function openSystem(system: string) {
    const pos = 1 + descriptors.reduce((max, descriptor) => Math.max(descriptor.pos, max), 0);
    setDescriptors(items => [...items, { id: guid(), pos, system }]);
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

      <WinManager descriptors={descriptors} update={setDescriptors} render={descriptor => <SystemWindow systemId={descriptor.system } />} />

      <Snackbar open={Boolean(error)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right'}} onClose={() => setError(undefined)}>
        <Alert onClose={() => setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'Unknown error'}
        </Alert>
      </Snackbar>
    </>
  );
}
