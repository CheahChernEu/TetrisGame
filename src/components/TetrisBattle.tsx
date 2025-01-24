import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import TetrisGame from './TetrisGame';

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding: 0;
  position: relative;
  background: linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  overflow: hidden;
`;

const GamesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-content: center;
  align-items: start;
  width: 100%;
  gap: clamp(20px, 4vw, 40px);
  padding: clamp(10px, 2vw, 20px);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Timer = styled.div`
  color: #0ff;
  font-size: clamp(36px, 5vw, 48px);
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 15px #0ff;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  animation: pulse 1s infinite alternate;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  border: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2),
              inset 0 0 15px rgba(0, 255, 255, 0.1);

  @keyframes pulse {
    from { text-shadow: 0 0 15px #0ff; }
    to { text-shadow: 0 0 25px #0ff; }
  }
`;

const VictoryPopup = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  backdrop-filter: blur(10px);

  > div {
    background: rgba(0, 0, 0, 0.9);
    padding: 40px;
    border-radius: 20px;
    border: 2px solid #0ff;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3),
                inset 0 0 30px rgba(0, 255, 255, 0.2);
    text-align: center;
    width: auto;
    min-width: 300px;
    max-width: 90vw;
    margin: 0;
  }
`;

const VictoryText = styled.h2`
  color: #0ff;
  font-size: 36px;
  margin: 0 0 20px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  animation: glow 2s infinite alternate;

  @keyframes glow {
    from { text-shadow: 0 0 20px rgba(0, 255, 255, 0.7); }
    to { text-shadow: 0 0 30px rgba(0, 255, 255, 1); }
  }
`;

const PlayAgainButton = styled(motion.button)`
  padding: 10px 20px;
  font-size: 1.2em;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;

interface TetrisBattleProps {
  onBackToMenu: () => void;
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

const TetrisBattle: React.FC<TetrisBattleProps> = ({ onBackToMenu }) => {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
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
    } else if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isGameOver) {
      setIsGameOver(true);
      setWinner(player1Score > player2Score ? 1 : player1Score < player2Score ? 2 : null);
    }
  }, [timeLeft, isGameOver, player1Score, player2Score, isCountingDown]);

  const handlePlayer1Score = (score: number) => {
    if (!isGameOver) setPlayer1Score(score);
  };

  const handlePlayer2Score = (score: number) => {
    if (!isGameOver) setPlayer2Score(score);
  };

  const resetGame = () => {
    setTimeLeft(60);
    setIsGameOver(false);
    setWinner(null);
    setPlayer1Score(0);
    setPlayer2Score(0);
    // Reset both game instances
    const gameElements = document.querySelectorAll('.game-button');
    gameElements.forEach((element) => {
      if (element instanceof HTMLButtonElement) {
        element.click();
      }
    });
  };

  return (
    <BattleContainer>
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
      <GamesWrapper>
        <div>
          <TetrisGame
            isMultiplayer={true}
            playerNumber={1}
            onScoreUpdate={handlePlayer1Score}
            onBackToMenu={onBackToMenu}
            isGameOver={isGameOver}
            timeLeft={timeLeft}
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
          />
        </div>
      </GamesWrapper>
      <AnimatePresence>
        {isGameOver && (
          <VictoryPopup
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <VictoryText>
                {winner ? `Player ${winner} Wins! (${winner === 1 ? player1Score : player2Score} pts)` : `It's a Tie! (${player1Score} - ${player2Score})`}
              </VictoryText>
              <PlayAgainButton
                onClick={resetGame}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Play Again
              </PlayAgainButton>
            </div>
          </VictoryPopup>
        )}
      </AnimatePresence>
    </BattleContainer>
  );
};

export default TetrisBattle;