import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TetrisGame from './TetrisGame';
import TetrisBattle from './TetrisBattle';
import { Title } from '../styles/StyledComponents';
import { useBackgroundMusic } from '../utils/audio';

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

const SinglePlayerSetup = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  padding: 30px;
  border-radius: 10px;
  border: 2px solid #0ff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  h2 {
    color: #0ff;
    margin-bottom: 20px;
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid #0ff;
    border-radius: 5px;
    color: #0ff;
    font-family: 'Orbitron', sans-serif;
    font-size: 1em;

    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
  }

  button {
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
    width: 100%;
    min-width: 200px;

    &:hover:not(:disabled) {
      background: rgba(0, 255, 255, 0.1);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

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

const GameMode: React.FC = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  useBackgroundMusic({ isPlaying: isMusicPlaying });
  const [mode, setMode] = React.useState<'select' | 'single' | 'battle'>('select');
  const [playerNickname, setPlayerNickname] = React.useState<string>('');
  const [nicknameError, setNicknameError] = React.useState<string>('');
  const [shouldStartCountdown, setShouldStartCountdown] = React.useState<boolean>(false);

  const handleBackToMenu = () => {
    setIsMusicPlaying(false);
    setTimeout(() => {
      setMode('select');
      setPlayerNickname('');
      setShouldStartCountdown(false);
      setNicknameError('');
    }, 100);
  };

  // Stop music when component unmounts
  React.useEffect(() => {
    return () => {
      setIsMusicPlaying(false);
    };
  }, []);

  // Stop music when mode changes
  React.useEffect(() => {
    setIsMusicPlaying(false);
  }, [mode]);

  const handleStartGame = () => {
    const trimmedNickname = playerNickname.trim();
    if (!trimmedNickname) {
      setNicknameError('Please enter a nickname');
      return;
    }

    if (trimmedNickname.length > 10) {
      setNicknameError('Nickname must not exceed 10 characters');
      return;
    }

    if (trimmedNickname.length < 1) {
      setNicknameError('Nickname must be at least 1 character');
      return;
    }

    const storedLeaderboard = localStorage.getItem('tetrisLeaderboard');
    const leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
    
    if (leaderboard.some((entry: { nickname: string }) => entry.nickname.toLowerCase() === trimmedNickname.toLowerCase())) {
      setNicknameError('This nickname is already taken. Please choose another one.');
      return;
    }
    
    setNicknameError('');
    setPlayerNickname(trimmedNickname);
    setShouldStartCountdown(true);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setPlayerNickname(value);
      setNicknameError('');
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'single':
        return (
          <GameContainer $isBattleMode={true}>
            {!shouldStartCountdown ? (
              <SinglePlayerSetup
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Enter Your Nickname</h2>
                <input
                  type="text"
                  placeholder="Enter nickname (max 10 characters)"
                  value={playerNickname}
                  onChange={handleNicknameChange}
                  maxLength={10}
                  autoFocus
                />
                {nicknameError && (
                  <div style={{
                    color: '#ff0000',
                    marginBottom: '10px',
                    fontSize: '0.9em',
                    fontFamily: 'Orbitron, sans-serif'
                  }}>
                    {nicknameError}
                  </div>
                )}
                <button
                  onClick={handleStartGame}
                  disabled={!playerNickname.trim()}
                >
                  Start Game
                </button>
                <button
                  onClick={handleBackToMenu}
                  style={{
                    marginTop: '10px',
                    background: 'transparent',
                    color: '#0ff',
                    border: '2px solid #0ff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontFamily: 'Orbitron, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    padding: '10px 20px',
                    width: '100%',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Back to Menu
                </button>
              </SinglePlayerSetup>
            ) : (
              <TetrisGame 
                isMultiplayer={false} 
                onBackToMenu={handleBackToMenu} 
                playerNickname={playerNickname}
                shouldStartCountdown={shouldStartCountdown}
              />
            )}
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
              Not In Relationship
            </ModeButton>
            <ModeButton
              onClick={() => setMode('battle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              In Relationship
            </ModeButton>
          </ButtonContainer>
        );
    }
  };

  return (
    <ModeContainer>
      {mode === 'single' && (
        <MusicButton
          onClick={() => setIsMusicPlaying((prev: boolean) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMusicPlaying ? '🔊 Music On' : '🔇 Music Off'}
        </MusicButton>
      )}
      {mode === 'select' && (
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          SuDu Tetris Arcade: CNY 2025
        </Title>
      )}
    
      {renderContent()}
    </ModeContainer>
  );
};

export default GameMode;