import { systemService } from '../services/system.service';
import { SystemIcon } from './FileIcon/SystemIcon';

type Props = {
  systemId: string;
  onDoubleClick: () => void;
}

export const System = ({ systemId, onDoubleClick }: Props) => {
  const system = systemService.get(systemId);
  return <SystemIcon label={system.name} img={`${process.env.PUBLIC_URL}/systems/icons/${system.icon || 'missing.png'}`} onDoubleClick={onDoubleClick}/>
};
