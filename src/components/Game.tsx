import { IGame } from '../interfaces/game.interface';
import { GameIcon } from './FileIcon/GameIcon';

type Props = {
  game: IGame;
}

export const Game = ({ game }: Props) => {
  const media = getMedia(game);
  return <GameIcon label={game.name} img={`${process.env.REACT_APP_API_URL}${media?.url}`} />;
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
