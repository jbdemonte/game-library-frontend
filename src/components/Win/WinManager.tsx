import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { WinContext, WinContextType } from '../../contexts/win.context';
import { guid } from '../../tools/guid';
import { WinManagerContext, WinOptions, WinPayload } from '../../contexts/win-manager.context';
import { IDescriptor } from './interfaces/descriptor.interface';
import { getMaxZIndex, focusedDescriptor } from './tools/descriptors';
import { removeOneAndSetDescriptors, rotateAndSetDescriptors, updateStateAndSetDescriptors } from './tools/set-descriptors';

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
        updateStateAndSetDescriptors(setDescriptors, { searching: true }, '', (descriptor) => descriptor.options.search && !descriptor.state.searching );
        event.preventDefault();
      }

      if (event.key === 'Escape') {
        const updated = updateStateAndSetDescriptors(setDescriptors, { searching: false, searched: '' }, '', (descriptor) => descriptor.options.search && descriptor.state.searching );
        if (!updated) {
          removeOneAndSetDescriptors(setDescriptors);
        }
        event.preventDefault();
      }

      if (event.key === 'Tab') {
        rotateAndSetDescriptors(setDescriptors, event.shiftKey || event.metaKey ? -1 : 1);
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
          return focusedDescriptor(descriptors, existing.id);
        }
        // add a new descriptor
        return descriptors.concat([{
          id: guid(),
          zIndex: 1 + getMaxZIndex(descriptors),
          payload,
          options,
          state: {},
        }]);
      })
    }
  }), []);

  const windowHandlers: Omit<GenericWinProps, 'descriptor' | 'render'> = useMemo(() => ({
    close: (id: string) => {
      removeOneAndSetDescriptors(setDescriptors, id);
    },
    focus: (id: string) => {
      setDescriptors(descriptors => focusedDescriptor(descriptors, id));
    },
    setFooter: (id: string, left: string = '', center: string = '', right: string = '') => {
      updateStateAndSetDescriptors(setDescriptors, { footer: (left || center || right) ? [left, center, right] : undefined }, id);
    },
    setSearched: (id: string, searched: string = '') => {
      updateStateAndSetDescriptors(setDescriptors, { searched }, id);
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
  setSearched: (id: string, searched: string) => void;
  render: (payload: WinPayload) => ReactElement;
}

const GenericWin = ({ descriptor, close, focus, setFooter, setSearched, render }: GenericWinProps) => {
  const contextValue: WinContextType = useMemo(() => ({
    searching: descriptor.state.searching,
    searched: descriptor.state.searched,
    zIndex: descriptor.zIndex,
    close: close.bind(null, descriptor.id),
    focus: focus.bind(null, descriptor.id),
    footer: descriptor.state.footer ? [...descriptor.state.footer] : undefined,
    setFooter: setFooter.bind(null, descriptor.id),
    setSearched: setSearched.bind(null, descriptor.id)
  }), [descriptor, close, focus, setFooter, setSearched]);
  return (
    <WinContext.Provider key={descriptor.id} value={contextValue}>
      { render(descriptor.payload) }
    </WinContext.Provider>
  );
};
