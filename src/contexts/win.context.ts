import { createContext } from 'react';
import { IDescriptor } from '../components/Win/WinManager';

type WinContextType = {
  descriptor: IDescriptor;
  close: () => void;
  focus: () => void;
  setFooter: (left?: string, center?: string, right?: string) => void;
}

export const WinContext = createContext<WinContextType>({
  descriptor: { id: '', pos: 1, payload: { systemId: ''}, footer: ['', '', ''] },
  close: () => {},
  focus: () => {},
  setFooter: () => {},
});
