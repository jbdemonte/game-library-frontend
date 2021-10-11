import { useContext, useEffect, useState } from 'react';
import {  Grid } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { System } from './System';
import { useWinManager, WinManager } from './Win/WinManager';
import { SystemWindow } from './SystemWindow';
import { Loading } from './Loading';
import { ToastContext } from '../contexts/toast.context';

interface ISystemData {
  system: string;
}

export const Desktop = () => {
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const { showError } = useContext(ToastContext);
  const { openNewWindow, winManagerProps } = useWinManager<ISystemData>();

  useEffect(() => {
    systemService
      .getStatuses()
      .then(setStatuses)
      .catch(showError)
      .finally(() => setLoading(false));
  }, [showError]);

  return (
    <>
      { loading && <Loading />}

      { statuses && (
        <Grid container spacing={3} direction="column" sx={{p: 2}}>
          { statuses.map(status => <Grid item key={status.system}><System systemId={status.system} onDoubleClick={() => openNewWindow({ system: status.system })} /></Grid> ) }
        </Grid>
      ) }

        <WinManager {...winManagerProps} render={data => <SystemWindow systemId={data.system } />} />
    </>
  );
}
