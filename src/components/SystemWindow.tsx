import { Box, Grid } from '@mui/material';
import { GameData, systemService } from '../services/system.service';
import { Win } from './Win/Win';
import { useContext, useEffect, useState } from 'react';
import { Loading } from './Loading';
import { Game } from './Game';
import { ToastContext } from '../contexts/toast.context';

type Props = {
  systemId: string;
}

export const SystemWindow = ({ systemId }: Props) => {
  const system = systemService.get(systemId);
  const [gameDataList, setGameDataList] = useState<GameData[]>();
  const { showError } = useContext(ToastContext);

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
            { gameDataList.map(({ game }) => <Game key={game.id} game={game} />)}
          </Grid>
        </Box>
      ) }
    </Win>
  )
};
