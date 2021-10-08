import { apiService } from './api.service';
import systems from '../data/systems.json';
import { ISystem } from '../interfaces/system.interface';

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

export const systemService = {
  get: getSystem,
  getStatuses,
};
