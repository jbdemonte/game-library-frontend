import { useState } from 'react';
import { Box, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { systemService } from '../services/system.service';
import { useOnDrag } from '../hooks/use-on-drag';
import { useOnResize } from '../hooks/use-on-resize';

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
  gap: 10px;
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

function fullscreenStyled(icon: OverridableComponent<SvgIconTypeMap>) {
  return styled(icon)`
  color: #28c941;
  background: #28c941;
  border-radius: 100px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #28c941;
  padding: 1px;

  &:hover {
    color: #046201;
    border-color: #13aa27;
  }
`;
}

const FullscreenButton = fullscreenStyled(OpenInFullIcon);
const CloseFullscreenButton = fullscreenStyled(CloseFullscreenIcon);

export const SystemWindow = ({ systemId, close }: Props) => {
  const [resizing, setResizing] = useState(false);
  const [{ top, left, width, height, cursor, fullscreen }, setProperties] = useState(() => {
    const height = window.innerHeight / 2;
    const width = window.innerWidth / 1.5;
    return {
    width,
    height,
    top: Math.floor((window.innerHeight - height) / 2),
    left: Math.floor((window.innerWidth - width) / 2),
    cursor: 'auto',
    fullscreen: false
  }});

  const system = systemService.get(systemId);

  const onCursorChange = (cursor: string) => setProperties(props => ({ ...props, cursor }));

  const onResize = (offset: { top: number, left: number, bottom: number, right: number }) => {
    setProperties(props => ({
      ...props,
      top: props.top + offset.top,
      left: props.left + offset.left,
      height: Math.max(250, props.height + offset.bottom - offset.top),
      width: Math.max(250, props.width + offset.right - offset.left),
    }))
  };

  const toggleFullScreen = () => {
    setProperties(props => ({ ...props, fullscreen: !props.fullscreen }));
  };

  return (
    <Window sx={ fullscreen ? { inset: 5 } : { top, left, width, height, cursor }} {...useOnResize({ onCursorChange, onResize, onChange: setResizing, resizable: !fullscreen })}>
      <Header onDoubleClick={toggleFullScreen} {...useOnDrag({ draggable: !fullscreen && !resizing, onDragMove: (e) => setProperties(props => ({ ...props, top: props.top + e.movementY, left: props.left + e.movementX }))})}>
        <Part><Typography sx={{ fontSize: 14, userSelect: 'none'}}>{system.name}</Typography></Part>
        <Space />
        <Part>
          { !fullscreen && <FullscreenButton onClick={toggleFullScreen}/> }
          { fullscreen && <CloseFullscreenButton onClick={toggleFullScreen}/> }
          <CloseButton onClick={close} />
        </Part>
      </Header>
      <Content />
      <Footer />
    </Window>
  );
};
