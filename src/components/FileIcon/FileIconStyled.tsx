import { Box, styled } from '@mui/material';

type BoxStyledProps = {
  iconOutSize: number;
  iconSize: number;
};

function boxStyled({ iconOutSize, iconSize }: BoxStyledProps) {
  return  styled(Box)`
    width: 100px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    
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
  img: string;
  onDoubleClick?: () => void;
}

export function FileIconStyled({ iconOutSize, iconSize}: BoxStyledProps) {
  const StyledBox = boxStyled({ iconOutSize, iconSize });
  return ({ img, label, onDoubleClick }: Props) => (
    <StyledBox onDoubleClick={onDoubleClick}>
      <div><img src={img} alt={label} /></div>
      <p>{ label }</p>
    </StyledBox>
  );
}
