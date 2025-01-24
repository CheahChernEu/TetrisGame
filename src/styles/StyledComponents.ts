import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Title = styled(motion.h1)`
  color: #0ff;
  font-size: clamp(2em, 6vw, 4.5em);
  margin: clamp(20px, 4vh, 40px) 0;
  padding: 0 20px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
              0 0 20px rgba(0, 255, 255, 0.5),
              0 0 30px rgba(0, 255, 255, 0.3),
              0 0 40px rgba(0, 255, 255, 0.2),
              0 0 50px rgba(0, 255, 255, 0.1);
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: clamp(2px, 0.5vw, 4px);
  text-align: center;
  line-height: 1.2;
  width: 100%;
  position: relative;
  z-index: 2;
  animation: neonPulse 2s infinite alternate;

  @keyframes neonPulse {
    from {
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
                 0 0 20px rgba(0, 255, 255, 0.5),
                 0 0 30px rgba(0, 255, 255, 0.3);
    }
    to {
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.9),
                 0 0 25px rgba(0, 255, 255, 0.7),
                 0 0 35px rgba(0, 255, 255, 0.5),
                 0 0 45px rgba(0, 255, 255, 0.3);
    }
  }
`;

export const GameContainer = styled.div<{ $isMultiplayer?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  padding: clamp(2px, 2vw, 5px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  color: #fff;
  font-family: 'Orbitron', 'Arial', sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: 
      linear-gradient(90deg, transparent 0%, rgba(136, 0, 255, 0.1) 45%, transparent 100%),
      repeating-linear-gradient(
        45deg,
        rgba(0, 255, 255, 0.05) 0%,
        rgba(0, 255, 255, 0.05) 1px,
        transparent 1px,
        transparent 10px
      );
    animation: gridMove 20s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
    pointer-events: none;
  }
`;

export const GameWrapper = styled(motion.div)<{ $isMultiplayer?: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.$isMultiplayer 
    ? 'repeat(auto-fit, minmax(250px, 1fr))'
    : 'auto minmax(180px, 220px)'};
  gap: clamp(20px, 3vw, 30px);
  padding: clamp(20px, 3vw, 30px);
  background: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
              inset 0 0 20px rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  margin: 0 auto;
  width: ${props => props.$isMultiplayer ? 'min(1400px, 95vw)' : 'fit-content'};
  align-items: start;
  justify-content: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: min(95vw, 400px);
    gap: 15px;
    padding: 15px;
  }
`;

export const GameBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(20, 1fr);
  grid-template-columns: repeat(10, 1fr);
  gap: 1px;
  background: rgba(0, 0, 0, 0.8);
  padding: clamp(5px, 1vw, 10px);
  border-radius: 5px;
  border: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.3),
              inset 0 0 20px rgba(0, 255, 255, 0.2);
  position: relative;
  aspect-ratio: 1/2;
  width: min(95vh/2, 350px);
  height: min(95vh, 700px);
  margin: 0;
  animation: boardGlow 4s infinite alternate;
  
  @media (max-width: 768px) {
    width: min(95vw, 350px);
    height: min(90vh, 600px);
    margin: 0 auto;
  }
  max-width: min(95vw, 400px);
  @media (max-width: 768px) {
    height: min(90vh, 600px);
  }


  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 255, 0.03) 0px,
      rgba(0, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }
`;

export const Cell = styled(motion.div)<{ $color?: string; $isNew?: boolean; $isCompleted?: boolean }>`
  aspect-ratio: 1;
  background: ${({ $color }) => $color || '#1a1a1a'};
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  animation: ${({ $isNew }) => $isNew ? 'blockPlaceFlash 0.3s ease-out' : 'none'};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    opacity: 0.5;
    animation: ${({ $isCompleted }) => $isCompleted ? 'lineCompleteEffect 0.5s ease-out' : 'none'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: inherit;
    animation: ${({ $isNew }) => $isNew ? 'rippleEffect 0.5s ease-out' : 'none'};
    pointer-events: none;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 2vh, 25px);
  height: 100%;
  justify-content: flex-start;
  min-width: 180px;
  max-width: 220px;
  
  @media (max-width: 768px) {
    min-width: unset;
    max-width: 100%;
    gap: 15px;
  }
`;

export const ScoreBoard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: clamp(12px, 2vh, 20px);
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2),
              inset 0 0 15px rgba(0, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  animation: scoreGlow 3s infinite alternate;
  
  h3 {
    color: #0ff;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 8px;
    font-size: clamp(0.8em, 2vw, 0.9em);
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }
`;

export const Score = styled.h2`
  font-size: 2em;
  color: #0ff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
               0 0 20px rgba(0, 255, 255, 0.5),
               0 0 30px rgba(0, 255, 255, 0.3);
  font-family: 'Orbitron', monospace;
  letter-spacing: 2px;
`;

export const NextPiece = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  
  h3 {
    color: #0ff;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 10px;
    font-size: 0.9em;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }
`;

export const GameButton = styled(motion.button)`
  width: 100%;
  padding: 12px 24px;
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3),
              inset 0 0 15px rgba(0, 255, 255, 0.3);
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5),
                inset 0 0 30px rgba(0, 255, 255, 0.3);
  }
  
  &:before {
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
  @keyframes blockPlaceFlash {
    0% {
      filter: brightness(2);
      transform: scale(1.1);
    }
    100% {
      filter: brightness(1);
      transform: scale(1);
    }
  }
  
  @keyframes rippleEffect {
    0% {
      border: 2px solid rgba(0, 255, 255, 0.8);
      transform: scale(1);
      opacity: 1;
    }
    100% {
      border: 2px solid rgba(0, 255, 255, 0);
      transform: scale(1.3);
      opacity: 0;
    }
  }
  
  @keyframes lineCompleteEffect {
    0% {
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 255, 255, 0.2) 100%);
      transform: scaleY(1.2);
    }
    100% {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      transform: scaleY(1);
    }
  }
  
  @keyframes gridMove {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @keyframes scoreGlow {
    0% {
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.2),
                  inset 0 0 15px rgba(0, 255, 255, 0.1);
    }
    100% {
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.4),
                  inset 0 0 25px rgba(0, 255, 255, 0.2);
    }
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }
  
  @keyframes boardGlow {
    0% {
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.3),
                  inset 0 0 20px rgba(0, 255, 255, 0.2);
    }
    100% {
      box-shadow: 0 0 35px rgba(0, 255, 255, 0.4),
                  inset 0 0 30px rgba(0, 255, 255, 0.3);
    }
  }
`;