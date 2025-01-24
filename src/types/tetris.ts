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
    color: '#40ffff'
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#4040ff'
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#ffc040'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#ffff40'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#40ff40'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#ff40ff'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#ff4040'
  }
} as const;

export type TetrominoType = keyof typeof TETROMINOS;

export const LEVEL_SPEEDS = {
  1: 300,  // Base speed
  2: 250,  // Increased speed
  3: 200,  // Increased speed
  4: 160,  // Increased speed
  5: 130,  // Increased speed
  6: 110,  // Increased speed
  7: 90,   // Increased speed
  8: 80,   // Increased speed
  9: 75,   // Increased speed
  10: 70   // Maximum speed
} as const;
