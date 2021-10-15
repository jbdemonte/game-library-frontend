import { ChangeEvent } from 'react';
import { Box, InputAdornment, styled, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledBox = styled(Box)`
  position: absolute;
  bottom: 0; 
  right: 0;
  padding: 4px 20px 8px 12px;
  border-top-right-radius: 10px;
  display: flex;
  align-items: flex-end;
  width: 350px;
  max-width: 100%;
  > div {
    background-color: #383838;
    border-radius: 4px;
  }
`;

export const Search = ({ onChange }: { onChange: (e: ChangeEvent<HTMLInputElement>) => void}) => (
  <StyledBox>
    <TextField
      label="Search"
      variant="outlined"
      autoFocus
      fullWidth
      color='primary'
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={onChange}
    />
  </StyledBox>
);
