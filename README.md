PlayVerse - Interactive Gaming Platform
Welcome to PlayVerse, an engaging web-based gaming suite featuring four exciting games: Tic-Tac-Toe, Memory Match, Wordle, and an AI-powered 20 Questions challenge. Built from scratch, this project showcases modern web development techniques and interactive design.
Overview

Tic-Tac-Toe: Classic 3x3 grid game with win animations.
Memory Match: Card-flipping memory game with matching pairs.
Wordle: Guess the word with color-coded feedback.
20 Questions: AI-driven game where the bot guesses your object with yes/no questions.

Technologies Used

Frontend: React.js (with hooks: useState, useEffect, useCallback), CSS3 (animations, flexbox, 3D transforms)
AI Integration: OpenRouter API (GPT-4o-mini model)
Version Control: Git/GitHub
Hosting: Ngrok (for local tunneling to public URL)

Features

Responsive, cosmic-themed UI with animated effects.
Real-time game logic and state management.
AI-powered chat interface for 20 Questions.
Cross-device compatibility with accessibility considerations.
Hostable via Ngrok for public access to your local development server.

Installation

Clone the repository:git clone https://github.com/Raiden117/playverse.git


Navigate to the project directory:cd playverse


Install dependencies:npm install


Set up your OpenRouter API key:
Create a .env file in the root directory.
Add your API key: OPENROUTER_API_KEY=your_api_key_here.


Start the development server:npm start

Open http://localhost:3000 to play locally!

Hosting with Ngrok
To share your local PlayVerse instance publicly:

Install Ngrok: Download and install from ngrok.com.
Run Ngrok with the following command, pointing to your local server port (default is 3000):ngrok http 3000


Copy the provided public URL (e.g., https://abcdef123.ngrok.io) and share it. This tunnels your local server to the internet.
Note: Ngrok URLs are temporary unless you have a paid plan; restart Ngrok to get a new URL.

Usage

Navigate between games using the homepage grid.
For 20 Questions, think of an object and answer the AI's yes/no questions.
Enjoy the animations and reset games as needed.
Test the public link via Ngrok to demo to others.

Contributing
Feel free to fork this repository, submit issues, or create pull requests. Contributions to enhance game mechanics, UI, or Ngrok integration are welcome!
License
This project is open-source under the MIT License.
Author

Nipun KrishnanGitHub | LinkedIn

Screenshots
(Add images of each game in action here, e.g., ![Tic-Tac-Toe](screenshots/tictactoe.png))
Acknowledgments

Thanks to the open-source community for React, OpenRouter API, and Ngrok.
Inspired by classic games and modern web design trends.
