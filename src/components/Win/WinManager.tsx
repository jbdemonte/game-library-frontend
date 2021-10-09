import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { WindowContext } from '../../contexts/window.context';

type Props<T extends { id: string }> = {
  descriptors: T[];
  update: (descriptors: T[]) => void
  render: (descriptor: T) => ReactElement;
}

export const WinManager = ({ descriptors, update, render }: Props<any>) => {
  function close(descriptor: any) {
    update(descriptors.filter(item => item.id !== descriptor.id));
  }

  return (
    <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
      { descriptors.map(descriptor => (
          <WindowContext.Provider key={descriptor.id} value={{ descriptor, close: () => close(descriptor)}}>
            { render(descriptor) }
          </WindowContext.Provider>
        ))
      }
    </Box>
  );
}
