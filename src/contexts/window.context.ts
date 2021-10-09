import { createContext } from 'react';
import { IBaseDescriptor } from '../components/Win/WinManager';

type WindowContextType = {
  descriptor: IBaseDescriptor;
  close: () => void;
  focus: () => void;
}

export const WindowContext = createContext<WindowContextType>({
  descriptor: { id: '123', pos: 1 },
  close: () => {},
  focus: () => {},
})
