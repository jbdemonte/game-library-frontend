import { IGame } from '../interfaces/game.interface';
import { Box, styled } from '@mui/material';

type Props = {
  game: IGame;
}

const StyledBox = styled(Box)`
  width: 100px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  div {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    margin-bottom: 2px;
  }
  
  img {
    max-width: 90px;
    max-height: 90px;
  }
  
  p {
    font-size: 12px;
    text-align: center;
    margin: 0;
    border-radius: 3px;
  }
  
  &:hover {
    p, div {
      background: #414244;
    }
  }
`;

export const Game = ({ game }: Props) => {
  const media = getMedia(game);

  return (
    <StyledBox>
      <div>
        <img
          src={`${process.env.REACT_APP_API_URL}${media?.url}`}
          alt={game.name}
        />
      </div>
      <p>
        {game.name}
      </p>
    </StyledBox>
  )
}

function getMedia(game: IGame) {
  const types = ['box-2d', 'box-3d', 'ss', 'ss-title'];
  const regions = ['wor', 'fr', 'us', 'ss', 'jp']
  for (const type of types) {
    for (const region of regions) {
      const media = game.medias.find(media => media.type === type && media.region === region);
      if (media) {
        return media;
      }
    }
    const media =  game.medias.find(media => media.type === type);
    if (media) {
      return media;
    }
  }
  return game.medias[0];
}
