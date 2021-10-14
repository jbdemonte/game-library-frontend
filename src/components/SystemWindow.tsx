import { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { ScrapedGame, systemService } from '../services/system.service';
import { Win } from './Win/Win';
import { Loading } from './Loading';
import { Game } from './Game';
import { ToastContext } from '../contexts/toast.context';
import { IRom } from '../interfaces/rom.interface';
import { Rom } from './Rom';
import { gameWindowDataEquals } from './GameWindow';
import { WinManagerContext, WinPayload } from '../contexts/win-manager.context';
import { formatFileSize } from '../tools/file';

export type SystemWindowData = {
  systemId: string;
}

export const isSystemWindowData = (data: any): data is SystemWindowData => {
  return data.hasOwnProperty('systemId');
}

export function systemWindowDataEquals(payloadA: WinPayload, payloadB: WinPayload) {
  return isSystemWindowData(payloadA) && isSystemWindowData(payloadB) && payloadA.systemId === payloadB.systemId;
}

function sumRomSizes(roms: IRom[]): number {
  return roms.reduce((sum, rom) => sum + rom.archive.size, 0);
}

export const SystemWindow = ({ systemId }: SystemWindowData) => {
  const system = systemService.get(systemId);
  const [content, setContent] = useState<{ scraped: ScrapedGame[], roms: IRom[] }>();
  const { showError } = useContext(ToastContext);
  const { openNewWindow } = useContext(WinManagerContext);

  useEffect(() => {
    systemService
      .getSystemContent(systemId)
      .then(setContent)
      .catch(showError)
  }, [systemId, showError]);

  const footer: [string, string, string] = useMemo(() => {
    if (content) {
      const romCount = content.scraped.reduce((sum, scraped) => sum + scraped.roms.length, 0) + content.roms.length;
      const totalSize =  content.scraped.reduce((sum, scraped) => sum + sumRomSizes(scraped.roms), 0) + sumRomSizes(content.roms);

      const gameCountLabel = content.scraped.length > 1 ? `${content.scraped.length} scraped games` : (content.scraped.length ? '1 scraped game' : '');
      const unknownGameLabel = content.roms.length > 1 ? `${content.roms.length} unknown games` : (content.roms.length ? '1 unknown game' : '');

      return [
        `${gameCountLabel}${gameCountLabel && unknownGameLabel ? ', ' : ''}${unknownGameLabel}`,
        '',
        `Total: ${romCount > 1 ? `${romCount} roms, ` : romCount === 1 ? '1 rom, ' : ''}${formatFileSize(totalSize)}`
      ]

    }
    return ['', 'loading', ''];

  }, [content]);

  return (
    <Win title={system.name} footer={footer}>
      { content ? (
        <Box sx={{ position: 'absolute', inset: 1, overflow: 'auto', p: 2 }}>
          <Grid container direction="row" spacing={1}>
            { content.scraped.map((gameData) => <Game key={gameData.game.id} data={gameData} onDoubleClick={() => openNewWindow({ gameData }, { equals: gameWindowDataEquals })} />)}
            { content.roms.map((rom) => <Rom key={rom.id} rom={rom} />)}
          </Grid>
        </Box>
      ) : <Loading /> }
    </Win>
  )
};
