import { PointerEventHandler, useEffect, useMemo, useState } from 'react';

type Props = {
  draggable?: boolean;
  onDragMove: (e: PointerEvent) => void;
}

export const useOnDrag = ({ onDragMove, draggable }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (isDragging && draggable) {
        onDragMove(e);
        e.preventDefault();
      }
    }
    function onPointerUp() {
      setIsDragging(false);
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, onDragMove, draggable]);

  return useMemo(() => {
    const onPointerDown: PointerEventHandler = () => {
      setIsDragging(true);
    };
    return { onPointerDown };
  }, []);
}
