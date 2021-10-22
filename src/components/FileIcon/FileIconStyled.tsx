import { ElementType, createElement } from 'react';
import { Box, styled, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { LazyImage } from '../LazyImage';

type BoxStyledProps = {
  iconOutSize: number;
  iconSize: number;
  icon?: ElementType;
};

function boxStyled({ iconOutSize, iconSize }: BoxStyledProps) {
  return  styled(Box)`
    width: 100px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    
    div {
      width: ${iconOutSize}px;
      height: ${iconOutSize}px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
      margin-bottom: 2px;
    }
    
    img {
      max-width: ${iconSize}px;
      max-height: ${iconSize}px;
    }
    
    svg {
      width: ${iconSize}px;
      height: ${iconSize}px;
    }
    
    p {
      font-size: 12px;
      text-align: center;
      margin: 0;
      border-radius: 3px;
      padding: 0 5px;
    }
    
    &:hover {
      p, div {
        background: #414244;
      }
    }
  `;
}

type Props = {
  label: string;
  img?: string;
  sx?: SxProps<Theme>;
  onDoubleClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

export function FileIconStyled({ icon, iconOutSize, iconSize }: BoxStyledProps) {
  const StyledBox = boxStyled({ iconOutSize, iconSize });
  return ({ img, label, ...props }: Props) => (
    <StyledBox {...props}>
      <div>
        { img ? <LazyImage src={img} alt={label} size={iconSize} /> : null }
        { icon && createElement(icon) }
      </div>
      <p>{ label }</p>
    </StyledBox>
  );
}
