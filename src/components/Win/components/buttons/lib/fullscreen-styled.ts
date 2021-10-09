import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { styled } from '@mui/material';

export function fullscreenStyled(icon: OverridableComponent<SvgIconTypeMap>) {
  return styled(icon)`
  color: #28c941;
  background: #28c941;
  border-radius: 100px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 1px solid #28c941;
  padding: 1px;

  &:hover {
    color: #046201;
    border-color: #13aa27;
  }
`;
}
