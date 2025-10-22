import React, { useState, useEffect } from "react";

// Sample Wordle word list (expand to 2315 words for full accuracy)
const WORD_LIST = [
  "arise", "about", "apple", "crane", "dream", "fleas", "glory", "happy", "irony",
  "jolly", "knack", "lemon", "mango", "noble", "ocean", "piano", "quilt", "radar",
  "salty", "tiger", "ultra", "vivid", "wacky", "xenon", "yield", "zebra"
];

const Wordle = () => {
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Set daily word on mount and reset
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem("wordleDate");
    const savedWord = localStorage.getItem("wordleWord");

    if (savedDate !== today || !savedWord) {
      const seed = Date.now(); // Simple seed based on timestamp
      const index = Math.abs(seed % WORD_LIST.length);
      const newWord = WORD_LIST[index].toLowerCase();
      localStorage.setItem("wordleDate", today);
      localStorage.setItem("wordleWord", newWord);
      setTargetWord(newWord);
    } else {
      setTargetWord(savedWord);
    }
  }, []);

  // Handle input from onKeyDown
  const handleInput = (e) => {
    if (isGameOver || currentRow >= 6 || !targetWord) return;

    const key = e.key;
    e.preventDefault();

    if (key === "Enter" && currentGuess.length === 5) {
      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);
      setCurrentGuess("");
      setCurrentRow(currentRow + 1);

      if (currentGuess === targetWord) {
        setIsGameOver(true);
      } else if (currentRow + 1 === 6) {
        setIsGameOver(true);
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && key.length === 1 && key.match(/[a-z]/i)) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  };

  // Reset game
  const resetGame = () => {
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setCurrentRow(0);
    setIsGameOver(false);
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem("wordleDate");
    if (savedDate !== today) {
      const seed = Date.now();
      const index = Math.abs(seed % WORD_LIST.length);
      const newWord = WORD_LIST[index].toLowerCase();
      localStorage.setItem("wordleDate", today);
      localStorage.setItem("wordleWord", newWord);
      setTargetWord(newWord);
    }
  };

  return (
    <div className="tictac-wrapper">
      <h1 className="tictac-title">Wordle</h1>
      <div className="tictac-container">
        <div className="wordle-grid">
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="wordle-row">
              {Array(5)
                .fill()
                .map((_, colIndex) => {
                  const letter = guess[colIndex] || "";
                  const isCurrent = rowIndex === currentRow && !isGameOver;
                  const isPast = rowIndex < currentRow;
                  let color = "gray";
                  if (isPast && guess === targetWord) color = "green";
                  else if (isPast) {
                    if (targetWord.includes(letter)) color = "yellow";
                    if (targetWord[colIndex] === letter) color = "green";
                  }
                  return (
                    <div
                      key={colIndex}
                      className={`wordle-cell ${isCurrent ? "current" : ""}`}
                      style={{ backgroundColor: color }}
                    >
                      {letter}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
        {!isGameOver && (
          <div>
            <input
              type="text"
              value={currentGuess}
              onKeyDown={handleInput}
              placeholder="Type guess..."
              disabled={isGameOver}
              autoFocus
              onChange={(e) => e.preventDefault()}
            />
            <button onClick={() => handleInput({ key: "Enter" })} disabled={currentGuess.length < 5 || isGameOver}>
              Submit
            </button>
          </div>
        )}
        {isGameOver && (
          <div className="tictac-winner-screen">
            <div className="tictac-winner">{guesses.includes(targetWord) ? "You Win!" : `Game Over! Word was ${targetWord}`}</div>
            <button className="tictac-reset" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wordle;