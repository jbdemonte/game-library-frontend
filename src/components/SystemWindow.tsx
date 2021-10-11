import { Box, Grid } from '@mui/material';
import { GameData, systemService } from '../services/system.service';
import { Win } from './Win/Win';
import { useContext, useEffect, useState } from 'react';
import { Loading } from './Loading';
import { Game } from './Game';
import { ToastContext } from '../contexts/toast.context';
import { WindowContext } from '../contexts/window.context';

export type SystemWindowData = {
  systemId: string;
}

export const isSystemWindowData = (data: any): data is SystemWindowData => {
  return data.hasOwnProperty('systemId');
}

export const SystemWindow = ({ systemId }: SystemWindowData) => {
  const system = systemService.get(systemId);
  const [gameDataList, setGameDataList] = useState<GameData[]>();
  const { showError } = useContext(ToastContext);
  const { openNewWindow } = useContext(WindowContext)

  useEffect(() => {
    systemService
      .getSystemGameData(systemId)
      .then(setGameDataList)
      .catch(showError)
  }, [systemId, showError])

  return (
    <Win title={system.name}>
      { !gameDataList && <Loading /> }
      { gameDataList && (
        <Box sx={{ position: 'absolute', inset: 1, overflow: 'auto', p: 2 }}>
          <Grid container direction="row" spacing={1}>
            { gameDataList.map((gameData) => <Game key={gameData.game.id} game={gameData.game} onDoubleClick={() => openNewWindow({ gameData })} />)}
          </Grid>
        </Box>
      ) }
    </Win>
  )
};
