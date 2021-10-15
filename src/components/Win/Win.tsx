import { FC, useCallback, useContext, useState } from 'react';
import { Box, styled } from '@mui/material';
import { useOnDrag } from '../../hooks/use-on-drag';
import { useOnResize } from '../../hooks/use-on-resize';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Content } from './components/Content';
import { WinContext } from '../../contexts/win.context';

type Props = {
  title: string;
  img?: string;
  footer?: [string, string, string];
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

function randomOffset(size: number, percent: number) {
  const sign = Math.sign(Math.random() - 0.5);
  return sign * Math.floor((size * percent / 100) * Math.random());
}

export const Win: FC<Props> = ({ img, title, footer: defaultFooter, children }) => {
  const { footer, zIndex, close, focus } = useContext(WinContext);
  const [resizing, setResizing] = useState(false);
  const [{ top, left, width, height, cursor, fullscreen }, setProperties] = useState(() => {
    const height = window.innerHeight / 2;
    const width = window.innerWidth / 2.5;
    const randX = randomOffset(window.innerWidth - width, 20);
    const randY = randomOffset(window.innerHeight - height, 20);
    return {
    width,
    height,
    top: Math.floor((window.innerHeight - height) / 2) + randY,
    left: Math.floor((window.innerWidth - width) / 2) + randX,
    cursor: 'auto',
    fullscreen: false
  }});

  const onCursorChange = useCallback((cursor: string) => setProperties(props => ({ ...props, cursor })), []);

  const onResize = useCallback((offset: { top: number, left: number, bottom: number, right: number }) => {
    setProperties(props => ({
      ...props,
      top: props.top + offset.top,
      left: props.left + offset.left,
      height: Math.max(250, props.height + offset.bottom - offset.top),
      width: Math.max(250, props.width + offset.right - offset.left),
    }))
  }, []);

  const toggleFullScreen = useCallback(() => {
    setProperties(props => ({ ...props, fullscreen: !props.fullscreen }));
  }, []);

  const onPointerDown = useCallback(() => focus(), [focus]);

  const onDragMove = useCallback((e: PointerEvent) => {
    setProperties(props => ({ ...props,  top: props.top + e.movementY, left: props.left + e.movementX }))
  }, []);

  return (
    <Window
      sx={ fullscreen ? { inset: 5, zIndex } : { top, left, width, height, cursor, zIndex }}
      {...useOnResize({
        onCursorChange,
        onResize,
        onChange: setResizing,
        resizable: !fullscreen,
        onPointerDown: onPointerDown,
      })}
    >
      <Header
        fullscreen={fullscreen}
        onDoubleClick={toggleFullScreen}
        onCloseClick={close}
        onFullScreenClick={toggleFullScreen}
        {...useOnDrag({ draggable: !fullscreen && !resizing, onDragMove })}
      >
        {Boolean(img) && <img src={img} alt={title} style={{ maxHeight: '18px', width: 'auto', verticalAlign: 'middle', marginRight: '5px'}} />}
        {title}
      </Header>
      <Content>{children}</Content>
      <Footer>
        { (footer || defaultFooter || []).map((value, index) => <span key={index}>{value}</span>) }
      </Footer>
    </Window>
  );
};
