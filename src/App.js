import React from 'react';
import './App.css';
import ReversiGame from './components/ReversiGame';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Reversi</h1>
      </header>
      <main className="content">
        <ReversiGame />
      </main>
    </div>
  );
}

export default App; 