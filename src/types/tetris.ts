export interface Position {
  x: number;
  y: number;
}

export interface TetrisPiece {
  shape: number[][];
  color: string;
}

export interface GameState {
  board: string[][];
  currentPiece: TetrisPiece;
  currentPosition: Position;
  nextPiece: TetrisPiece;
  savedPiece: TetrisPiece | null;
  canSavePiece: boolean;
  score: number;
  isGameOver: boolean;
  level: number;
  lastKeyPressTime: { [key: string]: number };
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0'
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#0000f0'
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#f0a000'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#f0f000'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00f000'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#a000f0'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#f00000'
  }
} as const;

export type TetrominoType = keyof typeof TETROMINOS;

export const LEVEL_SPEEDS = {
  1: 800,
  2: 700,
  3: 600,
  4: 500,
  5: 400,
  6: 300,
  7: 250,
  8: 200,
  9: 150,
  10: 100
};
