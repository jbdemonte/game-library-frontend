import { Box, styled, Typography } from '@mui/material';
import { Part } from './Part';
import { Space } from './Space';
import { FullscreenButton } from './buttons/FullscreenButton';
import { CloseFullscreenButton } from './buttons/CloseFullscreenButton';
import { CloseButton } from './buttons/CloseButton';
import { FC, PointerEventHandler } from 'react';

const StyledHeader = styled(Box)`
  padding: 2px 10px;
  border-bottom: 1px solid #000;
  height: 30px;
  display: flex;
  align-items: center;
`;

type Props = {
  fullscreen: boolean;
  onFullScreenClick: () => void;
  onDoubleClick: () => void;
  onCloseClick: () => void;
  onPointerDown: PointerEventHandler;
}

export const Header: FC<Props> = ({ fullscreen, onFullScreenClick, onDoubleClick, onPointerDown, onCloseClick, children }) => {
  return (
    <StyledHeader onDoubleClick={onDoubleClick} onPointerDown={onPointerDown}>
      <Part><Typography sx={{ fontSize: 14, userSelect: 'none'}}>{children}</Typography></Part>
      <Space />
      <Part>
        { !fullscreen && <FullscreenButton onClick={onFullScreenClick}/> }
        { fullscreen && <CloseFullscreenButton onClick={onFullScreenClick}/> }
        <CloseButton onClick={onCloseClick} />
      </Part>
    </StyledHeader>
  );
}
