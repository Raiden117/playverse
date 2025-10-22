import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import TicTacToe from "./pages/TicTacToe";
import MemoryGame from "./pages/memory";
import TwentyQuestions from "./pages/twentyquestions";
import Wordle from "./pages/Wordle"; // Added Wordle import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/twentyquestions" element={<TwentyQuestions />} />
        <Route path="/wordle" element={<Wordle />} />
      </Routes>
    </Router>
  );
};

export default App;