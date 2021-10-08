import { Box, styled } from '@mui/material';
import { systemService } from '../services/system.service';

type Props = {
  systemId: string;
  onDoubleClick: () => void;
}

const StyledBox = styled(Box)`
  width: 100px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  div {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    margin-bottom: 2px;
  }
  
  img {
    height: 32px;
  }
  
  p {
    font-size: 12px;
    text-align: center;
    margin: 0;
    border-radius: 3px;
  }
  
  &:hover {
    p, div {
      background: #414244;
    }
  }
`;

export const System = ({ systemId, onDoubleClick }: Props) => {
  const system = systemService.get(systemId);

  return (
    <StyledBox onDoubleClick={onDoubleClick}>
      <div>
        <img
          src={`${process.env.PUBLIC_URL}/systems/icons/${system.icon || 'missing.png'}`}
          alt={system.name}
        />
      </div>
      <p>
        { system.name }
      </p>
    </StyledBox>
  )
}
