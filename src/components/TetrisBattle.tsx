import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisGame from './TetrisGame';
import { useBackgroundMusic } from '../utils/audio';

interface ContainerProps {
  $isGameOver?: boolean;
}

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

const ResultDialog = styled(motion.div)`
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

  .dialog-content {
    background: rgba(0, 0, 0, 0.95);
    padding: clamp(20px, 4vw, 40px);
    border: 2px solid #0ff;
    border-radius: 15px;
    color: #0ff;
    text-align: center;
    width: clamp(300px, 90vw, 500px);
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3),
                inset 0 0 20px rgba(0, 255, 255, 0.2);
  }

  h2 {
    font-size: clamp(2em, 5vw, 3em);
    margin-bottom: clamp(15px, 3vw, 30px);
    text-transform: uppercase;
    letter-spacing: 3px;
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
                0 0 20px rgba(0, 255, 255, 0.5),
                0 0 30px rgba(0, 255, 255, 0.3);
    animation: glowPulse 2s infinite alternate;
  }

  .scores {
    margin: clamp(15px, 3vw, 30px) 0;
    font-size: clamp(1.2em, 2.5vw, 1.6em);
    font-family: 'Orbitron', sans-serif;
    line-height: 1.8;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.5s ease forwards 0.5s;
  }

  .button-container {
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.5s ease forwards 1s;
  }

  @keyframes glowPulse {
    from {
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
                  0 0 20px rgba(0, 255, 255, 0.5),
                  0 0 30px rgba(0, 255, 255, 0.3);
    }
    to {
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.9),
                  0 0 25px rgba(0, 255, 255, 0.7),
                  0 0 35px rgba(0, 255, 255, 0.5);
    }
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .dialog-content {
      padding: clamp(15px, 3vw, 25px);
      width: 85vw;
    }
  }
`;

const DialogButton = styled(motion.button)`
  padding: 15px 30px;
  font-size: 1.2em;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif';
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s;
  margin: 10px;
  width: 200px;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;




const BattleContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  overflow: hidden;
`;

const GamesWrapper = styled.div<ContainerProps>`
  display: grid;
  grid-template-columns: repeat(2, 600px);
  justify-content: center;
  align-items: start;
  width: 1200px;
  gap: 40px;
  padding: 20px;
  margin: 0 auto;
  height: auto;
  
  > div {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
`;

const TimerSelect = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  
  h2 {
    color: #0ff;
    font-family: 'Orbitron', sans-serif;
    margin: 0;
  }
  
  .timer-buttons {
    display: flex;
    gap: 15px;
  }
`;

const TimerButton = styled.button<{ $selected?: boolean }>`
  background: ${props => props.$selected ? '#0ff' : 'transparent'};
  color: ${props => props.$selected ? '#000' : '#0ff'};
  border: 2px solid #0ff;
  border-radius: 5px;
  padding: 10px 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;

interface TetrisBattleProps {
  onBackToMenu: () => void;
}

const MusicButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  z-index: 100;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;

const TetrisBattle: React.FC<TetrisBattleProps> = ({ onBackToMenu }) => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number>(60); // Default 1 minute
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [player1GarbageHandler, setPlayer1GarbageHandler] = useState<((lines: number) => void) | null>(null);
  const [player2GarbageHandler, setPlayer2GarbageHandler] = useState<((lines: number) => void) | null>(null);

  useBackgroundMusic({ isPlaying: isMusicPlaying });

  useEffect(() => {
    if (isCountingDown) {
      const countdownInterval = setInterval(() => {
        setCountdownNumber(prev => {
          if (prev === 1) {
            setIsCountingDown(false);
            setHasGameStarted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (timeLeft > 0 && !isGameOver && hasGameStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isGameOver && hasGameStarted) {
      setIsGameOver(true);
      setWinner(player1Score > player2Score ? 1 : player1Score < player2Score ? 2 : null);
      setShowResultDialog(true);
      setIsMusicPlaying(false); // Stop the music when game ends due to timeout
    }
  }, [timeLeft, isGameOver, player1Score, player2Score, isCountingDown, hasGameStarted]);

  useEffect(() => {
    if (hasGameStarted && !isCountingDown) {
      setIsMusicPlaying(true);
    }
  }, [hasGameStarted, isCountingDown]);

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
    return () => {
      cleanupAudio();
      setIsMusicPlaying(false);
    };
  }, [cleanupAudio]);

  // Stop music immediately when back to menu is clicked
  const handleBackToMenu = () => {
    cleanupAudio();
    setHasGameStarted(false);
    setIsCountingDown(false);
    onBackToMenu();
  };

  useEffect(() => {
    if (!hasGameStarted) {
      setIsMusicPlaying(false);
    }
  }, [hasGameStarted]);

  const handlePlayer1Score = (score: number) => {
    if (!isGameOver) setPlayer1Score(score);
  };

  const handlePlayer2Score = (score: number) => {
    if (!isGameOver) setPlayer2Score(score);
  };

  const startGame = (minutes: number) => {
    setHasGameStarted(false);
    setTimeout(() => {
      setSelectedTime(minutes * 60);
      setTimeLeft(minutes * 60);
      setShowCountdown(true);
      setCountdownNumber(3);
      setIsCountingDown(true);
      setIsGameOver(false);
      setShowResultDialog(false);
      setPlayer1Score(0);
      setPlayer2Score(0);
      setWinner(null);
      setHasGameStarted(true);
    }, 100);
  };



  if (!hasGameStarted) {
    return (
      <BattleContainer>
        {showCountdown ? (
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
        ) : (
          <TimerSelect>
            <h2>Select Game Duration</h2>
            <div className="timer-buttons">
              <TimerButton 
                $selected={selectedTime === 60}
                onClick={() => startGame(1)}
              >
                1 Minute
              </TimerButton>
              <TimerButton 
                $selected={selectedTime === 180}
                onClick={() => startGame(3)}
              >
                3 Minutes
              </TimerButton>
              <TimerButton 
                $selected={selectedTime === 300}
                onClick={() => startGame(5)}
              >
                5 Minutes
              </TimerButton>
            </div>
          </TimerSelect>
        )}
      </BattleContainer>
    );
  }

  return (
    <BattleContainer>
      <MusicButton
        onClick={() => setIsMusicPlaying(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMusicPlaying ? '🔊 Music On' : '🔇 Music Off'}
      </MusicButton>
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
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        color: '#0ff',
        fontSize: '2em',
        fontFamily: 'Orbitron, sans-serif'
      }}>
        {isGameOver ? (
          <div style={{ textAlign: 'center' }}>
            {winner === null ? "It's a Tie!" : `Player ${winner} Wins!`}
          </div>
        ) : null}
      </div>
      <GamesWrapper>
        <div>
          <TetrisGame
            isMultiplayer={true}
            playerNumber={1}
            onScoreUpdate={handlePlayer1Score}
            onBackToMenu={onBackToMenu}
            isGameOver={isGameOver}
            timeLeft={timeLeft}
            onGarbageBlocksGenerated={(lines) => player2GarbageHandler?.(lines)}
            onReceiveGarbageBlocks={(handler) => setPlayer1GarbageHandler(() => handler)}
          />
        </div>
        <div>
          <TetrisGame
            isMultiplayer={true}
            playerNumber={2}
            onScoreUpdate={handlePlayer2Score}
            onBackToMenu={onBackToMenu}
            isGameOver={isGameOver}
            timeLeft={timeLeft}
            onGarbageBlocksGenerated={(lines) => player1GarbageHandler?.(lines)}
            onReceiveGarbageBlocks={(handler) => setPlayer2GarbageHandler(() => handler)}
          />
        </div>
      </GamesWrapper>
      <AnimatePresence>
        {showResultDialog && (
          <ResultDialog
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="dialog-content"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.2
              }}
            >
              <motion.h2
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: 0.4
                }}
              >
                {winner === null ? "It's a Tie!" : `Player ${winner} Wins!`}
              </motion.h2>
              <div className="scores">
                Player 1 Score: {player1Score}<br />
                Player 2 Score: {player2Score}
              </div>
              <div className="button-container">
                <DialogButton
                  onClick={() => startGame(selectedTime / 60)}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 255, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </DialogButton>
                <DialogButton
                  onClick={handleBackToMenu}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 255, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Menu
                </DialogButton>
              </div>
            </motion.div>
          </ResultDialog>
        )}
      </AnimatePresence>
    </BattleContainer>
  );
};

export default TetrisBattle;