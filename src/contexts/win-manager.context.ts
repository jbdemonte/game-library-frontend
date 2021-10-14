import { createContext } from 'react';
import { SystemWindowData } from '../components/SystemWindow';
import { GameWindowData } from '../components/GameWindow';

export type WinPayload = SystemWindowData | GameWindowData;

export type WinPayloadEqualFunction = (payloadA: WinPayload, payloadB: WinPayload) => boolean;

type WindowManagerContextType = {
  openNewWindow: (payload: WinPayload, equals?: WinPayloadEqualFunction) => void;
}

export const WinManagerContext = createContext<WindowManagerContextType>({
  openNewWindow: () => {},
});
