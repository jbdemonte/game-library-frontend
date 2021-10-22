import React, { MouseEventHandler, useMemo, useState, useEffect } from 'react';
import { useEffectOnUpdate } from './use-effect-on-update';


type Props = {
  onCursorChange: (cursor: string) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
  onResize: (offset: { top: number, left: number, bottom: number, right: number }) => void;
  onChange: (resizing: boolean) => void;
  resizable?: boolean;
}

export const useOnResize = ({ onCursorChange, onResize, onChange, resizable, onMouseDown: onMouseDownParent }: Props) => {
  const [, setCursor] = useState('auto');
  const [{ top, left, bottom, right, resizing }, setResizing] = useState({ top: false, left: false, bottom: false, right: false, resizing: false });

  useEffectOnUpdate(() => {
    onChange(resizing)
  }, [resizing]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (resizing && resizable) {
        onResize({
          top: top ? e.movementY : 0,
          left: left ? e.movementX : 0,
          bottom: bottom ? e.movementY : 0,
          right: right ? e.movementX : 0,
        });
        e.preventDefault();
      }
    }
    function onMouseUp() {
      setResizing({ top: false, left: false, bottom: false, right: false, resizing: false });
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizing, top, left, bottom, right, onResize, resizable]);

  return useMemo(() => {
    const onMouseMove: MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
      const { top, left, bottom, right } = getActiveSides(e);
      const cursor = getCursor(top, right, bottom, left);
      setCursor(current => {
        if (current !== cursor) {
          onCursorChange(cursor);
        }
        return cursor;
      });

    };

    const onMouseDown: MouseEventHandler = (e: React.MouseEvent<HTMLElement>) => {
      const { top, left, bottom, right } = getActiveSides(e);
      if (top || left || bottom || right) {
        setResizing({ top, left, bottom, right, resizing: true });
      }
      if (onMouseDownParent) {
        onMouseDownParent(e);
      }
    };

    return resizable && !resizing ? { onMouseMove, onMouseDown } : {};
  }, [onCursorChange, onMouseDownParent, resizable, resizing]);
}

function getActiveSides(e: React.MouseEvent<HTMLElement>) {
  const size = 8;
  const element = e.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const left = x <= size;
  const right = x >= width - size;
  const top = y <= size;
  const bottom = y >= height - size;
  return {
    top, right, bottom, left
  };
}


function getCursor(top: boolean, right: boolean, bottom: boolean, left: boolean): string {
  const cursors = [
    ['nwse-resize', 'ns-resize', 'nesw-resize'],
    ['ew-resize', 'auto', 'ew-resize'],
    ['nesw-resize', 'ns-resize', 'nwse-resize'],
  ];
  const x = left ? 0 : right ? 2 : 1;
  const y = top ? 0 : bottom ? 2 : 1;
  return cursors[y][x];
}
