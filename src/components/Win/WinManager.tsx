import { Box } from '@mui/material';
import { ReactElement, useState } from 'react';
import { WindowContext } from '../../contexts/window.context';
import { guid } from '../../tools/guid';

export interface IDescriptor<T extends object = {}> {
  id: string;
  pos: number;
  data: T;
}

type Props<T extends object> = {
  descriptors: IDescriptor<T>[];
  setDescriptors: (descriptors: IDescriptor<T>[]) => void
  render: (data: T) => ReactElement;
}

export const useWinManager = <T extends object>() => {
  const [descriptors, setDescriptors] = useState<IDescriptor<T>[]>([]);

  return {
    openNewWindow: (data: T) => {
      const pos = 1 + descriptors.reduce((max, descriptor) => Math.max(descriptor.pos, max), 0);
      setDescriptors(items => [...items, { id: guid(), pos, data }]);
    },
    winManagerProps: {
      descriptors,
      setDescriptors
    }
  }

};

export const WinManager = <T extends object>({ descriptors, setDescriptors, render }: Props<T>) => {
  function close(descriptor: IDescriptor) {
    setDescriptors(descriptors.filter(item => item.id !== descriptor.id));
  }

  function focus(descriptor: IDescriptor) {
    const max = descriptors.reduce((max, item) => Math.max(max, item.pos), 0);
    if (max !== descriptor.pos || max === 0) {
      setDescriptors(descriptors.map(item => item.id === descriptor.id ? {...item, pos: max + 1 } : item));
    }
  }

  return (
    <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
      { descriptors.map(descriptor => (
          <WindowContext.Provider key={descriptor.id} value={{ descriptor, close: () => close(descriptor), focus: () => focus(descriptor)}}>
            { render(descriptor.data) }
          </WindowContext.Provider>
        ))
      }
    </Box>
  );
}
