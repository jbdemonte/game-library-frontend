import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { WinContext, WinContextType } from '../../contexts/win.context';
import { guid } from '../../tools/guid';
import { WinManagerContext, WinOptions, WinPayload } from '../../contexts/win-manager.context';
import { IDescriptor } from './interfaces/descriptor.interface';
import { getMaxPos } from './descriptors-tools/position';
import { setMaxPosTo } from './tools/descriptors';
import { setMaxPosSearching } from './descriptors-tools/search';
import { removeMaxPosDescriptor } from './descriptors-tools/window';

type Props = {
  render: (payload: WinPayload) => ReactElement;
}

export const WinManager: FC<Props> = ({ render, children }) => {
  const [descriptors, setDescriptors] = useState<IDescriptor[]>([]);

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      // command + F or ctrl + F
      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
        setMaxPosSearching(setDescriptors, true);
        event.preventDefault();
      }

      if (event.key === 'Escape') {
        const updated = setMaxPosSearching(setDescriptors, false);
        if (!updated) {
          removeMaxPosDescriptor(setDescriptors);
        }
        event.preventDefault();
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
          return setMaxPosTo(descriptors, existing.id);
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
      setDescriptors(descriptors => setMaxPosTo(descriptors, id));
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
