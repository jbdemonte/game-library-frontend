import { GameIcon } from './FileIcon/GameIcon';
import { getDefaultMedia } from '../tools/media';
import { useContext } from 'react';
import { WinContext } from '../contexts/win.context';
import { ScrapedGame } from '../services/system.service';
import { formatFileSize } from '../tools/file';

type Props = {
  data: ScrapedGame;
  onDoubleClick?: () => void;
}

export const Game = ({ data: { game, roms }, onDoubleClick }: Props) => {
  const { setFooter } = useContext(WinContext);
  const media = getDefaultMedia(game.medias);
  const url = media ? `${process.env.REACT_APP_API_URL}${media.url}` : `${process.env.PUBLIC_URL}/systems/icons/missing.png`;
  const resume = roms.length > 1 ? `${roms.length} roms` : '1 rom';
  const size = roms.reduce((sum, rom) => sum + rom.archive.size, 0);
  return <GameIcon label={game.name} img={url} onDoubleClick={onDoubleClick} onPointerEnter={() => setFooter(resume, game.name, `${roms.length > 1 ? 'total: ' : ''}${formatFileSize(size)}`)} onPointerLeave={() => setFooter()}/>;
}
