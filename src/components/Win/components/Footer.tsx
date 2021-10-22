import { memo } from 'react';
import { Box, styled, Typography } from '@mui/material';

export const StyledBox = styled(Box)`
  padding: 2px 10px;
  border-top: 1px solid #000;
  height: 30px;
  background: #202122;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  display: flex;;
  font-size: 12px;
  align-items: center;
  
  * {
    font-size: 12px;
  }
  
  > *:first-of-type {
    text-align: left;
    max-width: 35%;
  }
  
  > *:nth-of-type(2) {
    text-align: center;
    flex-grow: 1;
  }
  
  > *:last-of-type {
    text-align: right;
    max-width: 25%;
  }
`;

export const Footer = memo(({ content }: { content?: [string, string, string]}) => {
  return (
    <StyledBox>
      {content && content.map((value, index) => <Typography key={index} noWrap>{value}</Typography>) }
    </StyledBox>
  );
});
