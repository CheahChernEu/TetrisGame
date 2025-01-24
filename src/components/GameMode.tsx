import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TetrisGame from './TetrisGame';
import TetrisBattle from './TetrisBattle';
import { Title } from '../styles/StyledComponents';

const ModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  padding: 0 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ModeButton = styled(motion.button)`
  padding: 15px 30px;
  font-size: 1.2em;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  min-width: 200px;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.3), transparent);
    transform: rotate(45deg);
    animation: shine 3s linear infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }
`;

const GameContainer = styled.div<{ $isBattleMode?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: ${props => props.$isBattleMode ? '40px' : '0'};
  width: 100%;
  max-width: ${props => props.$isBattleMode ? '1200px' : '600px'};
  margin: 0 auto;
  padding: 20px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 20px;
  }
`;

const GameMode: React.FC = () => {
  const [mode, setMode] = React.useState<'select' | 'single' | 'battle'>('select');

  const handleBackToMenu = () => {
    setMode('select');
  };

  const renderContent = () => {
    switch (mode) {
      case 'single':
        return (
          <GameContainer>
            <TetrisGame isMultiplayer={false} onBackToMenu={handleBackToMenu} />
          </GameContainer>
        );
      case 'battle':
        return <TetrisBattle onBackToMenu={handleBackToMenu} />;
      default:
        return (
          <ButtonContainer>
            <ModeButton
              onClick={() => setMode('single')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Single Player
            </ModeButton>
            <ModeButton
              onClick={() => setMode('battle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Battle Mode
            </ModeButton>
          </ButtonContainer>
        );
    }
  };

  return (
    <ModeContainer>
      {mode === 'select' && (
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Tetris Arcade
        </Title>
      )}
      {renderContent()}
    </ModeContainer>
  );
};

export default GameMode;