import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  alt: string;
  size: number;
}

const compatible = 'IntersectionObserver' in window;

export const LazyImage = ({ src, alt, size }: Props) => {
  const [visible, setVisible] = useState<boolean>(!compatible);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!visible && ref.current) {
      const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
        if (intersectionRatio > 0) {
          setVisible(true);
        }
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [visible, ref]);

  return <img ref={ref} src={visible ? src : ''} alt={alt} style={visible ? undefined : { opacity: 0, width: size, height: size}} />;
}
