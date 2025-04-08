import React from 'react';
import './Cell.css';
import { PLAYER_BLACK, PLAYER_WHITE, EMPTY } from '../constants/gameConstants';

const Cell = ({ value, hint, onClick, highlight, isFlipping }) => {
  const getClassNames = () => {
    let classes = 'cell';
    
    if (highlight) {
      classes += ' highlight';
    }
    
    return classes;
  };
  
  const getPieceClassNames = () => {
    let classes = 'cell-piece';
    
    if (value === PLAYER_BLACK) {
      classes += ' black';
    } else if (value === PLAYER_WHITE) {
      classes += ' white';
    }
    
    if (isFlipping) {
      classes += ' flipping';
    }
    
    return classes;
  };

  return (
    <div className={getClassNames()} onClick={onClick}>
      {value !== EMPTY && (
        <div className={getPieceClassNames()}>
          <div className="cell-piece-front"></div>
          <div className="cell-piece-back"></div>
        </div>
      )}
      
      {hint && (
        <div className="hint">
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
};

export default Cell; 