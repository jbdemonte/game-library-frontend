import { createContext } from 'react';
import { SystemWindowData } from '../components/SystemWindow';
import { GameWindowData } from '../components/GameWindow';

export type WinPayload = SystemWindowData | GameWindowData;

type WindowManagerContextType = {
  openNewWindow: (payload: WinPayload) => void;
}

export const WinManagerContext = createContext<WindowManagerContextType>({
  openNewWindow: () => {},
});
