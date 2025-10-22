import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegCircle, FaBrain, FaQuestion, FaRegSmile, FaPencilAlt } from "react-icons/fa"; // Added FaPencilAlt

const Home = () => {
  const scrollToOptions = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const games = [
    { name: "Tic Tac Toe", icon: <FaRegCircle size={48} color="#ff6f3c" style={{ filter: "drop-shadow(2px 2px #ffb86b)" }} />, bg: "#ffe0b2", path: "/tictactoe" },
    { name: "Memory Game", icon: <FaBrain size={48} color="#1e90ff" style={{ filter: "drop-shadow(2px 2px #a3bffa)" }} />, bg: "#e0f7fa", path: "/memory" },
    { name: "Wordle", icon: <FaPencilAlt size={48} color="#4CAF50" style={{ filter: "drop-shadow(2px 2px 4px #81C784) drop-shadow(0 0 6px #4CAF50)" }} />, bg: "#e0ffe0", path: "/wordle" },
    { name: "20 Questions", icon: <FaRegSmile size={48} color="#ffb86b" style={{ filter: "drop-shadow(2px 2px #ff6f3c)" }} />, bg: "#fffbe7", path: "/twentyquestions" },
  ];

  // State for floating elements
  const [floatingItems, setFloatingItems] = useState([]);

  // Generate random floating items
  useEffect(() => {
    const addFloatingItem = () => {
      const types = ["tictactoe", "memory"];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = Math.random() * 50 + 50;
      const left = Math.random() * 80;
      const animationDuration = Math.random() * 10 + 10;

      setFloatingItems((prev) => [
        ...prev,
        { id: Date.now(), type, size, left, animationDuration, fadeOut: false },
      ]);

      setTimeout(() => {
        setFloatingItems((prev) =>
          prev.map((item) =>
            item.id === Date.now() ? { ...item, fadeOut: true } : item
          )
        );
        setTimeout(() => {
          setFloatingItems((prev) => prev.filter((item) => item.id !== Date.now()));
          addFloatingItem();
        }, 1000);
      }, animationDuration * 1000);
    };

    for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
      addFloatingItem();
    }

    return () => setFloatingItems([]);
  }, []);

  return (
    <div className="home-container" aria-label="Game Selection">
      <h1 className="home-title">PlayVerse</h1>
      <button className="scroll-down" onClick={scrollToOptions}>
        ↓
      </button>
      <div className="games-grid">
        {games.map((game) => (
          <Link
            to={game.path}
            className="game-box"
            style={{ background: game.bg }}
            key={game.name}
            aria-label={game.name}
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-name">{game.name}</div>
          </Link>
        ))}
      </div>
      {floatingItems.map((item) => (
        <div
          key={item.id}
          className={`floating-item ${item.type} ${item.fadeOut ? "fade-out" : ""}`}
          style={{
            width: `${item.size}px`,
            height: `${item.size}px`,
            left: `${item.left}%`,
            animationDuration: `${item.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Home;