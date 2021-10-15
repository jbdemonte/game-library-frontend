import { createContext } from 'react';

export type WinContextType = {
  zIndex: number;
  footer?: [string, string, string];
  close: () => void;
  focus: () => void;
  setFooter: (left?: string, center?: string, right?: string) => void;
}

export const WinContext = createContext<WinContextType>({
  zIndex: 0,
  close: () => {},
  focus: () => {},
  setFooter: () => {},
});
