import { Box, Typography } from '@mui/material';
import systems from '../data/systems.json';
import { ISystem } from '../interfaces/system.interface';

type Props = {
  system: string;
}

export const System = ({ system: id }: Props) => {
  const system = (systems as ISystem[]).find(system => system.id === id);

  return (
    <Box sx={{ width: 100, backgroundColor: 'transparent', textAlign: 'center'}}>
      <img
        height="32"
        src={`${process.env.PUBLIC_URL}/systems/icons/${system?.icon || 'missing.png'}`}
        alt={system?.name || id}
      />
      <Typography sx={{ fontSize: 12, textAlign: 'center'}}>
        { system?.name || id }
      </Typography>
    </Box>
  )
}
