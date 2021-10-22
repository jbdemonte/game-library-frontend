import { memo, PointerEventHandler } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { FullscreenButton } from './buttons/FullscreenButton';
import { CloseFullscreenButton } from './buttons/CloseFullscreenButton';
import { CloseButton } from './buttons/CloseButton';

const StyledHeader = styled(Box)`
  padding: 2px 10px;
  border-bottom: 1px solid #000;
  height: 30px;
  display: flex;
  align-items: center;
  
  > div {
    display: flex;
    align-items: center;
  }
  
  > div:first-of-type {
    font-size: 14px;
    user-select: none;
    max-width: 80%;
    img {
      max-height: 18px;
      width: auto;
      vertical-align: middle;
      margin-right: 5px;
    }
    * {
      font-size: 14px;
    }
  }
  
  > div:nth-of-type(2) {
    flex-grow: 1;
  }
  
  > div:last-of-type {
    gap: 10px;
  }
`;

type Props = {
  img?: string;
  title: string;
  fullscreen: boolean;
  onFullScreenClick: () => void;
  onDoubleClick: () => void;
  onCloseClick: () => void;
  onPointerDown: PointerEventHandler;
}

export const Header = memo(({ img, title, fullscreen, onFullScreenClick, onDoubleClick, onPointerDown, onCloseClick }: Props) => {
  return (
    <StyledHeader onDoubleClick={onDoubleClick} onPointerDown={onPointerDown}>
      <div>
        {Boolean(img) && <img src={img} alt={title} />}
        <Typography noWrap>{title}</Typography>
      </div>
      <div />
      <div>
        { !fullscreen && <FullscreenButton onClick={onFullScreenClick}/> }
        { fullscreen && <CloseFullscreenButton onClick={onFullScreenClick}/> }
        <CloseButton onClick={onCloseClick} />
      </div>
    </StyledHeader>
  );
});
