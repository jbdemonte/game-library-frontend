import { useContext, useEffect, useState } from 'react';
import {  Grid } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { Loading } from './Loading';
import { System } from './System';
import { WinManager } from './Win/WinManager';
import { isSystemWindowData, SystemWindow } from './SystemWindow';
import { GameWindow } from './GameWindow';
import { ToastContext } from '../contexts/toast.context';
import { WinPayload } from '../contexts/win-manager.context';

function windowRenderer(payload: WinPayload) {
  if (isSystemWindowData(payload)) {
    return <SystemWindow systemId={payload.systemId } />;
  }
  return <GameWindow gameData={payload.gameData} />;
}

export const Desktop = () => {
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const { showError } = useContext(ToastContext);

  useEffect(() => {
    systemService
      .getStatuses()
      .then(statuses => {
        setStatuses(statuses.sort((a, b) => systemService.get(a.system).name.toLowerCase() < systemService.get(b.system).name.toLowerCase() ? -1 : 1));
      })
      .catch(showError)
      .finally(() => setLoading(false));
  }, [showError]);

  return (
    <WinManager render={windowRenderer} >
      { loading && <Loading />}
      { statuses && (
        <Grid container spacing={3} direction="column" sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, p: 2, width: 'auto', maxWidth: '100%'}}>
          { statuses.map(status => <Grid item key={status.system}><System systemId={status.system} /></Grid> ) }
        </Grid>
      ) }
    </WinManager>
  );
}
