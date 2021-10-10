export interface IMedia {
  type: string;
  region: string;
  url: string;
}

export interface IGame {
  name: string;
  genres: string[];
  medias: IMedia[];
  synopsis: string;
  players: number;
  id: string;
}
