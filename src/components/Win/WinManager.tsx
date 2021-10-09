import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { WindowContext } from '../../contexts/window.context';

export interface IBaseDescriptor {
  id: string;
  pos: number;
}

type Props<T extends IBaseDescriptor> = {
  descriptors: T[];
  update: (descriptors: T[]) => void
  render: (descriptor: T) => ReactElement;
}

export const WinManager = ({ descriptors, update, render }: Props<any>) => {
  function close(descriptor: IBaseDescriptor) {
    update(descriptors.filter(item => item.id !== descriptor.id));
  }

  function focus(descriptor: IBaseDescriptor) {
    const max = descriptors.reduce((max, item) => Math.max(max, item.pos), 0);
    if (max !== descriptor.pos || max === 0) {
      update(descriptors.map(item => item.id === descriptor.id ? {...item, pos: max + 1 } : item));
    }
  }

  return (
    <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
      { descriptors.map(descriptor => (
          <WindowContext.Provider key={descriptor.id} value={{ descriptor, close: () => close(descriptor), focus: () => focus(descriptor)}}>
            { render(descriptor) }
          </WindowContext.Provider>
        ))
      }
    </Box>
  );
}
