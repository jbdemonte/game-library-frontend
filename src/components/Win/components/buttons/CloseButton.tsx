import { styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const CloseButton = styled(CloseIcon)`
  color: #fa5e57;
  background: #fa5e57;
  border-radius: 100px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #fa5e57;

  &:hover {
    color: #730a00;
    border-color: #e14039;
  }
`;
