import { createContext } from 'react';
import { SystemWindowData } from '../components/SystemWindow';
import { GameWindowData } from '../components/GameWindow';

export type WinPayload = SystemWindowData | GameWindowData;

export type WinPayloadEqualFunction = (payloadA: WinPayload, payloadB: WinPayload) => boolean;

export type WinOptions = {
  equals?: WinPayloadEqualFunction;
}

type WindowManagerContextType = {
  openNewWindow: (payload: WinPayload, options?: WinOptions) => void;
}

export const WinManagerContext = createContext<WindowManagerContextType>({
  openNewWindow: () => {},
});
