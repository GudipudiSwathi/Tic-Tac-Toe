import React, { useState, useEffect } from 'react';
import './App.css';

const emptyBoard = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [darkMode, setDarkMode] = useState(false);

  const currentPlayer = xIsNext ? 'X' : 'O';

  useEffect(() => {
    if ((mode === 'EASY' || mode === 'HARD') && !xIsNext && !winner) {
      const timeout = setTimeout(() => {
        const move = mode === 'EASY' ? getRandomMove() : getBestMove(board);
        handleClick(move);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [board, xIsNext, mode, winner]);

  const getRandomMove = () => {
    const empty = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const getBestMove = (newBoard) => {
    const bestMove = minimax(newBoard, 'O').index;
    return bestMove;
  };

  const minimax = (newBoard, player) => {
    const availSpots = newBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);

    const winnerCheck = calculateWinner(newBoard);
    if (winnerCheck === 'X') return { score: -10 };
    if (winnerCheck === 'O') return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const idx = availSpots[i];
      const move = { index: idx };
      newBoard[idx] = player;

      const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
      move.score = result.score;

      newBoard[idx] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      moves.forEach((m, i) => {
        if (m.score > bestScore) {
          bestScore = m.score;
          bestMove = i;
        }
      });
    } else {
      let bestScore = Infinity;
      moves.forEach((m, i) => {
        if (m.score < bestScore) {
          bestScore = m.score;
          bestMove = i;
        }
      });
    }

    return moves[bestMove];
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    const win = calculateWinner(newBoard);

    if (win) {
      setWinner(win);
      setScores((prev) => ({ ...prev, [win]: prev[win] + 1 }));
    } else if (!newBoard.includes(null)) {
      setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }));
      setWinner('Draw');
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a];
    }
    return null;
  };

  const restartGame = () => {
    setBoard(emptyBoard);
    setWinner(null);
    setXIsNext(true);
  };

  const backToMenu = () => {
    setMode(null);
    restartGame();
    setScores({ X: 0, O: 0, Draws: 0 });
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️' : '🌙'}
      </button>
      <h1 className="game-title">Tic Tac Toe </h1>

      {!mode ? (
        <div className="mode-selection">
          <h2>Choose Game Mode</h2>
          <div className="buttons">
            <button onClick={() => setMode('PVP')}>
              <img src="/pvp.png" alt="PVP" />
              🧍‍♂️ vs 🧍‍♀️
            </button>
            <button onClick={() => setMode('EASY')}>
              <img src="/easy.png" alt="Easy AI" />
              Easy AI
            </button>
            <button onClick={() => setMode('HARD')}>
              <img src="/hard.png" alt="Hard AI" />
              Hard AI
            </button>
          </div>
        </div>
      ) : (
        <div className="game">
          <h2>{mode === 'PVP' ? 'Player vs Player' : mode === 'EASY' ? 'Player vs AI' : 'Player vs Smart AI'}</h2>
          <div className="scoreboard">
            <span>❌ : {scores.X}</span>
            <span>⭕ : {scores.O}</span>
            <span>🤝 Draws: {scores.Draws}</span>
          </div>
          <div className="board">
            {board.map((val, idx) => (
              <div key={idx} className="square" onClick={() => handleClick(idx)}>
                {val}
              </div>
            ))}
          </div>
          {winner && <div className="result-popup">
              {winner === 'Draw' ? '🤝It\'s a Draw!🎊' : `${winner} Wins! 🎉🔥`}
              </div>}
          <div className="controls">
            <button onClick={restartGame}>🔄 Restart</button>
            <button onClick={backToMenu}>⬅ Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
