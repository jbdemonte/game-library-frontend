import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { IRom } from '../interfaces/rom.interface';
import { FileIconStyled } from './FileIcon/FileIconStyled';
import { Link } from '@mui/material';

type Props = {
  rom: IRom
}

const RomIcon = FileIconStyled({ icon: SportsEsportsIcon, iconSize: 64, iconOutSize: 80})

export const Rom = ({ rom }: Props) => (
  <Link href={rom.archive.url} style={{ color: 'white', textDecoration: 'none'}}>
    <RomIcon label={rom.archive.name.replace(/\.[^.]+$/, '')}/>
  </Link>
);
