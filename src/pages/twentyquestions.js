import React, { useState, useEffect, useCallback, useRef } from "react";


const TwentyQuestions = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY; // Replace with your OpenRouter API key

  // Ref to track the last message for auto-scrolling
  const messagesEndRef = useRef(null);

  // System prompt for the AI to play 20 Questions
  const systemPrompt = "You are a 20 Questions game bot. The user is thinking of an object, animal, person, or thing. Ask yes/no questions to guess what it is. You have up to 20 questions. After each answer, ask the next question or make a guess. If you think you know, say 'I guess: [your guess]'. If the user says the guess is wrong, continue asking. End the game after 20 questions or a correct guess.";

  // Memoized sendMessageToAI function
  const sendMessageToAI = useCallback(async (userMessage) => {
    if (isThinking || isGameOver || !userMessage.trim()) return;

    setIsThinking(true);
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      setQuestionCount((prev) => prev + 1);

      if (aiReply.toLowerCase().includes("i guess") || questionCount >= 20) {
        setIsGameOver(true);
      }
    } catch (error) {
      console.error("API Error:", error.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Couldn't connect to the AI. Please check your API key or network and try again!" },
      ]);
    } finally {
      setIsThinking(false);
    }
  }, [isThinking, isGameOver, messages, questionCount]);

  // Start the game with the first AI question only once on mount
  useEffect(() => {
    let isMounted = true;

    const startGame = async () => {
      if (isMounted && messages.length === 0) {
        setIsThinking(true);
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "system", content: systemPrompt }],
            }),
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          const aiReply = data.choices[0].message.content;

          if (isMounted) {
            setMessages([{ role: "assistant", content: aiReply }]);
            setQuestionCount(1);
          }
        } catch (error) {
          console.error("API Error:", error.message);
          if (isMounted) {
            setMessages([{ role: "assistant", content: "Oops! Couldn't start the game. Please check your API key or network and try again!" }]);
          }
        } finally {
          if (isMounted) setIsThinking(false);
        }
      }
    };

    startGame();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isThinking && !isGameOver) {
      sendMessageToAI(input);
      setInput("");
    }
  };

  const resetGame = () => {
    setMessages([]);
    setInput("");
    setQuestionCount(0);
    setIsGameOver(false);
    setIsThinking(false);
  };

  // Scroll to the last message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="tictac-wrapper">
      <h1 className="tictac-title">20 Questions</h1>
      <div className="tictac-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <span>{msg.role === "assistant" ? "AI: " : "You: "}</span>
              {msg.content}
            </div>
          ))}
          {isThinking && <div className="chat-message assistant">AI is thinking...</div>}
          <div ref={messagesEndRef} /> {/* Marker for scrolling to the end */}
        </div>
        {!isGameOver && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Answer yes/no..."
              disabled={isThinking}
            />
            <button type="submit" disabled={isThinking}>
              Send
            </button>
          </form>
        )}
        {isGameOver && (
          <div className="tictac-winner-screen">
            <div className="tictac-winner">Game Over!</div>
            <button className="tictac-reset" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwentyQuestions;