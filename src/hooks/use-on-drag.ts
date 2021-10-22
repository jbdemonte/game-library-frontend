import { MouseEventHandler, useEffect, useMemo, useState } from 'react';

type Props = {
  draggable?: boolean;
  onDragMove: (e: MouseEvent) => void;
}

export const useOnDrag = ({ onDragMove, draggable = true }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (isDragging && draggable) {
        onDragMove(e);
        e.preventDefault();
      }
    }
    function onMouseUp() {
      setIsDragging(false);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onDragMove, draggable]);

  return useMemo(() => {
    const onMouseDown: MouseEventHandler = () => {
      setIsDragging(true);
    };
    return { onMouseDown };
  }, []);
}
