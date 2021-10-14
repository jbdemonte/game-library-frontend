import { systemService } from '../services/system.service';
import { SystemIcon } from './FileIcon/SystemIcon';
import { useContext } from 'react';
import { systemWindowDataEquals } from './SystemWindow';
import { WinManagerContext } from '../contexts/win-manager.context';

type Props = {
  systemId: string;
}

export const System = ({ systemId }: Props) => {
  const { openNewWindow } = useContext(WinManagerContext);
  const system = systemService.get(systemId);
  return <SystemIcon label={system.name} img={`${process.env.PUBLIC_URL}/systems/icons/${system.icon || 'missing.png'}`} onDoubleClick={() => openNewWindow({ systemId }, { equals: systemWindowDataEquals })}/>
};
