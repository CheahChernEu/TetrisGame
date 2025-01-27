import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Title = styled(motion.h1)`
  color: #0ff;
  font-size: 48px;
  margin: 40px 0;
  padding: 0 20px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
              0 0 20px rgba(0, 255, 255, 0.5),
              0 0 30px rgba(0, 255, 255, 0.3),
              0 0 40px rgba(0, 255, 255, 0.2),
              0 0 50px rgba(0, 255, 255, 0.1);
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 4px;
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
  height: 800px;
  width: 1600px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  color: #fff;
  font-family: 'Orbitron', 'Arial', sans-serif;
  overflow: hidden;
`;

export const GameWrapper = styled(motion.div)<{ $isMultiplayer?: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.$isMultiplayer ? '1fr 1fr' : 'auto 220px'};
  gap: 40px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
              inset 0 0 20px rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  margin: 0 auto;
  width: ${props => props.$isMultiplayer ? '1400px' : '800px'};
  align-items: start;
  justify-content: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 350px;
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
  padding: 10px;
  border-radius: 5px;
  border: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.3),
              inset 0 0 20px rgba(0, 255, 255, 0.2);
  position: relative;
  width: 300px;
  height: 600px;
  margin: 0 auto;
  animation: boardGlow 4s infinite alternate;
  overflow: hidden;
  
  &::before {
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
    animation: gridMove 20s linear infinite;
    pointer-events: none;
  }
  
  &::before {
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
    animation: gridMove 20s linear infinite;
    pointer-events: none;
  }
`;

interface CellProps {
  $color?: string;
  $isNew?: boolean;
  $isCompleted?: boolean;
}

export const Cell = styled(motion.div)<CellProps>`
  width: 100%;
  height: 100%;
  background: ${({ $color }) => $color || '#1a1a1a'};
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  box-sizing: border-box;
  transition: background-color 0.2s;
  overflow: hidden;
  animation: ${({ $isNew }) => $isNew ? 'blockPlaceFlash 0.3s ease-out' : 'none'};

  ${props => props.$isNew && `
    animation: cellAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    @keyframes cellAppear {
      0% {
        transform: scale(0) rotate(-15deg);
        opacity: 0;
        filter: brightness(2) drop-shadow(0 0 10px ${props.$color || '#0ff'});
      }
      50% {
        transform: scale(1.2) rotate(5deg);
        opacity: 0.8;
        filter: brightness(1.5) drop-shadow(0 0 15px ${props.$color || '#0ff'});
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
        filter: brightness(1) drop-shadow(0 0 5px ${props.$color || '#0ff'});
      }
    }
  `}

  ${props => props.$isCompleted && `
    animation: lineComplete 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    @keyframes lineComplete {
      0% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1.5) blur(0px);
        box-shadow: 0 0 10px ${props.$color || '#0ff'},
                  0 0 20px ${props.$color || '#0ff'},
                  inset 0 0 5px ${props.$color || '#0ff'};
      }
      25% {
        transform: scale(1.2) rotate(2deg);
        filter: brightness(2) blur(1px);
        box-shadow: 0 0 30px ${props.$color || '#0ff'},
                  0 0 50px ${props.$color || '#0ff'},
                  inset 0 0 15px ${props.$color || '#0ff'};
      }
      50% {
        transform: scale(1.1) rotate(-2deg);
        filter: brightness(2.5) blur(2px);
        box-shadow: 0 0 40px ${props.$color || '#0ff'},
                  0 0 60px ${props.$color || '#0ff'},
                  inset 0 0 20px ${props.$color || '#0ff'};
      }
      75% {
        transform: scale(0.9) rotate(1deg);
        filter: brightness(3) blur(3px);
        box-shadow: 0 0 50px ${props.$color || '#0ff'},
                  0 0 70px ${props.$color || '#0ff'},
                  inset 0 0 25px ${props.$color || '#0ff'};
      }
      100% {
        transform: scale(0) rotate(-1deg);
        filter: brightness(0) blur(4px);
        box-shadow: 0 0 0 ${props.$color || '#0ff'},
                  0 0 0 ${props.$color || '#0ff'},
                  inset 0 0 0 ${props.$color || '#0ff'};
      }
    }
  `}
  
  @media (max-width: 768px) {
    width: min(95vw, 300px);
    height: min(90vh, 600px);
  }

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
    background: ${props => props.$color ? `linear-gradient(135deg, ${props.$color}20 0%, transparent 100%)` : 'transparent'};
    box-shadow: ${props => props.$color ? `0 0 10px ${props.$color}80` : 'none'};
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 600px;
  justify-content: flex-start;
  width: 220px;
`;

export const ScoreBoard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
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
    font-size: 14px;
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
      filter: brightness(2) drop-shadow(0 0 15px rgba(0, 255, 255, 0.8));
      transform: scale(1.2) rotate(5deg);
    }
    50% {
      filter: brightness(1.5) drop-shadow(0 0 10px rgba(0, 255, 255, 0.6));
      transform: scale(1.1) rotate(-3deg);
    }
    100% {
      filter: brightness(1) drop-shadow(0 0 5px rgba(0, 255, 255, 0.4));
      transform: scale(1) rotate(0deg);
    }
  }
  
  @keyframes rippleEffect {
    0% {
      border: 2px solid rgba(0, 255, 255, 0.8);
      transform: scale(1);
      opacity: 1;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    }
    50% {
      border: 2px solid rgba(0, 255, 255, 0.4);
      transform: scale(1.2);
      opacity: 0.5;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
    }
    100% {
      border: 2px solid rgba(0, 255, 255, 0);
      transform: scale(1.4);
      opacity: 0;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
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
  
  @keyframes gridMove {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @keyframes boardGlow {
    0% {
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.3),
                  inset 0 0 20px rgba(0, 255, 255, 0.2);
      border-color: rgba(0, 255, 255, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.5),
                  inset 0 0 35px rgba(0, 255, 255, 0.4);
      border-color: rgba(0, 255, 255, 0.6);
    }
    100% {
      box-shadow: 0 0 35px rgba(0, 255, 255, 0.4),
                  inset 0 0 30px rgba(0, 255, 255, 0.3);
      border-color: rgba(0, 255, 255, 0.4);
    }
  }
  
  @keyframes boardGlow {
    0% {
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.3),
                  inset 0 0 20px rgba(0, 255, 255, 0.2);
      border-color: rgba(0, 255, 255, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.5),
                  inset 0 0 35px rgba(0, 255, 255, 0.4);
      border-color: rgba(0, 255, 255, 0.6);
    }
    100% {
      box-shadow: 0 0 35px rgba(0, 255, 255, 0.4),
                  inset 0 0 30px rgba(0, 255, 255, 0.3);
      border-color: rgba(0, 255, 255, 0.4);
    }
  }
`;