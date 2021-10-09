import React, { PointerEventHandler, useMemo, useState, useEffect } from 'react';



type Props = {
  onCursorChange: (cursor: string) => void;
  onResize: (offset: { top: number, left: number, bottom: number, right: number }) => void;
  onChange: (resizing: boolean) => void;
}

export const useOnResize = ({ onCursorChange, onResize, onChange }: Props) => {
  const [, setCursor] = useState('auto');
  const [{ top, left, bottom, right, resizing }, setResizing] = useState({ top: false, left: false, bottom: false, right: false, resizing: false });

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (resizing) {
        onResize({
          top: top ? e.movementY : 0,
          left: left ? e.movementX : 0,
          bottom: bottom ? e.movementY : 0,
          right: right ? e.movementX : 0,
        });
        e.preventDefault();
      }
    }
    function onPointerUp() {
      setResizing(previous => {
        if (previous.resizing) {
          onChange(false);
        }
        return { top: false, left: false, bottom: false, right: false, resizing: false };
      });
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [resizing, top, left, bottom, right, onChange, onResize]);

  return useMemo(() => {
    const onPointerMove: PointerEventHandler<HTMLElement> = (e: React.PointerEvent<HTMLElement>) => {
      const { top, left, bottom, right } = getActiveSides(e);
      const cursor = getCursor(top, right, bottom, left);
      setCursor(current => {
        if (current !== cursor) {
          onCursorChange(cursor);
        }
        return cursor;
      });

    };

    const onPointerDown: PointerEventHandler = (e: React.PointerEvent<HTMLElement>) => {
      const { top, left, bottom, right } = getActiveSides(e);
      if (top || left || bottom || right) {
        setResizing({ top, left, bottom, right, resizing: true });
        onChange(true);
      }
    };

    return {
      onPointerMove,
      onPointerDown,
    }
  }, [onCursorChange, onChange]);
}

function getActiveSides(e: React.PointerEvent<HTMLElement>) {
  const size = 5;
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
