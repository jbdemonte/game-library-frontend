import { useMemo } from 'react';
import { Box } from '@mui/material';
import { IMedia } from '../interfaces/game.interface';
import { getMedia, MediaType } from '../tools/media';

export const Gallery = ({ medias, onClick } : { medias: IMedia[], onClick: (media: IMedia) => void }) => {
  const selection: IMedia[] = useMemo(
    () => [
      getMedia(medias, MediaType.box2D),
      getMedia(medias, MediaType.screen),
      getMedia(medias, MediaType.title)
    ].filter((media): media is IMedia => Boolean(media))
    , [medias]
  );

  if (selection.length < 2) {
    return null;
  }

  return (
    <Box>
      { selection.map(media => (
        <img
          key={media.url}
          src={media.url}
          style={{ width: '45px', height: 'auto', margin: '0 5px', cursor: 'pointer' }}
          alt={media.type}
          onClick={() => onClick(media)}
        />
      ) ) }
    </Box>
  )
}
