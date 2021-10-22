import { useCallback, useContext, useState } from 'react';
import { systemService } from '../services/system.service';
import { SystemIcon } from './FileIcon/SystemIcon';
import { systemWindowDataEquals } from './SystemWindow';
import { WinManagerContext } from '../contexts/win-manager.context';
import { useOnDrag } from '../hooks/use-on-drag';

type Props = {
  systemId: string;
}

export const System = ({ systemId }: Props) => {
  const { openNewWindow } = useContext(WinManagerContext);

  const [{ top, left }, setProperties] = useState({ top: 0, left: 0 });

  const onDragMove = useCallback((e: MouseEvent) => {
    setProperties(props => ({ top: props.top + e.movementY, left: props.left + e.movementX }))
  }, []);

  const onDoubleClick = useCallback(() => openNewWindow({ systemId }, { equals: systemWindowDataEquals, search: true }), [openNewWindow, systemId]);

  const system = systemService.get(systemId);
  return (
    <SystemIcon
      sx={{ position: 'relative', top, left }}
      label={system.name}
      img={`${process.env.PUBLIC_URL}/systems/icons/${system.icon || 'missing.png'}`}
      onDoubleClick={onDoubleClick}
      {...useOnDrag({ onDragMove })}
    />
  )
};
