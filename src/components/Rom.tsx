import { useContext } from 'react';
import { Link } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { IRom } from '../interfaces/rom.interface';
import { FileIconStyled } from './FileIcon/FileIconStyled';
import { WinContext } from '../contexts/win.context';
import { formatFileSize } from '../tools/file';

type Props = {
  rom: IRom
}

const RomIcon = FileIconStyled({ icon: SportsEsportsIcon, iconSize: 64, iconOutSize: 80})

export const Rom = ({ rom }: Props) => {
  const { setFooter } = useContext(WinContext);
  return (
    <Link href={rom.archive.url} style={{color: 'white', textDecoration: 'none'}}>
      <RomIcon
        label={rom.archive.name.replace(/\.[^.]+$/, '')}
        onPointerEnter={() => setFooter('', rom.archive.name, formatFileSize(rom.archive.size))}
        onPointerLeave={() => setFooter()}
      />
    </Link>
  );
};
