import { WinPayload } from '../../../contexts/win-manager.context';

export interface IDescriptor {
  id: string;
  pos: number;
  payload: WinPayload;
  footer?: [string, string, string];
  options: {
    search?: boolean;
  };
  state: {
    searching?: boolean;
    searched?: string;
  }
}
