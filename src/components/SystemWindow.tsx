import { systemService } from '../services/system.service';
import { Win } from './Win/Win';

type Props = {
  systemId: string;
}

export const SystemWindow = ({ systemId }: Props) => {
  const system = systemService.get(systemId);
  return (
    <Win title={system.name} />
  )
};
