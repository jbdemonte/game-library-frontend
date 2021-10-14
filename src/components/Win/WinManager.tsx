import { FC, ReactElement, useState } from 'react';
import { Box } from '@mui/material';
import { WinContext  } from '../../contexts/win.context';
import { guid } from '../../tools/guid';
import { WinManagerContext, WinPayload } from '../../contexts/win-manager.context';

export interface IDescriptor {
  id: string;
  pos: number;
  payload: WinPayload;
  footer: [string, string, string];
}

type Props = {
  render: (payload: WinPayload) => ReactElement;
}

export const WinManager: FC<Props> = ({ render, children }) => {
  const [descriptors, setDescriptors] = useState<IDescriptor[]>([]);

  const openNewWindow = (payload: WinPayload) => {
    const pos = 1 + descriptors.reduce((max, descriptor) => Math.max(descriptor.pos, max), 0);
    setDescriptors(items => [...items, { id: guid(), pos, payload, footer: ['', '', ''] }]);
  };

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
    <WinManagerContext.Provider value={{ openNewWindow }}>
      { children }
      <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
        { descriptors.map(descriptor => (
            <WinContext.Provider key={descriptor.id} value={{ descriptor, close: () => close(descriptor), focus: () => focus(descriptor), setFooter: setFooter.bind(null, descriptor) }}>
              { render(descriptor.payload) }
            </WinContext.Provider>
          ))
        }
      </Box>
    </WinManagerContext.Provider>
  );
}
