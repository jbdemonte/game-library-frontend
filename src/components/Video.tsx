import { CSSProperties, forwardRef } from 'react';

type Props = {
  url: string,
  style?: CSSProperties | undefined;
}

export const Video = forwardRef<HTMLVideoElement, Props>(({ url, style }, ref) => {
  return (
    <video ref={ref} style={style} controls autoPlay>
      <source src={url} type={`video/${url.split('.').pop()}`} />
    </video>
  );
});
