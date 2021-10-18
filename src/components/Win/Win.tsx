import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react';
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

const WinMinSize = 250;

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

  const onCursorChange = useCallback((cursor: string) => setProperties(properties => ({ ...properties, cursor })), []);

  const onResize = useCallback((offset: { top: number, left: number, bottom: number, right: number }) => {
    setProperties(properties => {
      let top = properties.top + offset.top;
      let left = properties.left + offset.left;
      let height = properties.height + offset.bottom - offset.top;
      let width = properties.width + offset.right - offset.left;

      // keep top side in the window
      if (top < 0) {
        height += top;
        top = 0;
      }

      // keep left side in the window
      if (left < 0) {
        width += left;
        left = 0;
      }

      // respect min height
      if (height < WinMinSize) {
        if (offset.top) {
          top -= WinMinSize - height;
        }
        height = WinMinSize;
      }

      // respect min width
      if (width < WinMinSize) {
        if (offset.left) {
          left -= WinMinSize - width;
        }
        width = WinMinSize;
      }

      // keep left side in the window
      if (left + width > window.innerWidth) {
        width = window.innerWidth - left;
      }

      // keep bottom side in the window
      if (top + height > window.innerHeight) {
        height = window.innerHeight - top;
      }

      const updated = {...properties, top, left, width, height };

      return arePropertiesEquals(properties, updated) ? properties : updated;
    });
  }, []);

  const toggleFullScreen = useCallback(() => {
    setProperties(properties => ({ ...properties, fullscreen: !properties.fullscreen }));
  }, []);

  const onPointerDown = useCallback(() => focus(), [focus]);

  const onDragMove = useCallback((e: PointerEvent) => {
    setProperties(properties => ({
      ...properties,
      top: minMax(0, properties.top + e.movementY, window.innerHeight - properties.height),
      left: minMax(0, properties.left + e.movementX, window.innerWidth - properties.width),
    }))
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value.toLowerCase().trim());
  }, [setSearched]);

  // Resize the box when the window size change (reduce it size, and move its position)
  useEffect(() => {
    const onWindowResize = () => {
      setProperties(properties => {
        let { top, left, width, height } = properties;
        if (left + width > window.innerWidth) {
          width = window.innerWidth - left;
          if (width < WinMinSize) {
            left = Math.max(0, left - (WinMinSize - width));
            width = WinMinSize;
          }
        }
        if (top + height > window.innerHeight) {
          height = window.innerHeight - top;
          if (height < WinMinSize) {
            top = Math.max(0, top - (WinMinSize - height));
            height = WinMinSize;
          }
        }
        const updated = {...properties, top, left, width, height };
        return arePropertiesEquals(properties, updated) ? properties : updated;
      });
    };
    
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

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

function arePropertiesEquals<T extends Record<string, any>>(source: T, target: T): boolean {
  const keys = Object.keys(source);
  return Object.keys(target).length === keys.length && !keys.some(key => source[key] !== target[key]);
}
