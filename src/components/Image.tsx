import { CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  style?: CSSProperties | undefined;
  onClick?: () => void
}

export const Image = ({ src, alt, style, onClick }: Props) => (
  <img src={`${src.startsWith('http') ? '' : process.env.REACT_APP_API_URL }${src}`} style={style} alt={alt} onClick={onClick} />
)
