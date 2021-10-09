import { FC, useContext, useState } from 'react';
import { Box, styled } from '@mui/material';
import { useOnDrag } from '../../hooks/use-on-drag';
import { useOnResize } from '../../hooks/use-on-resize';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Content } from './components/Content';
import { WindowContext } from '../../contexts/window.context';

type Props = {
  title: string;
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

export const Win: FC<Props> = ({ title }) => {
  const { descriptor, close, focus } = useContext(WindowContext);
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
    <Window
      sx={ fullscreen ? { inset: 5, zIndex: descriptor.pos } : { top, left, width, height, cursor, zIndex: descriptor.pos }}
      {...useOnResize({
        onCursorChange,
        onResize,
        onChange: setResizing,
        resizable: !fullscreen,
        onPointerDown: () => focus(),
      })}
    >
      <Header
        fullscreen={fullscreen}
        onDoubleClick={toggleFullScreen}
        onCloseClick={close}
        onFullScreenClick={toggleFullScreen}
        {...useOnDrag({ draggable: !fullscreen && !resizing, onDragMove: (e) => setProperties(props => ({ ...props, top: props.top + e.movementY, left: props.left + e.movementX }))})}
      >
        {title}
      </Header>
      <Content />
      <Footer />
    </Window>
  );
};
