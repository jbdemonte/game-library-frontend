import { Box, styled } from '@mui/material';
import systems from '../data/systems.json';
import { ISystem } from '../interfaces/system.interface';

type Props = {
  system: string;
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

export const System = ({ system: id }: Props) => {
  const system = (systems as ISystem[]).find(system => system.id === id);

  return (
    <StyledBox>
      <div>
        <img
          src={`${process.env.PUBLIC_URL}/systems/icons/${system?.icon || 'missing.png'}`}
          alt={system?.name || id}
        />
      </div>
      <p>
        { system?.name || id }
      </p>
    </StyledBox>
  )
}
