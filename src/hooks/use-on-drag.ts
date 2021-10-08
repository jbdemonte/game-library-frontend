import { PointerEventHandler, useEffect, useMemo, useState } from 'react';

type Props = {
  onDragMove: (e: PointerEvent) => void;
}

export const useOnDrag = ({ onDragMove }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (isDragging) {
        onDragMove(e);
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
  }, [isDragging, onDragMove]);

  return useMemo(() => {
    const onPointerDown: PointerEventHandler = () => {
      setIsDragging(true);
    };
    return { onPointerDown };
  }, []);
}
