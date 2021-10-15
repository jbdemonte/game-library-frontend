import { Box, styled } from '@mui/material';

export const Footer = styled(Box)`
  padding: 2px 10px;
  border-top: 1px solid #000;
  height: 30px;
  background: #202122;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  display: flex;;
  font-size: 12px;
  align-items: center;
  
  > span:first-of-type {
    text-align: left;
  }
  
  > span:nth-of-type(2) {
    text-align: center;
    flex-grow: 1;
  }
  
  > span:last-of-type {
    text-align: right;
  }
`;
