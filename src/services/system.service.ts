import { apiService } from './api.service';

export type SystemStatus = {
  system: string;
  games: number;
  roms: number;
  scraps: number;
}

async function getStatuses() {
  const { status } = await apiService.get<{ status: SystemStatus[] }>('systems');
  return status;
}

export const systemService = {
  getStatuses,
};
