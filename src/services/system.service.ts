import { apiService } from './api.service';
import systems from '../data/systems.json';
import { ISystem } from '../interfaces/system.interface';
import { IGame } from '../interfaces/game.interface';
import { IRom } from '../interfaces/rom.interface';

export type SystemStatus = {
  system: string;
  games: number;
  roms: number;
  scraps: number;
}

function getSystem(id: string): ISystem {
  const system = (systems as ISystem[]).find(system => system.id === id);
  if (!system) {
    return {
      id,
      name: id,
      section: 'others',
    }
  }
  return system;
}

async function getStatuses() {
  const { status } = await apiService.get<{ status: SystemStatus[] }>('systems');
  return status;
}

export type ScrapedGame = {
  game: IGame;
  roms: IRom[];
}

function getSystemContent(systemId: string ) {
  return apiService.get<{ scraped: ScrapedGame[], roms: IRom[]}>(`systems/${systemId}`)
}

export const systemService = {
  get: getSystem,
  getStatuses,
  getSystemContent,
};
