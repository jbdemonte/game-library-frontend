import { FC, ReactElement, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { WinContext, WinContextType } from '../../contexts/win.context';
import { guid } from '../../tools/guid';
import { WinManagerContext, WinPayload, WinPayloadEqualFunction } from '../../contexts/win-manager.context';

export interface IDescriptor {
  id: string;
  pos: number;
  payload: WinPayload;
  footer: [string, string, string];
}

type Props = {
  render: (payload: WinPayload) => ReactElement;
}

function getMaxPosition(descriptors: IDescriptor[]) {
  return descriptors.reduce((max, descriptor) => Math.max(descriptor.pos, max), 0);
}

function updateFocusTo(descriptors: IDescriptor[], descriptor: IDescriptor) {
  const max = getMaxPosition(descriptors);
  return descriptor.pos === max ? descriptors : descriptors.map(item => item.id === descriptor.id ? {...item, pos: max + 1} : item);

}

export const WinManager: FC<Props> = ({ render, children }) => {
  const [descriptors, setDescriptors] = useState<IDescriptor[]>([]);

  const winManagerContextValue = useMemo(() => ({
    openNewWindow: (payload: WinPayload, equals?: WinPayloadEqualFunction) => {
      setDescriptors(descriptors => {
        const existing = equals ? descriptors.find(descriptor => equals(payload, descriptor.payload)) : undefined;
        if (existing) {
          return updateFocusTo(descriptors, existing);
        }
        // add a new descriptor
        return descriptors.concat([{
          id: guid(),
          pos: 1 + getMaxPosition(descriptors),
          payload,
          footer: ['', '', '']
        }]);
      })
    }
  }), []);

  const windowHandlers: Omit<GenericWinProps, 'descriptor' | 'render'> = useMemo(() => ({
    close: (descriptor: IDescriptor) => {
      setDescriptors(descriptors => descriptors.filter(item => item.id !== descriptor.id));
    },
    focus: (descriptor: IDescriptor) => {
      setDescriptors(descriptors => updateFocusTo(descriptors, descriptor));
    },
    setFooter: (descriptor: IDescriptor, left?: string, center?: string, right?: string) => {
      setDescriptors(descriptors => descriptors.map(item => item.id === descriptor.id ? { ...descriptor, footer: [left || '', center || '', right || ''] } : item));
    },
  }), []);

  return (
    <WinManagerContext.Provider value={winManagerContextValue}>
      { children }
      <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'transparent', pointerEvents: 'none'}}>
        { descriptors.map(descriptor => <GenericWin key={descriptor.id} descriptor={descriptor} render={render} {...windowHandlers} />) }
      </Box>
    </WinManagerContext.Provider>
  );
}

type GenericWinProps = {
  descriptor: IDescriptor;
  close: (descriptor: IDescriptor) => void;
  focus: (descriptor: IDescriptor) => void;
  setFooter: (descriptor: IDescriptor, left?: string, center?: string, right?: string) => void;
  render: (payload: WinPayload) => ReactElement;
}

const GenericWin = ({ descriptor, close, focus, setFooter, render }: GenericWinProps) => {
  const contextValue: WinContextType = useMemo(() => ({
    descriptor,
    close: close.bind(null, descriptor),
    focus: focus.bind(null, descriptor),
    setFooter: setFooter.bind(null, descriptor)
  }), [descriptor, close, focus, setFooter]);
  return (
    <WinContext.Provider key={descriptor.id} value={contextValue}>
      { render(descriptor.payload) }
    </WinContext.Provider>
  );
}
