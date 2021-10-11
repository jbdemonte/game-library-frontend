import { GameData } from '../services/system.service';
import { Win } from './Win/Win';

export type GameWindowData = {
  gameData: GameData;
}

export const GameWindow = ({ gameData }: GameWindowData) => {
  return (
    <Win title={gameData.game.name}>

    </Win>
  )
}
