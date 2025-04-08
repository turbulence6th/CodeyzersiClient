import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './ReversiGame.css';
import { initialBoard, getNewBoard, PLAYER_BLACK, PLAYER_WHITE, EMPTY, HINT } from '../constants/gameConstants';
import Board from './Board';
import GameInfo from './GameInfo';
import Tutorial from './Tutorial';
import config from '../config';

// Axios instance with baseURL from config
const api = axios.create({
  baseURL: config.apiUrl
});

const ReversiGame = () => {
  // Oyun state'i
  const [board, setBoard] = useState(() => getNewBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_BLACK);
  const [gameStatus, setGameStatus] = useState({ isPlaying: true, message: '' });
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [loading, setLoading] = useState(false);
  const [hints, setHints] = useState([]);
  const [flippingCells, setFlippingCells] = useState([]); // Çevrilen taşları izlemek için
  const [showTutorial, setShowTutorial] = useState(false);
  const [difficulty, setDifficulty] = useState('normal'); // Zorluk seviyesi: 'easy', 'normal', 'hard'
  const isLocked = useRef(false);

  // Skorları hesapla
  const calculateScores = useCallback((currentBoard) => {
    let blackCount = 0;
    let whiteCount = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] === PLAYER_BLACK) blackCount++;
        else if (currentBoard[row][col] === PLAYER_WHITE) whiteCount++;
      }
    }
    
    return { black: blackCount, white: whiteCount };
  }, []);

  // Tahta yönetimi için array kopyalama (derin kopya)
  const cloneBoard = useCallback((boardToClone) => {
    return boardToClone.map(row => [...row]);
  }, []);

  // Çevrilecek taşları bul
  const getFlips = useCallback((currentBoard, row, col, player) => {
    if (currentBoard[row][col] !== EMPTY) return [];
    
    const directions = [
      [-1, 0], // Yukarı
      [1, 0],  // Aşağı
      [0, -1], // Sol
      [0, 1],  // Sağ
      [-1, -1], // Sol Yukarı
      [-1, 1],  // Sağ Yukarı
      [1, -1],  // Sol Aşağı
      [1, 1]    // Sağ Aşağı
    ];
    
    const opponent = player === PLAYER_BLACK ? PLAYER_WHITE : PLAYER_BLACK;
    let flips = [];
    
    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      const directionFlips = [];
      
      while (x >= 0 && x < 8 && y >= 0 && y < 8 && currentBoard[x][y] === opponent) {
        directionFlips.push({ row: x, col: y });
        x += dx;
        y += dy;
      }
      
      if (directionFlips.length > 0 && x >= 0 && x < 8 && y >= 0 && y < 8 && currentBoard[x][y] === player) {
        flips = [...flips, ...directionFlips];
      }
    }
    
    return flips;
  }, []);

  // Geçerli hamleleri bul
  const findValidMoves = useCallback((currentBoard, player) => {
    const validMoves = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] !== EMPTY) continue;
        
        const flips = getFlips(currentBoard, row, col, player);
        if (flips.length > 0) {
          validMoves.push({ row, col, flips });
        }
      }
    }
    
    return validMoves;
  }, [getFlips]);

  // Hamle yap ve animasyonu göster
  const makeMove = async (row, col) => {
    if (isLocked.current || !gameStatus.isPlaying || currentPlayer !== PLAYER_BLACK) return;
    
    const flips = getFlips(board, row, col, PLAYER_BLACK);
    if (flips.length === 0) return;
    
    isLocked.current = true;
    
    try {
      // Hamle başladığı anda ipuçlarını temizle
      setHints([]);
      
      // Tahtayı tek seferde güncelleyelim
      const updatedBoard = applyMove(board, row, col, PLAYER_BLACK, flips);
      
      // Animasyon için her taşı tek tek güncelleyelim
      let animationBoard = cloneBoard(board);
      
      // Önce hamle yapılan taşı ekleyelim
      animationBoard[row][col] = PLAYER_BLACK;
      setBoard(animationBoard);
      await sleep(150);
      
      // Sonra çevrilen taşları animasyon ile gösterelim
      for (const flip of flips) {
        // Çevrilen taşı işaretle (flip animasyonu için)
        setFlippingCells(prev => [...prev, { row: flip.row, col: flip.col }]);
        await sleep(400); // Flip animasyonu süresi kadar bekle
        
        // Taşı çevir
        animationBoard = cloneBoard(animationBoard);
        animationBoard[flip.row][flip.col] = PLAYER_BLACK;
        setBoard(animationBoard);
        
        // Flip animasyonunu kaldır
        setFlippingCells(prev => prev.filter(cell => 
          !(cell.row === flip.row && cell.col === flip.col)
        ));
      }
      
      // Son tahta durumunu set edelim (animasyon ile aynı olmalı)
      setBoard(updatedBoard);
      
      // Skorları güncelle
      const newScores = calculateScores(updatedBoard);
      setScores(newScores);
      
      // Sıra AI'a geç
      setCurrentPlayer(PLAYER_WHITE);
      
      // AI hamlesi yap
      await playAI(updatedBoard);
    } catch (error) {
      console.error("Hamle yaparken hata:", error);
    } finally {
      isLocked.current = false;
    }
  };
  
  // Hamleyi tahtaya uygula ve yeni tahtayı döndür
  const applyMove = (currentBoard, row, col, player, flips) => {
    const newBoard = cloneBoard(currentBoard);
    
    // Yeni taşı ekle
    newBoard[row][col] = player;
    
    // Çevrilecek taşları güncelle
    for (const flip of flips) {
      newBoard[flip.row][flip.col] = player;
    }
    
    return newBoard;
  };
  
  // AI hamlesi yap
  const playAI = async (currentBoard) => {
    setLoading(true);
    try {
      // AI hamlesi sırasında ipuçlarını temizle
      setHints([]);
      
      // Önce AI için geçerli hamle olup olmadığını kontrol et
      const aiMoves = findValidMoves(currentBoard, PLAYER_WHITE);
      
      // Eğer AI için geçerli hamle yoksa, oyun durumunu kontrol et ve oyuncuya geç
      if (aiMoves.length === 0) {
        console.log("AI için geçerli hamle yok, sıra oyuncuya geçiyor...");
        setCurrentPlayer(PLAYER_BLACK);
        checkGameState(currentBoard);
        return;
      }
      
      isLocked.current = true;
      
      // JSON request için data hazırla
      const data = {
        board: currentBoard,
        difficulty: difficulty
      };
      
      // AI'dan hamle iste
      const response = await api.post('/move', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.data.x !== undefined && response.data.y !== undefined) {
        const aiRow = response.data.x;
        const aiCol = response.data.y;
        
        // Çevrilecek taşları bul (mevcut tahta durumunu kullanarak)
        const aiFlips = getFlips(currentBoard, aiRow, aiCol, PLAYER_WHITE);
        
        // Tahtayı tek seferde güncelle
        const updatedBoard = applyMove(currentBoard, aiRow, aiCol, PLAYER_WHITE, aiFlips);
        
        // Animasyon için adım adım göster
        let animationBoard = cloneBoard(currentBoard);
        
        // Önce AI'nın hamlesini göster
        animationBoard[aiRow][aiCol] = PLAYER_WHITE;
        setBoard(animationBoard);
        await sleep(150);
        
        // Sonra çevrilen taşları animasyon ile göster
        for (const flip of aiFlips) {
          // Çevrilen taşı işaretle (flip animasyonu için)
          setFlippingCells(prev => [...prev, { row: flip.row, col: flip.col }]);
          await sleep(400); // Flip animasyonu süresi kadar bekle
          
          // Taşı çevir
          animationBoard = cloneBoard(animationBoard);
          animationBoard[flip.row][flip.col] = PLAYER_WHITE;
          setBoard(animationBoard);
          
          // Flip animasyonunu kaldır
          setFlippingCells(prev => prev.filter(cell => 
            !(cell.row === flip.row && cell.col === flip.col)
          ));
        }
        
        // Son tahta durumunu set et
        setBoard(updatedBoard);
        
        // Skorları güncelle
        const newScores = calculateScores(updatedBoard);
        setScores(newScores);
        
        // Oyuncu sırasına geç
        setCurrentPlayer(PLAYER_BLACK);
        
        // Oyun durumunu kontrol et (güncel tahta ile)
        checkGameState(updatedBoard);
      } else {
        // Eğer backend'den geçerli bir hamle gelmezse, oyun durumunu kontrol et
        console.warn("Backend'den geçerli bir hamle alınamadı.");
        checkGameState(currentBoard);
      }
    } catch (error) {
      console.error("AI hamlesi alınamadı:", error);
      // Hata durumunda da oyun durumunu kontrol et
      checkGameState(board);
    } finally {
      setLoading(false);
    }
  };
  
  // Oyun durumunu kontrol et
  const checkGameState = useCallback((currentBoard) => {
    const blackMoves = findValidMoves(currentBoard, PLAYER_BLACK);
    const whiteMoves = findValidMoves(currentBoard, PLAYER_WHITE);
    
    console.log(`Olası hamleler - Siyah: ${blackMoves.length}, Beyaz: ${whiteMoves.length}`);
    
    // Her iki taraf da hamle yapamıyorsa oyun bitti
    if (blackMoves.length === 0 && whiteMoves.length === 0) {
      const { black, white } = calculateScores(currentBoard);
      let message = '';
      
      if (black > white) {
        message = `Siyah kazandı! (${black}-${white})`;
      } else if (white > black) {
        message = `Beyaz kazandı! (${white}-${black})`;
      } else {
        message = `Berabere! (${black}-${white})`;
      }
      
      console.log("Oyun bitti: " + message);
      setGameStatus({ isPlaying: false, message });
      return true; // Oyun bitti bilgisini döndür
    } 
    // Oyuncu hamle yapamıyorsa ve AI yapabiliyorsa AI'a geç
    else if (currentPlayer === PLAYER_BLACK && blackMoves.length === 0 && whiteMoves.length > 0) {
      console.log("Oyuncu hamle yapamıyor, sıra AI'a geçiyor...");
      setCurrentPlayer(PLAYER_WHITE);
      playAI(currentBoard);
      return false;
    } 
    // AI hamle yapamıyorsa ve oyuncu yapabiliyorsa oyuncuya geç
    else if (currentPlayer === PLAYER_WHITE && whiteMoves.length === 0 && blackMoves.length > 0) {
      console.log("AI hamle yapamıyor, sıra oyuncuya geçiyor...");
      setCurrentPlayer(PLAYER_BLACK);
      return false;
    }
    
    // Normal oyun durumu - oyun devam ediyor
    return false;
  }, [calculateScores, currentPlayer, findValidMoves]);
  
  // İpuçlarını hesapla - board veya oyuncu değiştiğinde
  useEffect(() => {
    // Yalnızca oyuncu sırasında ve oyun devam ediyorsa ipuçlarını hesapla
    if (currentPlayer === PLAYER_BLACK && gameStatus.isPlaying && !isLocked.current) {
      const validMoves = findValidMoves(board, PLAYER_BLACK);
      setHints(validMoves);
      
      // Oyuncu için hamle kalmadıysa, oyun durumunu kontrol et
      if (validMoves.length === 0 && gameStatus.isPlaying) {
        console.log("Oyuncu için hamle kalmadı, durum kontrol ediliyor...");
        checkGameState(board);
      }
    } else {
      // AI sırası geldiğinde ipuçlarını temizle
      setHints([]);
    }
  }, [board, currentPlayer, findValidMoves, gameStatus.isPlaying, checkGameState]);
  
  // Zorluk seviyesini değiştir
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Oyunu sıfırla
  const resetGame = () => {
    const freshBoard = getNewBoard();
    setBoard(freshBoard);
    setCurrentPlayer(PLAYER_BLACK);
    setGameStatus({ isPlaying: true, message: '' });
    setScores({ black: 2, white: 2 });
    setHints([]);
    setFlippingCells([]);
    isLocked.current = false;
    // Zorluk seviyesi sıfırlanmaz, mevcut seçim korunur
  };
  
  // Gecikme fonksiyonu
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Toggle tutorial visibility
  const toggleTutorial = () => {
    setShowTutorial(prev => !prev);
  };

  return (
    <div className="reversi-game">
      <GameInfo
        scores={scores}
        currentPlayer={currentPlayer}
        loading={loading}
        gameStatus={gameStatus}
        onReset={resetGame}
        onToggleTutorial={toggleTutorial}
        difficulty={difficulty}
        onChangeDifficulty={changeDifficulty}
      />
      
      <div className="game-container">
        <div className="board-container">
          <Board
            board={board}
            hints={hints}
            onCellClick={makeMove}
            currentPlayer={currentPlayer}
            flippingCells={flippingCells}
          />
        </div>
      </div>
      
      {showTutorial && <Tutorial onClose={toggleTutorial} />}
    </div>
  );
};

export default ReversiGame; 