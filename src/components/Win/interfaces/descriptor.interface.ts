import { WinPayload } from '../../../contexts/win-manager.context';

export interface IDescriptor {
  id: string;
  zIndex: number;
  payload: WinPayload;
  options: {
    search?: boolean;
  };
  state: {
    footer?: [string, string, string];
    searching?: boolean;
    searched?: string;
  }
}
