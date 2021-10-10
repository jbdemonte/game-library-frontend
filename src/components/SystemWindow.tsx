import { Box, Grid } from '@mui/material';
import { GameData, systemService } from '../services/system.service';
import { Win } from './Win/Win';
import { useEffect, useState } from 'react';
import { Loading } from './Loading';
import { Game } from './Game';

type Props = {
  systemId: string;
}

export const SystemWindow = ({ systemId }: Props) => {
  const system = systemService.get(systemId);
  const [gameDataList, setGameDataList] = useState<GameData[]>();

  useEffect(() => {
    systemService
      .getSystemGameData(systemId)
      .then(setGameDataList)
      .catch(err => console.log(err)) // todo
  }, [systemId])

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
