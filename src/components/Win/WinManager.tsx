import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { WinContext, WinContextType } from '../../contexts/win.context';
import { guid } from '../../tools/guid';
import { WinManagerContext, WinOptions, WinPayload } from '../../contexts/win-manager.context';

export interface IDescriptor {
  id: string;
  pos: number;
  payload: WinPayload;
  footer: [string, string, string];
}

type Props = {
  render: (payload: WinPayload) => ReactElement;
}

function getMaxPosDescriptor(descriptors: IDescriptor[]): IDescriptor | undefined {
  return descriptors.length ? descriptors.reduce((max, current) => max.pos > current.pos ? max : current) : undefined;
}

function getMaxPos(descriptors: IDescriptor[]): number {
  return getMaxPosDescriptor(descriptors)?.pos || 0;
}

function updateFocusTo(descriptors: IDescriptor[], id: string) {
  const focused = getMaxPosDescriptor(descriptors);
  if (!focused || focused.id === id) {
    return descriptors;
  }
  const max = focused.pos;
  return descriptors.map(descriptor => descriptor.id === id ? {...descriptor, pos: max + 1} : descriptor);
}

export const WinManager: FC<Props> = ({ render, children }) => {
  const [descriptors, setDescriptors] = useState<IDescriptor[]>([]);

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      if (event.key === 'Escape') {
        setDescriptors(descriptors => {
          if (descriptors.length) {
            event.preventDefault();
            const descriptor = descriptors.reduce((previous, current) => previous.pos > current.pos ? previous : current);
            return descriptors.filter(current => current !== descriptor);
          }
          return descriptors;
        });
      }
    }

    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  const winManagerContextValue = useMemo(() => ({
    openNewWindow: (payload: WinPayload, { equals }: WinOptions = {}) => {
      setDescriptors(descriptors => {
        const existing = equals ? descriptors.find(descriptor => equals(payload, descriptor.payload)) : undefined;
        if (existing) {
          return updateFocusTo(descriptors, existing.id);
        }
        // add a new descriptor
        return descriptors.concat([{
          id: guid(),
          pos: 1 + getMaxPos(descriptors),
          payload,
          footer: ['', '', '']
        }]);
      })
    }
  }), []);

  const windowHandlers: Omit<GenericWinProps, 'descriptor' | 'render'> = useMemo(() => ({
    close: (id: string) => {
      setDescriptors(descriptors => descriptors.filter(descriptor => descriptor.id !== id));
    },
    focus: (id: string) => {
      setDescriptors(descriptors => updateFocusTo(descriptors, id));
    },
    setFooter: (id: string, left?: string, center?: string, right?: string) => {
      setDescriptors(descriptors => descriptors.map(descriptor => descriptor.id === id ? { ...descriptor, footer: [left || '', center || '', right || ''] } : descriptor));
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
  close: (id: string) => void;
  focus: (id: string) => void;
  setFooter: (id: string, left?: string, center?: string, right?: string) => void;
  render: (payload: WinPayload) => ReactElement;
}

const GenericWin = ({ descriptor, close, focus, setFooter, render }: GenericWinProps) => {
  const contextValue: WinContextType = useMemo(() => ({
    descriptor,
    close: close.bind(null, descriptor.id),
    focus: focus.bind(null, descriptor.id),
    setFooter: setFooter.bind(null, descriptor.id)
  }), [descriptor, close, focus, setFooter]);
  return (
    <WinContext.Provider key={descriptor.id} value={contextValue}>
      { render(descriptor.payload) }
    </WinContext.Provider>
  );
};
