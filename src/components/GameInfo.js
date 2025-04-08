import React from 'react';
import './GameInfo.css';
import { PLAYER_BLACK, PLAYER_WHITE } from '../constants/gameConstants';

const GameInfo = ({ scores, currentPlayer, gameStatus, onReset, loading, onToggleTutorial, difficulty, onChangeDifficulty }) => {
  // Oyun devam ederken ve tahtada taşlar varsa zorluk ayarını değiştirmeyi engelle
  const isDifficultyLocked = loading || (gameStatus.isPlaying && (scores.black + scores.white > 4));

  return (
    <div className="game-info">
      <div className="score-display">
        <div className={`score-card ${currentPlayer === PLAYER_BLACK ? 'active' : ''}`}>
          <div className="piece-icon black"></div>
          <span className="score-value">{scores.black}</span>
        </div>
        
        <div className="game-actions">
          <button 
            className="action-button reset" 
            onClick={onReset}
            disabled={loading}
          >
            Yeni Oyun
          </button>
          <button 
            className="action-button tutorial" 
            onClick={onToggleTutorial}
            disabled={loading}
          >
            Stratejiler
          </button>
        </div>
        
        <div className={`score-card ${currentPlayer === PLAYER_WHITE ? 'active' : ''}`}>
          <div className="piece-icon white"></div>
          <span className="score-value">{scores.white}</span>
        </div>
      </div>
      
      <div className="difficulty-selector">
        <span className="difficulty-label">Zorluk Seviyesi</span>
        <div className="difficulty-buttons">
          <button 
            className={`difficulty-button ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => onChangeDifficulty('easy')}
            disabled={isDifficultyLocked}
            title={isDifficultyLocked ? "Zorluk seviyesini değiştirmek için yeni oyun başlatın" : ""}
          >
            Kolay
          </button>
          <button 
            className={`difficulty-button ${difficulty === 'normal' ? 'active' : ''}`}
            onClick={() => onChangeDifficulty('normal')}
            disabled={isDifficultyLocked}
            title={isDifficultyLocked ? "Zorluk seviyesini değiştirmek için yeni oyun başlatın" : ""}
          >
            Normal
          </button>
          <button 
            className={`difficulty-button ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => onChangeDifficulty('hard')}
            disabled={isDifficultyLocked}
            title={isDifficultyLocked ? "Zorluk seviyesini değiştirmek için yeni oyun başlatın" : ""}
          >
            Zor
          </button>
        </div>
      </div>
      
      <div className="status-message">
        {loading ? (
          <div className="loading-indicator">
            <span>AI düşünüyor...</span>
            <div className="spinner"></div>
          </div>
        ) : !gameStatus.isPlaying ? (
          <div className="game-result">{gameStatus.message}</div>
        ) : (
          <div className="current-turn">
            <span>Hamle sırası: </span>
            <div className={`turn-indicator ${currentPlayer === PLAYER_BLACK ? 'black' : 'white'}`}></div>
            <span className="turn-info">
              {currentPlayer === PLAYER_BLACK ? ' Siz' : ' Yapay Zeka'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInfo; 