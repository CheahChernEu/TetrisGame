import styled from 'styled-components';

export const InstructionsPanel = styled.div`
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
    text-align: center;
  }

  .controls-section {
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .controls-title {
    color: #0ff;
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    text-align: center;
    text-shadow: 0 0 3px rgba(0, 255, 255, 0.5);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.9);
  }

  .key {
    background: rgba(0, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    color: #0ff;
    font-family: 'Orbitron', monospace;
    min-width: 20px;
    text-align: center;
    text-shadow: 0 0 2px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    padding: 10px;

    h3 {
      font-size: 0.8em;
    }

    li {
      font-size: 0.7em;
    }
  }
`;