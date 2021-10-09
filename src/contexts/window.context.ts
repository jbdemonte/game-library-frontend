import { createContext } from 'react';

type WindowContextType = {
  descriptor: { id: number };
  close: () => void;
}

export const WindowContext = createContext<WindowContextType>({
  descriptor: { id: 0 },
  close: () => {},
})
