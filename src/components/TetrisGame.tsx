import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { GameState, Position, TetrisPiece, BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS, LEVEL_SPEEDS } from '../types/tetris';

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: clamp(20px, 3vw, 40px);
  box-sizing: border-box;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

const GameWrapper = styled(motion.div)<{ $isMultiplayer?: boolean }>`
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  background: rgba(0, 0, 0, 0.8);
  padding: clamp(20px, 3vw, 40px);
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
  width: ${props => props.$isMultiplayer ? '95vw' : 'min(95vw, 1200px)'};
  margin: 0 auto;
  box-sizing: border-box;
  justify-content: center;
  align-items: flex-start;
`;

interface GameBoardProps {
  $isMultiplayer?: boolean;
}

const GameBoard = styled.div<GameBoardProps>`
  display: grid;
  grid-template-columns: repeat(${BOARD_WIDTH}, minmax(35px, 1.2fr));
  grid-template-rows: repeat(${BOARD_HEIGHT}, minmax(35px, 1.2fr));
  gap: 4px;
  background: #000;
  padding: clamp(15px, 2.5vw, 25px);
  border: 2px solid #0ff;
  border-radius: 12px;
  aspect-ratio: ${BOARD_WIDTH} / ${BOARD_HEIGHT};
  width: ${props => props.$isMultiplayer ? 'min(95vh, 100%)' : 'min(90vh, 100%)'};
  max-height: ${props => props.$isMultiplayer ? '95vh' : '90vh'};
  box-sizing: border-box;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
`;

const Cell = styled(motion.div)<{ $color: string; $isNew?: boolean; $isCompleted?: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.$color || '#1a1a1a'};
  border: ${props => props.$color ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  transition: all 0.3s ease;
  aspect-ratio: 1;
  min-width: 0;
  ${props => props.$isNew && `
    animation: pop 0.3s ease-out;
    @keyframes pop {
      0% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `}
  ${props => props.$isCompleted && `
    animation: flash 0.5s ease-out;
    @keyframes flash {
      0% { background-color: white; }
      100% { background-color: ${props.$color}; }
    }
  `}
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vh, 30px);
  min-width: 250px;
  max-width: 300px;
`;

const ScoreBoard = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #0ff;
  color: #fff;
  text-align: center;
  h3 {
    margin: 0 0 10px;
    color: #0ff;
    font-family: 'Orbitron', sans-serif;
  }
`;

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #0ff;
  margin-bottom: 15px;
  font-family: 'Orbitron', sans-serif;
`;

const NextPiece = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #0ff;
  h3 {
    margin: 0 0 10px;
    color: #0ff;
    text-align: center;
    font-family: 'Orbitron', sans-serif;
  }
`;

const InstructionsPanel = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #0ff;
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8em;
  
  h3 {
    margin: 0 0 10px;
    color: #0ff;
    text-align: center;
  }

  .key {
    color: #0ff;
    background: rgba(0, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    display: inline-block;
    margin: 0 4px;
    font-weight: bold;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .controls-section {
    margin-top: 10px;
  }

  .controls-title {
    color: #0ff;
    font-size: 0.9em;
    margin: 10px 0 5px;
    text-align: center;
  }
`;

const GameButton = styled(motion.button)`
  padding: 10px 20px;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
`;

const createEmptyBoard = () => Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));

const getRandomTetromino = (): TetrisPiece => {
  const tetrominos = Object.values(TETROMINOS).map(tetromino => ({
    shape: tetromino.shape.map(row => [...row]),
    color: tetromino.color
  }));
  return tetrominos[Math.floor(Math.random() * tetrominos.length)];
};

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

const TimerDisplay = styled.div`
  color: #0ff;
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  animation: timerPulse 1s infinite alternate;

  @keyframes timerPulse {
    from { text-shadow: 0 0 10px rgba(0, 255, 255, 0.7); }
    to { text-shadow: 0 0 20px rgba(0, 255, 255, 1); }
  }
`;

interface TetrisGameProps {
  isMultiplayer?: boolean;
  playerNumber?: 1 | 2;
  onScoreUpdate?: (score: number) => void;
  onBackToMenu?: () => void;
  isGameOver?: boolean;
  timeLeft?: number;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ 
  isMultiplayer = false, 
  playerNumber = 1, 
  onScoreUpdate, 
  onBackToMenu, 
  isGameOver: externalGameOver,
  timeLeft
}) => {
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdownNumber, setCountdownNumber] = useState(3);

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

  const [newBlocks, setNewBlocks] = useState<{ x: number; y: number }[]>([]);
  const [completedLines, setCompletedLines] = useState<number[]>([]);

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
    setGameState(prev => {
      const newBoard = prev.board.map(row => [...row]);
      prev.currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell === 1) {
            const newY = dropPosition.y + dy;
            const newX = dropPosition.x + dx;
            if (newY >= 0) {
              newBoard[newY][newX] = prev.currentPiece.color;
            }
          }
        });
      });
      
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
      gameState.currentPiece.shape.map(row => row[row.length - 1 - index])
    );
    const rotatedPiece = { ...gameState.currentPiece, shape: rotatedShape };
    if (!checkCollision(gameState.currentPosition, rotatedPiece)) {
      setGameState(prev => ({ ...prev, currentPiece: rotatedPiece }));
    }
  }, [gameState, checkCollision]);

  useEffect(() => {
    if (gameState.isGameOver) return;

    const interval = setInterval(() => {
      moveDown();
    }, LEVEL_SPEEDS[gameState.level as keyof typeof LEVEL_SPEEDS]);

    return () => clearInterval(interval);
  }, [gameState.isGameOver, gameState.level, moveDown]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isGameOver) return;

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
          <TimerDisplay style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)' }}>
            {timeLeft}s
          </TimerDisplay>
        )}
        <GameBoard
          style={{
            transform: `scale(${isMultiplayer ? 0.8 : 1})`,
            transition: 'transform 0.3s ease',
            position: 'relative'
          }}
        >
          {isMultiplayer && timeLeft !== undefined && (
            <TimerDisplay
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
              }}
            >
              {timeLeft}s
            </TimerDisplay>
          )}
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