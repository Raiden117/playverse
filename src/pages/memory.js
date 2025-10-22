import React, { useState, useEffect, useRef } from "react";

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState({ player1: 0, player2: 0 });
  const [time, setTime] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const explosionRef = useRef(null);

  // Initialize 4x4 grid with 8 pairs of cards (icons as pairs)
  useEffect(() => {
    const pairs = [
      { id: 1, icon: "🍎" },
      { id: 2, icon: "🍌" },
      { id: 3, icon: "🍇" },
      { id: 4, icon: "🍊" },
      { id: 5, icon: "🍓" },
      { id: 6, icon: "🍍" },
      { id: 7, icon: "🥭" },
      { id: 8, icon: "🍉" },
    ];
    const shuffledCards = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, index }));
    setCards(shuffledCards);
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (matched.length < 16) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [matched.length]);

  // Handle card flip
  const handleFlip = (index) => {
    if (!canFlip || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setMatched((prev) => [...prev, first, second]);
        setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
        setFlipped([]);
        setCanFlip(true);
        if (matched.length + 2 === 16) {
          explosionRef.current.classList.add("explode");
          setTimeout(() => explosionRef.current.classList.remove("explode"), 1500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setCurrentPlayer(currentPlayer === "player1" ? "player2" : "player1");
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setFlipped([]);
    setMatched([]);
    setMoves({ player1: 0, player2: 0 });
    setTime(0);
    setCanFlip(true);
    setCurrentPlayer("player1");
    setScores({ player1: 0, player2: 0 });
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  return (
    <div className="tictac-wrapper">
      <h1 className="tictac-title">Memory Game</h1>
      <div className="tictac-container">
        <div className="scoreboard-layout">
          <div className="timer-box">Time: {Math.floor(time / 60)}m {time % 60}s</div>
          <div className="score-panel">
            <div className="player-score player1">Player 1: {scores.player1} Pairs (Moves: {moves.player1})</div>
            <div className="player-score player2">Player 2: {scores.player2} Pairs (Moves: {moves.player2})</div>
          </div>
          <div className="turn-indicator">Current Turn: {currentPlayer === "player1" ? "Player 1" : "Player 2"}</div>
        </div>
        <div className="memory-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`memory-cell ${flipped.includes(index) || matched.includes(index) ? "flipped" : ""}`}
              onClick={() => handleFlip(index)}
            >
              <div className="memory-card">
                <div className="memory-front">{card.icon}</div>
                <div className="memory-back" />
              </div>
            </div>
          ))}
        </div>
        {matched.length === 16 && (
          <div className="tictac-winner-screen">
            <div className="tictac-winner">
              {scores.player1 > scores.player2 ? "Player 1 Wins!" : scores.player2 > scores.player1 ? "Player 2 Wins!" : "It's a Tie!"}
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

export default MemoryGame;