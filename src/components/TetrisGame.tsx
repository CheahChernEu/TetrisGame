import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { Cell } from '../styles/StyledComponents';
import { InstructionsPanel } from '../styles/InstructionsPanel';
import { GameState, Position, TetrisPiece, BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS, LEVEL_SPEEDS, GameBoardProps } from '../types/tetris';
import { useBackgroundMusic } from '../utils/audio';

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  width: 600px;
  margin: 0 auto;
  position: relative;
  overflow: visible;
`;

const LeaderboardContainer = styled.div`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: clamp(15px, 2vw, 20px);
  border-radius: 10px;
  border: 2px solid #0ff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
              inset 0 0 15px rgba(0, 255, 255, 0.2);
  width: 250px;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  @media (max-width: 1400px) {
    position: static;
    transform: none;
    margin: 20px auto;
    width: 100%;
    max-width: 300px;
  }

  @media (max-height: 800px) {
    padding: 10px;
    font-size: 0.9em;
  }
`;

const LeaderboardTitle = styled.h2`
  color: #0ff;
  text-align: center;
  margin-bottom: 15px;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.2em;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const LeaderboardEntry = styled.div`
  display: grid;
  grid-template-columns: 30px 2fr 1fr 1fr;
  gap: 10px;
  padding: 8px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  font-family: 'Orbitron', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9em;

  &:last-child {
    border-bottom: none;
  }

  .rank {
    color: #0ff;
  }

  .nickname {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .score, .level {
    text-align: center;
  }
`;

const GameWrapper = styled(motion.div)<{ $isMultiplayer?: boolean }>`
  display: flex;
  gap: 40px;
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
  width: ${props => props.$isMultiplayer ? '800px' : '600px'};
  margin: 0 auto;
  box-sizing: border-box;
  justify-content: center;
  align-items: flex-start;
`;

const GameBoard = styled.div<GameBoardProps>`
  display: grid;
  grid-template-columns: repeat(${BOARD_WIDTH}, minmax(0, 1fr));
  grid-template-rows: repeat(${BOARD_HEIGHT}, minmax(0, 1fr));
  gap: 1px;
  background: #000;
  padding: 10px;
  border: 2px solid #0ff;
  border-radius: 12px;
  width: 350px;
  aspect-ratio: 1/2;
  box-sizing: border-box;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 280px;
  }
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 140px;
`;

const ScoreBoard = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #0ff;
  color: #fff;
  text-align: center;
  h3 {
    margin: 0 0 6px;
    color: #0ff;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9em;
  }
`;

const Score = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #0ff;
  margin-bottom: 8px;
  font-family: 'Orbitron', sans-serif;
`;

const NextPiece = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #0ff;
  h3 {
    margin: 0 0 6px;
    color: #0ff;
    text-align: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9em;
  }
`;

const GameButton = styled(motion.button)`
  padding: 6px 12px;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8em;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
`;

const createEmptyBoard = () => Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));

interface GetRandomTetrominoFunction extends Function {
  bag?: TetrisPiece[];
}

const getRandomTetromino: GetRandomTetrominoFunction & (() => TetrisPiece) = () => {
  // Static bag to store the current sequence of tetrominos
  if (!getRandomTetromino.bag || getRandomTetromino.bag.length === 0) {
    // Create a new bag with all tetromino types when empty
    getRandomTetromino.bag = Object.values(TETROMINOS).map(tetromino => ({
      shape: tetromino.shape.map(row => [...row]),
      color: tetromino.color
    }));
    // Shuffle the bag using Fisher-Yates algorithm
    for (let i = getRandomTetromino.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [getRandomTetromino.bag[i], getRandomTetromino.bag[j]] = 
      [getRandomTetromino.bag[j], getRandomTetromino.bag[i]];
    }
  }
  // Return and remove the next piece from the bag
  return getRandomTetromino.bag.pop()!;
};
// Add type definition for the static property
(getRandomTetromino as any).bag = null;

const CountdownOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const CountdownText = styled(motion.div)`
  color: #0ff;
  font-size: 120px;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
  letter-spacing: 4px;
`;

export const TimerDisplay = styled.div`
  color: #0ff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #0ff;
  border-radius: 8px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 80px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  z-index: 10;
`;

interface LeaderboardEntry {
  nickname: string;
  score: number;
  level: number;
  timestamp: number;
}

interface TetrisGameProps {
  isMultiplayer?: boolean;
  playerNumber?: 1 | 2;
  onScoreUpdate?: (score: number) => void;
  onBackToMenu?: () => void;
  isGameOver?: boolean;
  timeLeft?: number;
  playerNickname?: string;
  shouldStartCountdown?: boolean;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ 
  isMultiplayer = false, 
  playerNumber = 1, 
  onScoreUpdate, 
  onBackToMenu, 
  isGameOver: externalGameOver,
  timeLeft,
  playerNickname,
  shouldStartCountdown = false
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: getRandomTetromino(),
    currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    nextPiece: getRandomTetromino(),
    savedPiece: null,
    canSavePiece: true,
    score: 0,
    isGameOver: false,
    level: 1,
    lastKeyPressTime: {}
  });
  const [newBlocks, setNewBlocks] = useState<{ x: number; y: number }[]>([]);
  const [completedLines, setCompletedLines] = useState<number[]>([]);

  useBackgroundMusic({ isPlaying: isMusicPlaying });

  useEffect(() => {
    if (!isCountingDown && shouldStartCountdown && countdownNumber === 0) {
      setIsMusicPlaying(true);
    }
  }, [isCountingDown, shouldStartCountdown, countdownNumber]);

  const cleanupAudio = useCallback(() => {
    setIsMusicPlaying(false);
    
    // Force cleanup of all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      audio.remove();
    });

    // Additional cleanup to ensure no audio context remains
    const audioContexts = document.querySelectorAll('.audio-context');
    audioContexts.forEach(context => {
      if (context instanceof AudioContext) {
        context.close();
      }
    });

    // Create and close a new context to ensure all audio is stopped
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContext.close();
  }, []);

  // Stop music when component unmounts or returns to menu
  useEffect(() => {
    if (onBackToMenu) {
      cleanupAudio();
    }
    return () => {
      setIsMusicPlaying(false);
    };
  }, [onBackToMenu, cleanupAudio]);

  useEffect(() => {
    if (gameState.isGameOver) {
      setIsMusicPlaying(false);
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    return () => {
      setIsMusicPlaying(false);
    };
  }, []);

  useEffect(() => {
    if (gameState.isGameOver) {
      setIsMusicPlaying(false);
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    return () => {
      setIsMusicPlaying(false);
    };
  }, []);

  // Countdown starts only when shouldStartCountdown is true
  useEffect(() => {
    if (shouldStartCountdown && !isMultiplayer && !isCountingDown) {
      setIsCountingDown(true);
      setCountdownNumber(3);
    }
  }, [shouldStartCountdown, isMultiplayer]);

  // Reset game state when returning to menu
  useEffect(() => {
    return () => {
      setIsCountingDown(false);
      setCountdownNumber(3);
      setGameState({
        board: createEmptyBoard(),
        currentPiece: getRandomTetromino(),
        currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
        nextPiece: getRandomTetromino(),
        savedPiece: null,
        canSavePiece: true,
        score: 0,
        isGameOver: false,
        level: 1,
        lastKeyPressTime: {}
      });
    };
  }, []);

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('tetrisLeaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  useEffect(() => {
    if (gameState.isGameOver && !isMultiplayer && playerNickname) {
      const newEntry: LeaderboardEntry = {
        nickname: playerNickname,
        score: gameState.score,
        level: gameState.level,
        timestamp: Date.now()
      };

      const updatedLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('tetrisLeaderboard', JSON.stringify(updatedLeaderboard));
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    if (isCountingDown) {
      const countdownInterval = setInterval(() => {
        setCountdownNumber(prev => {
          if (prev === 1) {
            setIsCountingDown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [isCountingDown]);

  // Update game state when external game over state changes
  useEffect(() => {
    if (externalGameOver) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  }, [externalGameOver]);

  const checkCollision = useCallback((position: Position, piece: TetrisPiece): boolean => {
    return piece.shape.some((row, dy) =>
      row.some((cell, dx) => {
        if (cell === 0) return false;
        const newX = position.x + dx;
        const newY = position.y + dy;
        return (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && gameState.board[newY][newX] !== '')
        );
      })
    );
  }, [gameState.board]);

  const placePiece = useCallback(() => {
    const newBoard = gameState.board.map(row => [...row]);
    const newBlockPositions: { x: number; y: number }[] = [];

    gameState.currentPiece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell === 1) {
          const newY = gameState.currentPosition.y + dy;
          const newX = gameState.currentPosition.x + dx;
          if (newY >= 0) {
            newBoard[newY][newX] = gameState.currentPiece.color;
            newBlockPositions.push({ x: newX, y: newY });
          }
        }
      });
    });
    setGameState(prev => ({ ...prev, canSavePiece: true }));
    setNewBlocks(newBlockPositions);

    let linesCleared = 0;
    const completedLineIndices: number[] = [];
    const updatedBoard = newBoard.filter((row, index) => {
      const isComplete = row.every(cell => cell !== '');
      if (isComplete) {
        linesCleared++;
        completedLineIndices.push(index);
      }
      return !isComplete;
    });

    setCompletedLines(completedLineIndices);

    while (updatedBoard.length < BOARD_HEIGHT) {
      updatedBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }

    const points = [0, 100, 300, 500, 800][linesCleared] || 0;
    const newScore = gameState.score + points;
    const newLevel = Math.floor(newScore / 1000) + 1;

    setGameState(prev => ({
      ...prev,
      board: updatedBoard,
      currentPiece: prev.nextPiece,
      currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      nextPiece: getRandomTetromino(),
      score: newScore,
      level: Math.min(newLevel, 10),
      isGameOver: checkCollision({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }, prev.nextPiece)
    }));

    // Clear effects after animation
    setTimeout(() => {
      setNewBlocks([]);
      setCompletedLines([]);
    }, 500);
  }, [gameState, checkCollision]);

  const hardDrop = useCallback(() => {
    let dropPosition = { ...gameState.currentPosition };
    
    while (!checkCollision({ ...dropPosition, y: dropPosition.y + 1 }, gameState.currentPiece)) {
      dropPosition.y += 1;
    }

    const newBoard = gameState.board.map(row => [...row]);
    const newBlockPositions: { x: number; y: number }[] = [];

    gameState.currentPiece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell === 1) {
          const newY = dropPosition.y + dy;
          const newX = dropPosition.x + dx;
          if (newY >= 0) {
            newBoard[newY][newX] = gameState.currentPiece.color;
            newBlockPositions.push({ x: newX, y: newY });
          }
        }
      });
    });

    setNewBlocks(newBlockPositions);

    setGameState(prev => {
      
      let linesCleared = 0;
      const updatedBoard = newBoard.filter(row => {
        const isComplete = row.every(cell => cell !== '');
        if (isComplete) linesCleared++;
        return !isComplete;
      });
      
      while (updatedBoard.length < BOARD_HEIGHT) {
        updatedBoard.unshift(Array(BOARD_WIDTH).fill(''));
      }
      
      const points = [0, 100, 300, 500, 800][linesCleared] || 0;
      const newScore = prev.score + points;
      const newLevel = Math.floor(newScore / 1000) + 1;
      
      return {
        ...prev,
        board: updatedBoard,
        currentPiece: prev.nextPiece,
        currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
        nextPiece: getRandomTetromino(),
        score: newScore,
        level: Math.min(newLevel, 10),
        canSavePiece: true,
        isGameOver: checkCollision({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }, prev.nextPiece)
      };
    });
  }, [gameState, checkCollision]);

  const moveDown = useCallback(() => {
    const newPosition = { ...gameState.currentPosition, y: gameState.currentPosition.y + 1 };
    if (checkCollision(newPosition, gameState.currentPiece)) {
      placePiece();
    } else {
      setGameState(prev => ({ ...prev, currentPosition: newPosition }));
    }
  }, [gameState, checkCollision, placePiece]);

  const moveHorizontally = useCallback((direction: number) => {
    const newPosition = { ...gameState.currentPosition, x: gameState.currentPosition.x + direction };
    if (!checkCollision(newPosition, gameState.currentPiece)) {
      setGameState(prev => ({ ...prev, currentPosition: newPosition }));
    }
  }, [gameState, checkCollision]);

  const rotatePiece = useCallback(() => {
    const rotatedShape = gameState.currentPiece.shape[0].map((_, index) =>
      gameState.currentPiece.shape.map(row => row[index]).reverse()
    );
    const rotatedPiece = { ...gameState.currentPiece, shape: rotatedShape };
    if (!checkCollision(gameState.currentPosition, rotatedPiece)) {
      setGameState(prev => ({ ...prev, currentPiece: rotatedPiece }));
    }
  }, [gameState, checkCollision]);

  useEffect(() => {
    if (gameState.isGameOver || isCountingDown) return;

    const interval = setInterval(() => {
      moveDown();
    }, LEVEL_SPEEDS[gameState.level as keyof typeof LEVEL_SPEEDS]);

    return () => clearInterval(interval);
  }, [gameState.isGameOver, gameState.level, moveDown, isCountingDown]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isGameOver || isCountingDown) return;

      if (!isMultiplayer) {
        switch (event.key) {
          case 'ArrowLeft':
            moveHorizontally(-1);
            break;
          case 'ArrowRight':
            moveHorizontally(1);
            break;
          case 'ArrowDown':
            moveDown();
            break;
          case 'ArrowUp':
            rotatePiece();
            break;
          case ' ':
            hardDrop();
            break;
          case 'm':
            savePiece();
            break;
        }
      } else if (playerNumber === 1) {
        switch (event.key.toLowerCase()) {
          case 'w':
            rotatePiece();
            break;
          case 'a':
            moveHorizontally(-1);
            break;
          case 'd':
            moveHorizontally(1);
            break;
          case 's':
            moveDown();
            break;
          case 'shift':
            hardDrop();
            break;
          case 'tab':
            event.preventDefault();
            savePiece();
            break;
        }
      } else {
        switch (event.key) {
          case 'ArrowLeft':
            moveHorizontally(-1);
            break;
          case 'ArrowRight':
            moveHorizontally(1);
            break;
          case 'ArrowDown':
            moveDown();
            break;
          case 'ArrowUp':
            rotatePiece();
            break;
          case ' ':
            hardDrop();
            break;
          case 'm':
            savePiece();
            break;
        }
      }
    };



    document.addEventListener('keydown', handleKeyPress);


    return () => {
      document.removeEventListener('keydown', handleKeyPress);

    };
  }, [gameState.isGameOver, moveHorizontally, moveDown, rotatePiece, hardDrop, playerNumber]);

  const savePiece = useCallback(() => {
    if (!gameState.canSavePiece) return;
    
    const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    
    if (!gameState.savedPiece) {
      // First save - store current piece
      setGameState(prev => ({
        ...prev,
        savedPiece: prev.currentPiece,
        currentPiece: prev.nextPiece,
        nextPiece: getRandomTetromino(),
        currentPosition: newPosition,
        canSavePiece: false
      }));
    } else {
      // Swap current piece with saved piece
      const tempPiece = gameState.currentPiece;
      if (!checkCollision(newPosition, gameState.savedPiece)) {
        setGameState(prev => ({
          ...prev,
          currentPiece: prev.savedPiece!,
          savedPiece: tempPiece,
          currentPosition: newPosition,
          canSavePiece: false
        }));
      }
    }
  }, [gameState.canSavePiece, gameState.savedPiece, gameState.currentPiece, checkCollision]);


  const resetGame = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: getRandomTetromino(),
      currentPosition: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      nextPiece: getRandomTetromino(),
      savedPiece: null,
      canSavePiece: true,
      score: 0,
      isGameOver: false,
      level: 1,
      lastKeyPressTime: {}
    });
    setIsCountingDown(true);
    setCountdownNumber(3);
    setIsMusicPlaying(false);
  };

  const getGhostPosition = useCallback(() => {
    let ghostY = gameState.currentPosition.y;
    while (!checkCollision({ x: gameState.currentPosition.x, y: ghostY + 1 }, gameState.currentPiece)) {
      ghostY++;
    }
    return ghostY;
  }, [gameState.currentPosition, gameState.currentPiece, checkCollision]);

  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);
    if (!gameState.isGameOver) {
      // Render ghost piece
      const ghostY = getGhostPosition();
      gameState.currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell === 1) {
            const y = ghostY + dy;
            const x = gameState.currentPosition.x + dx;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = `${gameState.currentPiece.color}40`; // Semi-transparent
            }
          }
        });
      });

      // Render current piece
      gameState.currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell === 1) {
            const y = gameState.currentPosition.y + dy;
            const x = gameState.currentPosition.x + dx;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = gameState.currentPiece.color;
            }
          }
        });
      });
    }

    return displayBoard.map((row, y) =>
      row.map((color, x) => (
        <Cell
          key={`${y}-${x}`}
          $color={color}
          $isNew={newBlocks.some(block => block.x === x && block.y === y)}
          $isCompleted={completedLines.includes(y)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      ))
    );
  };

  const renderNextPiece = () => {
    return (
      <div style={{ display: 'grid', gridTemplateRows: `repeat(${gameState.nextPiece.shape.length}, 1fr)`, gap: '2px' }}>
        {gameState.nextPiece.shape.map((row, y) => (
          <div key={y} style={{ display: 'flex', gap: '2px' }}>
            {row.map((cell, x) => (
              <Cell
                key={`next-${y}-${x}`}
                $color={cell ? gameState.nextPiece.color : '#1a1a1a'}
                style={{ width: '20px', height: '20px' }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (onScoreUpdate && !gameState.isGameOver) {
      onScoreUpdate(gameState.score);
    }
  }, [gameState.score, gameState.isGameOver, onScoreUpdate]);

  return (
    <GameContainer>
      {!isMultiplayer && leaderboard.length > 0 && (
        <LeaderboardContainer>
          <LeaderboardTitle>Top 5 Players</LeaderboardTitle>
          <LeaderboardEntry style={{ fontWeight: 'bold', color: '#0ff' }}>
            <span>#</span>
            <span style={{ textAlign: 'left' }}>Player</span>
            <span>Score</span>
            <span>Level</span>
          </LeaderboardEntry>
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((entry, index) => (
              <LeaderboardEntry key={`${entry.nickname}-${entry.timestamp}`}>
                <span className="rank">{index + 1}</span>
                <span className="nickname">{entry.nickname}</span>
                <span className="score">{entry.score}</span>
                <span className="level">{entry.level}</span>
              </LeaderboardEntry>
            ))}
        </LeaderboardContainer>
      )}
      <AnimatePresence>
        {isCountingDown && (
          <CountdownOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CountdownText
              key={countdownNumber}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
            >
              {countdownNumber === 0 ? "START!" : countdownNumber}
            </CountdownText>
          </CountdownOverlay>
        )}
      </AnimatePresence>
      <GameWrapper
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        $isMultiplayer={isMultiplayer}
      >
        {isMultiplayer && timeLeft !== undefined && (
          <TimerDisplay>{timeLeft}s</TimerDisplay>
        )}
        <GameBoard
          style={{
            transform: `scale(${isMultiplayer ? 0.9 : 1})`,
            transition: 'transform 0.3s ease',
            position: 'relative'
          }}
        >
          {renderBoard()}
        </GameBoard>
        <SidePanel>
          <ScoreBoard>
            <h3>Score</h3>
            <Score>{gameState.score}</Score>
            <h3>Level</h3>
            <Score>{gameState.level}</Score>
          </ScoreBoard>
          <NextPiece>
            <h3>Next</h3>
            {renderNextPiece()}
          </NextPiece>
          <NextPiece>
            <h3>Hold</h3>
            {gameState.savedPiece && (
              <div style={{ display: 'grid', gridTemplateRows: `repeat(${gameState.savedPiece.shape.length}, 1fr)`, gap: '2px' }}>
                {gameState.savedPiece.shape.map((row, y) => (
                  <div key={y} style={{ display: 'flex', gap: '2px' }}>
                    {row.map((cell, x) => (
                      <Cell
                        key={`saved-${y}-${x}`}
                        $color={cell ? gameState.savedPiece!.color : '#1a1a1a'}
                        style={{ width: '20px', height: '20px' }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </NextPiece>
          <InstructionsPanel>
            <h3>Controls</h3>
            {!isMultiplayer ? (
              <ul>
                <li><span>Move Left</span> <span className="key">←</span></li>
                <li><span>Move Right</span> <span className="key">→</span></li>
                <li><span>Move Down</span> <span className="key">↓</span></li>
                <li><span>Rotate</span> <span className="key">↑</span></li>
                <li><span>Hard Drop</span> <span className="key">Space</span></li>
                <li><span>Hold Piece</span> <span className="key">M</span></li>
              </ul>
            ) : (
              <div className="controls-section">
                <div className="controls-title">Player {playerNumber}</div>
                <ul>
                  {playerNumber === 1 ? (
                    <>
                      <li><span>Move Left</span> <span className="key">A</span></li>
                      <li><span>Move Right</span> <span className="key">D</span></li>
                      <li><span>Move Down</span> <span className="key">S</span></li>
                      <li><span>Rotate</span> <span className="key">W</span></li>
                      <li><span>Hard Drop</span> <span className="key">Shift</span></li>
                      <li><span>Hold Piece</span> <span className="key">Tab</span></li>
                    </>
                  ) : (
                    <>
                      <li><span>Move Left</span> <span className="key">←</span></li>
                      <li><span>Move Right</span> <span className="key">→</span></li>
                      <li><span>Move Down</span> <span className="key">↓</span></li>
                      <li><span>Rotate</span> <span className="key">↑</span></li>
                      <li><span>Hard Drop</span> <span className="key">Space</span></li>
                      <li><span>Hold Piece</span> <span className="key">M</span></li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </InstructionsPanel>
          <AnimatePresence>
            {gameState.isGameOver && (
              <GameButton
                onClick={resetGame}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Game Over!
                <br />
                Play Again
              </GameButton>
            )}
          </AnimatePresence>
          <GameButton
            onClick={onBackToMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Back to Menu
          </GameButton>
        </SidePanel>
      </GameWrapper>
    </GameContainer>
  );
};

export default TetrisGame;