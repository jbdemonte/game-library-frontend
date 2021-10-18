export interface IMedia {
  type: string;
  region: string;
  url: string;
}

export interface IGame {
  id: string;
  name: string;
  genres: string[];
  medias: IMedia[];
  synopsis: string;
  players: number;
  grade?: number;
  date?: string;
}
