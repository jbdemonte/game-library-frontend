import { createContext } from 'react';
import { IDescriptor } from '../components/Win/WinManager';

type WindowContextType = {
  descriptor: IDescriptor;
  close: () => void;
  focus: () => void;
}

export const WindowContext = createContext<WindowContextType>({
  descriptor: { id: '123', pos: 1, data: {} },
  close: () => {},
  focus: () => {},
})
