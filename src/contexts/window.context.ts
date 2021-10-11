import { createContext } from 'react';
import { IDescriptor } from '../components/Win/WinManager';
import { SystemWindowData } from '../components/SystemWindow';
import { GameWindowData } from '../components/GameWindow';

export type WinPayload = SystemWindowData | GameWindowData;

type WindowContextType = {
  descriptor: IDescriptor;
  close: () => void;
  focus: () => void;
  openNewWindow: (data: WinPayload) => void;
}

export const WindowContext = createContext<WindowContextType>({
  descriptor: { id: '123', pos: 1, data: { systemId: 'nes'} },
  close: () => {},
  focus: () => {},
  openNewWindow: () => {},
})
