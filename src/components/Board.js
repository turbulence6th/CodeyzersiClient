import React from 'react';
import './Board.css';
import Cell from './Cell';
import { PLAYER_BLACK, PLAYER_WHITE, EMPTY } from '../constants/gameConstants';

const Board = ({ board, hints, onCellClick, currentPlayer, flippingCells = [] }) => {
  // İpuçlarını kontrol ederek satır ve sütun için ipucu var mı kontrol et
  const getHintValue = (row, col) => {
    return hints.find(hint => hint.row === row && hint.col === col);
  };
  
  // Hücre flip durumunda mı kontrol et
  const isFlipping = (row, col) => {
    return flippingCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const hint = getHintValue(rowIndex, colIndex);
            const hintValue = hint ? hint.flips.length : 0;
            
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                hint={hint ? hintValue : null}
                onClick={() => onCellClick(rowIndex, colIndex)}
                highlight={false}
                isFlipping={isFlipping(rowIndex, colIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board; 