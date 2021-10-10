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
    throw new Error(`unknown system ${id}`);
  }
  return system;
}

async function getStatuses() {
  const { status } = await apiService.get<{ status: SystemStatus[] }>('systems');
  return status;
}

export type GameData = {
  game: IGame;
  roms: IRom[];
}

async function getSystemGameData(systemId: string ): Promise<GameData[]> {
  const { items } = await apiService.get<{ items: GameData[]}>(`systems/${systemId}`)
  return items;
}

export const systemService = {
  get: getSystem,
  getStatuses,
  getSystemGameData,
};
