export interface GameBoardProps {
  style?: React.CSSProperties;
}

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
  I1: {
    shape: [[1, 1, 1, 1]],
    color: '#40ffff'
  },
  I2: {
    shape: [[1, 1, 1, 1]],
    color: '#00cccc'
  },
  J1: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#4040ff'
  },
  J2: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#0000cc'
  },
  L1: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#ffc040'
  },
  L2: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#cc9933'
  },
  O1: {
    shape: [[1, 1], [1, 1]],
    color: '#ffff40'
  },
  O2: {
    shape: [[1, 1], [1, 1]],
    color: '#cccc00'
  },
  S1: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#40ff40'
  },
  S2: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00cc00'
  },
  T1: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#ff40ff'
  },
  T2: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#cc00cc'
  },
  Z1: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#ff4040'
  },
  Z2: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#cc0000'
  }
} as const;

export type TetrominoType = keyof typeof TETROMINOS;

export const LEVEL_SPEEDS = {
  1: 600,  // Faster base speed
  2: 450,  // Faster increased speed
  3: 350,  // Faster increased speed
  4: 300,
  5: 250,
  6: 200,
  7: 170,
  8: 140,
  9: 120,
  10: 100
};

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  level: number;
  timestamp: number;
}
