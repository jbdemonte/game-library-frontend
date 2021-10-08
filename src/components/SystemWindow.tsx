import { useState } from 'react';
import { Box, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { systemService } from '../services/system.service';
import { useOnDrag } from '../hooks/use-on-drag';

type Props = {
  systemId: string;
  close: () => void
}

const Window = styled(Box)`
  position: absolute;
  pointer-events: auto;
  border-radius: 10px;
  border: 1px solid #747676;
  background: #353738;
  display: flex;
  flex-direction: column;
`;

const Header = styled(Box)`
  padding: 2px 10px;
  border-bottom: 1px solid #000;
  height: 30px;
  display: flex;
  align-items: center;
`;

const Content = styled(Box)`
  background: #1d1f21;
  flex-grow: 1;
`;

const Footer = styled(Box)`
  padding: 2px 10px;
  border-top: 1px solid #000;
  height: 30px;
  background: #202122;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const Part = styled(Box)`
  display: flex;
  align-items: center;
`;

const Space = styled(Part)`
  flex-grow: 1;
`;

const CloseButton = styled(CloseIcon)`
  color: #fa5e57;
  background: #fa5e57;
  border-radius: 100px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #fa5e57;

  &:hover {
    color: #730a00;
    border-color: #e14039;
  }
`;

export const SystemWindow = ({ systemId, close }: Props) => {
  const [{ top, left, width, height }, setProperties] = useState(() => {
    const height = window.innerHeight / 2;
    const width = window.innerWidth / 1.5;
    return {
    width,
    height,
    top: Math.floor((window.innerHeight - height) / 2),
    left: Math.floor((window.innerWidth - width) / 2),
  }});

  const system = systemService.get(systemId);

  return (
    <Window sx={{ top, left, width, height }}>
      <Header {...useOnDrag({ onDragMove: (e) => setProperties(props => ({ ...props, top: props.top + e.movementY, left: props.left + e.movementX }))})}>
        <Part><Typography sx={{ fontSize: 14, userSelect: 'none'}}>{system.name}</Typography></Part>
        <Space />
        <Part><CloseButton onClick={close} /></Part>
      </Header>
      <Content />
      <Footer />
    </Window>
  );
};
