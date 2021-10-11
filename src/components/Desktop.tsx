import { useEffect, useState } from 'react';
import { Alert, Grid, Snackbar } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { System } from './System';
import { useWinManager, WinManager } from './Win/WinManager';
import { SystemWindow } from './SystemWindow';
import { Loading } from './Loading';

interface ISystemData {
  system: string;
}

export const Desktop = () => {
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const { openNewWindow, winManagerProps } = useWinManager<ISystemData>();

  useEffect(() => {
    systemService
      .getStatuses()
      .then(setStatuses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      { loading && <Loading />}

      { statuses && (
        <Grid container spacing={3} direction="column" sx={{p: 2}}>
          { statuses.map(status => <Grid item key={status.system}><System systemId={status.system} onDoubleClick={() => openNewWindow({ system: status.system })} /></Grid> ) }
        </Grid>
      ) }

      <WinManager {...winManagerProps} render={data => <SystemWindow systemId={data.system } />} />

      <Snackbar open={Boolean(error)} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right'}} onClose={() => setError(undefined)}>
        <Alert onClose={() => setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'Unknown error'}
        </Alert>
      </Snackbar>
    </>
  );
}
