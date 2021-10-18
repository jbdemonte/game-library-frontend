import { ChangeEvent, FC, useCallback, useContext, useState } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { useOnDrag } from '../../hooks/use-on-drag';
import { useOnResize } from '../../hooks/use-on-resize';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Content } from './components/Content';
import { WinContext } from '../../contexts/win.context';
import { Search } from './components/Search';
import { minMax } from './tools/min-max';

type Props = {
  title: string;
  img?: string;
  footer?: [string, string, string];
}

const StyledBox = styled(Box)`
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
  const { footer, zIndex, close, focus, searching, setSearched } = useContext(WinContext);
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
    setProperties(props => {
      const minSize = 250;

      const updated = {
        ...props,
        top : props.top + offset.top,
        left: props.left + offset.left,
        height: props.height + offset.bottom - offset.top,
        width: props.width + offset.right - offset.left,
      };

      // keep top side in the window
      if (updated.top < 0) {
        updated.height += updated.top;
        updated.top = 0;
      }

      // keep left side in the window
      if (updated.left < 0) {
        updated.width += updated.left;
        updated.left = 0;
      }

      // respect min height
      if (updated.height < minSize) {
        if (offset.top) {
          updated.top -= minSize - updated.height;
        }
        updated.height = minSize;
      }

      // respect min width
      if (updated.width < minSize) {
        if (offset.left) {
          updated.left -= minSize - updated.width;
        }
        updated.width = minSize;
      }

      // keep left side in the window
      if (updated.left + updated.width > window.innerWidth) {
        updated.width = window.innerWidth - updated.left;
      }

      // keep bottom side in the window
      if (updated.top + updated.height > window.innerHeight) {
        updated.height = window.innerHeight - updated.top;
      }

      return updated;
    });
  }, []);

  const toggleFullScreen = useCallback(() => {
    setProperties(props => ({ ...props, fullscreen: !props.fullscreen }));
  }, []);

  const onPointerDown = useCallback(() => focus(), [focus]);

  const onDragMove = useCallback((e: PointerEvent) => {
    setProperties(props => ({
      ...props,
      top: minMax(0, props.top + e.movementY, window.innerHeight - props.height),
      left: minMax(0, props.left + e.movementX, window.innerWidth - props.width),
    }))
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value.toLowerCase().trim());
  }, [setSearched]);

  return (
    <StyledBox
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
        {Boolean(img) && <img src={img} alt={title} />}
        <Typography noWrap>{title}</Typography>
      </Header>
      <Content>
        {children}
        { searching && <Search onChange={onChange} />}
      </Content>
      <Footer>
        { (footer || defaultFooter || []).map((value, index) => <Typography key={index} noWrap>{value}</Typography>) }
      </Footer>
    </StyledBox>
  );
};
