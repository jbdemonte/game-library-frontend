import { IGame } from '../interfaces/game.interface';
import { GameIcon } from './FileIcon/GameIcon';
import { getDefaultMedia } from '../tools/media';

type Props = {
  game: IGame;
  onDoubleClick?: () => void;
}

export const Game = ({ game, onDoubleClick }: Props) => {
  const media = getDefaultMedia(game.medias);
  const url = media ? `${process.env.REACT_APP_API_URL}${media.url}` : `${process.env.PUBLIC_URL}/systems/icons/missing.png`;
  return <GameIcon label={game.name} img={url} onDoubleClick={onDoubleClick} />;
}
