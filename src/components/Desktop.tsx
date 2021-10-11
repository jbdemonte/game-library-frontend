import { useContext, useEffect, useState } from 'react';
import {  Grid } from '@mui/material';
import { systemService, SystemStatus } from '../services/system.service';
import { Loading } from './Loading';
import { System } from './System';
import { useWinManager, WinManager } from './Win/WinManager';
import { isSystemWindowData, SystemWindow } from './SystemWindow';
import { GameWindow } from './GameWindow';
import { ToastContext } from '../contexts/toast.context';

export const Desktop = () => {
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<SystemStatus[]>();
  const { showError } = useContext(ToastContext);
  const winManagerProps = useWinManager();

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
          { statuses.map(status => <Grid item key={status.system}><System systemId={status.system} onDoubleClick={() => winManagerProps.openNewWindow({ systemId: status.system })} /></Grid> ) }
        </Grid>
      ) }

        <WinManager {...winManagerProps} render={data => {
          if (isSystemWindowData(data)) {
            return <SystemWindow systemId={data.systemId } />;
          }
          return <GameWindow gameData={data.gameData} />
        }} />
    </>
  );
}
