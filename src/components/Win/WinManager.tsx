import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { WinContext, WinContextType } from '../../contexts/win.context';
import { guid } from '../../tools/guid';
import { WinManagerContext, WinOptions, WinPayload } from '../../contexts/win-manager.context';

interface IDescriptor {
  id: string;
  pos: number;
  payload: WinPayload;
  footer?: [string, string, string];
  options: {
    search?: boolean;
  };
  state: {
    searching?: boolean;
    searched?: string;
  }
}

type Props = {
  render: (payload: WinPayload) => ReactElement;
}

function getMaxPosDescriptor(descriptors: IDescriptor[]): IDescriptor {
  if (!descriptors.length) {
    throw new Error('empty descriptor list');
  }
  return descriptors.reduce((max, current) => max.pos > current.pos ? max : current);
}

function getMaxPos(descriptors: IDescriptor[]): number {
  return descriptors.length ? getMaxPosDescriptor(descriptors).pos : 0;
}

function updateFocusTo(descriptors: IDescriptor[], id: string) {
  const focused = getMaxPosDescriptor(descriptors);
  if (focused.id === id) {
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

      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
        setDescriptors(descriptors => {
          if (descriptors.length) {
            event.preventDefault();
            const descriptor = getMaxPosDescriptor(descriptors);
            if (descriptor.options.search) {
              return descriptors.map(item => item === descriptor ? {...descriptor, state: {...descriptor.state, searching: true}} : item);
            }
          }
          return descriptors;
        });
      }

      if (event.key === 'Escape') {
        setDescriptors(descriptors => {
          if (descriptors.length) {
            event.preventDefault();
            const descriptor = getMaxPosDescriptor(descriptors);
            if (descriptor.state.searching) {
              return descriptors.map(item => item === descriptor ? {...descriptor, state: {...descriptor.state, searching: false, searched: ''}} : item);
            }
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
    openNewWindow: (payload: WinPayload, { equals, ...options }: WinOptions = {}) => {
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
          options,
          state: {},
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
    setFooter: (id: string, left: string = '', center: string = '', right: string = '') => {
      setDescriptors(descriptors => descriptors.map(descriptor => descriptor.id === id ? { ...descriptor, footer: (left || center || right) ? [left, center, right] : undefined } : descriptor));
    },
    setSearch: (id: string, searched: string = '') => {
      setDescriptors(descriptors => descriptors.map(descriptor => descriptor.id === id ? { ...descriptor, state: {...descriptor.state, searched} } : descriptor));
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
  setSearch: (id: string, searched: string) => void;
  render: (payload: WinPayload) => ReactElement;
}

const GenericWin = ({ descriptor, close, focus, setFooter, setSearch, render }: GenericWinProps) => {
  const contextValue: WinContextType = useMemo(() => ({
    searching: descriptor.state.searching,
    searched: descriptor.state.searched,
    zIndex: descriptor.pos,
    close: close.bind(null, descriptor.id),
    focus: focus.bind(null, descriptor.id),
    footer: descriptor.footer ? descriptor.footer.slice() as [string, string, string] : undefined,
    setFooter: setFooter.bind(null, descriptor.id),
    setSearch: setSearch.bind(null, descriptor.id)
  }), [descriptor, close, focus, setFooter, setSearch]);
  return (
    <WinContext.Provider key={descriptor.id} value={contextValue}>
      { render(descriptor.payload) }
    </WinContext.Provider>
  );
};
