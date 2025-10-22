import React, { useState, useEffect, useRef } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const explosionRef = useRef(null);

  useEffect(() => {
    if (winner && winner !== "Draw" && explosionRef.current) {
      explosionRef.current.classList.add("explode");
      setTimeout(() => explosionRef.current.classList.remove("explode"), 1500); // Smoother duration
    }
  }, [winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores((prevScores) => ({
        ...prevScores,
        [gameWinner]: prevScores[gameWinner] + 1,
      }));
      setWinningLine(getWinningLine(newBoard, gameWinner));
    } else if (!newBoard.includes(null)) {
      setWinner("Draw");
    }
  };

  const calculateWinner = (board) => {
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

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getWinningLine = (board, winner) => {
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
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] === winner && board[b] === winner && board[c] === winner) {
        return line;
      }
    }
    return [];
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const getLineStyle = (line) => {
    const [a, c] = line;
    const isVertical = [0, 3, 6].includes(a);
    const isDiagonal1 = a === 0 && c === 8;
    const isDiagonal2 = a === 2 && c === 6;

    if (isVertical) {
      return `translate(${100 * (a % 3) + 50}px, -10px) rotate(90deg) scaleX(3)`;
    } else if (isDiagonal1) {
      return `translate(150px, 150px) rotate(45deg) scaleX(4.2)`;
    } else if (isDiagonal2) {
      return `translate(150px, 150px) rotate(-45deg) scaleX(4.2)`;
    }
    return `translate(${100 * (a % 3) + 50}px, ${50 + 100 * Math.floor(a / 3)}px) rotate(0deg) scaleX(3)`;
  };

  return (
    <div className="tictac-wrapper">
      <h1 className="tictac-title">Tic Tac Toe</h1>
      <div className="tictac-container">
        <div className="tictac-scoreboard">
          <div className="tictac-score">Player X: {scores.X}</div>
          <div className="tictac-score">Player O: {scores.O}</div>
        </div>
        <div className={`tictac-grid ${winner ? "disabled" : ""}`} style={{ position: "relative" }}>
          {board.map((cell, index) => (
            <div
              key={index}
              className={`tictac-cell ${cell ? "taken" : ""} ${!winner && !cell ? "hoverable" : ""} ${
                winningLine.includes(index) ? "winning" : ""
              } ${cell === "X" ? "taken X" : cell === "O" ? "taken O" : ""}`}
              onClick={() => handleClick(index)}
              style={{
                transition: "all 0.5s ease-in-out",
              }}
            >
              {cell}
            </div>
          ))}
          {winner && winningLine.length > 0 && (
            <div
              className="winning-line"
              style={{
                position: "absolute",
                transform: getLineStyle(winningLine),
                transition: "all 0.6s ease-in-out",
              }}
            />
          )}
        </div>
        {winner && (
          <div className="tictac-winner-screen">
            <div className="tictac-winner">
              {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
            </div>
            <button className="tictac-reset" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
      <div ref={explosionRef} className="explosion-container" />
    </div>
  );
};

export default TicTacToe;