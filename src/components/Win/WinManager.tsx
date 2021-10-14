import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { Box } from '@mui/material';
import { WindowContext, WinPayload } from '../../contexts/window.context';
import { guid } from '../../tools/guid';

export interface IDescriptor {
  id: string;
  pos: number;
  data: WinPayload;
  footer: [string, string, string];
}

type Props = {
  descriptors: IDescriptor[];
  setDescriptors: Dispatch<SetStateAction<IDescriptor[]>>;
  openNewWindow: (data: WinPayload) => void;
  render: (data: WinPayload) => ReactElement;
}

export const useWinManager = () => {
  const [descriptors, setDescriptors] = useState<IDescriptor[]>([]);

  const openNewWindow = (data: WinPayload) => {
    const pos = 1 + descriptors.reduce((max, descriptor) => Math.max(descriptor.pos, max), 0);
    setDescriptors(items => [...items, { id: guid(), pos, data, footer: ['', '', ''] }]);
  };

  return {
    descriptors,
    setDescriptors,
    openNewWindow,
  }
};

export const WinManager = ({ descriptors, setDescriptors, openNewWindow, render }: Props) => {
  function close(descriptor: IDescriptor) {
    setDescriptors(descriptors => descriptors.filter(item => item.id !== descriptor.id));
  }

  function focus(descriptor: IDescriptor) {
    const max = descriptors.reduce((max, item) => Math.max(max, item.pos), 0);
    if (max !== descriptor.pos || max === 0) {
      setDescriptors(descriptors => descriptors.map(item => item.id === descriptor.id ? {...item, pos: max + 1 } : item));
    }
  }

  function setFooter(descriptor: IDescriptor, left?: string, center?: string, right?: string) {
    setDescriptors(descriptors => descriptors.map(item => item.id === descriptor.id ? { ...descriptor, footer: [left || '', center || '', right || ''] } : item));
  }

  return (
    <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
      { descriptors.map(descriptor => (
          <WindowContext.Provider key={descriptor.id} value={{ descriptor, close: () => close(descriptor), focus: () => focus(descriptor), openNewWindow, setFooter: setFooter.bind(null, descriptor) }}>
            { render(descriptor.data) }
          </WindowContext.Provider>
        ))
      }
    </Box>
  );
}
