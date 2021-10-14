import { Box, Grid } from '@mui/material';
import { ScrapedGame, systemService } from '../services/system.service';
import { Win } from './Win/Win';
import { useContext, useEffect, useState } from 'react';
import { Loading } from './Loading';
import { Game } from './Game';
import { ToastContext } from '../contexts/toast.context';
import { IRom } from '../interfaces/rom.interface';
import { Rom } from './Rom';
import { gameWindowDataEquals } from './GameWindow';
import { WinManagerContext, WinPayload } from '../contexts/win-manager.context';

export type SystemWindowData = {
  systemId: string;
}

export const isSystemWindowData = (data: any): data is SystemWindowData => {
  return data.hasOwnProperty('systemId');
}

export function systemWindowDataEquals(payloadA: WinPayload, payloadB: WinPayload) {
  return isSystemWindowData(payloadA) && isSystemWindowData(payloadB) && payloadA.systemId === payloadB.systemId;
}

export const SystemWindow = ({ systemId }: SystemWindowData) => {
  const system = systemService.get(systemId);
  const [content, setContent] = useState<{ scraped: ScrapedGame[], roms: IRom[] }>();
  const { showError } = useContext(ToastContext);
  const { openNewWindow } = useContext(WinManagerContext);

  useEffect(() => {
    systemService
      .getSystemContent(systemId)
      .then(setContent)
      .catch(showError)
  }, [systemId, showError])

  return (
    <Win title={system.name}>
      { content ? (
        <Box sx={{ position: 'absolute', inset: 1, overflow: 'auto', p: 2 }}>
          <Grid container direction="row" spacing={1}>
            { content.scraped.map((gameData) => <Game key={gameData.game.id} data={gameData} onDoubleClick={() => openNewWindow({ gameData }, gameWindowDataEquals)} />)}
            { content.roms.map((rom) => <Rom key={rom.id} rom={rom} />)}
          </Grid>
        </Box>
      ) : <Loading /> }
    </Win>
  )
};
