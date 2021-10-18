import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import HelpIcon from '@mui/icons-material/Help';
import StarRateIcon from '@mui/icons-material/StarRate';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { ScrapedGame } from '../services/system.service';
import { Win } from './Win/Win';
import { getDefaultMedia, getVideoMedia } from '../tools/media';
import { IGame } from '../interfaces/game.interface';
import { Video } from './Video';
import { RomTable } from './RomTable';
import { Gallery } from './MediaGallery';
import { WinPayload } from '../contexts/win-manager.context';

export type GameWindowData = {
  gameData: ScrapedGame;
}

export const isGameWindowData = (data: any): data is GameWindowData => {
  return data.hasOwnProperty('gameData');
}

export function gameWindowDataEquals(payloadA: WinPayload, payloadB: WinPayload) {
  return isGameWindowData(payloadA) && isGameWindowData(payloadB) && payloadA.gameData.game.id === payloadB.gameData.game.id;
}

const DetailsBox = ({ game, playVideo }: { game: IGame, playVideo?: () => void}) => (
  <Box sx={{ position: 'relative'}}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, pl: 2, width: '200px', svg: { verticalAlign: 'middle', width: '22px', mr: 1} }}>
      <Typography variant="body2" gutterBottom>
        { game.players > 1 && <PeopleIcon />}
        { game.players === 1 && <PersonIcon />}
        { game.players > 1 ? `${game.players} players` : `1 player` }
      </Typography>
      <Typography variant="body2" gutterBottom>
        <HelpIcon /> { game.genres[0] || '' }
      </Typography>
      <Typography variant="body2" gutterBottom>
        <StarRateIcon /> { game.grade ?? '?' } / 20
      </Typography>
      <Typography variant="body2" gutterBottom>
        <CalendarTodayIcon /> { game.date ?? '?'}
      </Typography>
      { playVideo && (
        <Typography variant="body2" gutterBottom sx={{ cursor: 'pointer', svg: {color: '#808080' }, '&:hover svg': { color: '#fff'} }} onClick={playVideo} >
          <PlayCircleOutlineIcon /> Video
        </Typography>
      )}
    </Box>
  </Box>
);

export const GameWindow = ({ gameData: { game, roms } }: GameWindowData) => {
  const [showVideo, setShowVideo] = useState(false);
  const [media, setMedia] = useState(() => getDefaultMedia(game.medias))
  const video = getVideoMedia(game.medias);

  const icon = useMemo(() => getDefaultMedia(game.medias), [game]);

  return (
    <Win title={game.name} img={icon?.url}>
      <Box sx={{ position: 'absolute', inset: 1, overflow: 'auto', p: 2 }}>
        <Box sx={{ width: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Box sx={{ width: 1, minHeight: '250px', display: 'flex', marginBottom: '10px', justifyContent: 'center', position: 'relative'}}>
            {
              showVideo && video ?
                <Box sx={{ position: 'relative', width: '50%', maxHeight: 300, maxWidth: 300 }}>
                  <Video url={video.url} style={{ width: '100%', maxHeight: 300, maxWidth: 300}} />
                  <CancelIcon sx={{ position: 'absolute', width: '30px', height: '30px', top: '-15px', right: '-15px', zIndex: 5, color: '#808080', cursor: 'pointer', '&:hover': { color: '#fff' }}} onClick={() => setShowVideo(false)} />
                </Box>
              :
                <img
                  src={media?.url || `${process.env.PUBLIC_URL}/systems/icons/missing.png`}
                  style={{ width: '50%', height: 'auto', minHeight: 100, maxHeight: 300, minWidth: 100, maxWidth: 300, objectFit: 'contain'}}
                  alt={game.name}
                />
            }
            <DetailsBox game={game} playVideo={ video ? () => setShowVideo(true) : undefined } />
          </Box>

          <Gallery medias={game.medias} onClick={media => { setMedia(media); setShowVideo(false); }}/>

          <Typography variant="h5" component="div" align="center">
            { game.name }
          </Typography>

          <Typography variant="body2" component="div" align="left" sx={{ py: 2}}>
            { game.synopsis }
          </Typography>

          <RomTable roms={roms} />
        </Box>
      </Box>
    </Win>
  )
};
