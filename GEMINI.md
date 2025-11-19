# GEMINI.md - Project Analysis

## Project Overview

This project is a web-based "Vampire Survivors" style clone game. It is built using modern, vanilla JavaScript (ES6+), HTML5 Canvas for rendering, and CSS for the user interface. The game features a player character who automatically attacks, fights waves of enemies, collects experience, levels up, and chooses perks to become more powerful over time.

The project follows a clear, object-oriented structure that separates concerns into different modules.

### Core Architecture

*   **`index.html`**: The main entry point of the application. It defines the HTML structure for the game canvas, main menu, heads-up display (HUD), and various modal screens (Level Up, Game Over).
*   **`js/main.js`**: Acts as the initializer. It sets up the main menu, handles character selection, and starts the game. It bridges the gap between the UI (HTML) and the core game logic.
*   **`js/Game.js`**: The heart of the project. This class manages the main game loop, holds the game state (score, time, entities), orchestrates all game entities, handles spawning logic, and processes game events like level-ups and game over.
*   **`js/Renderer.js`**: Encapsulates all drawing logic. It is responsible for clearing and drawing all game objects onto the HTML5 canvas.
*   **`js/InputHandler.js`**: Manages all player input from the keyboard (e.g., movement).
*   **`js/entities/`**: This directory contains class definitions for all game objects, including:
    *   `Player.js`: The player character.
    *   `Enemy.js`: The various enemies the player fights.
    *   `Projectile.js`: Bullets or other things that fly across the screen.
    *   And others like `Item.js`, `Trap.js`, etc.
*   **`js/data/`**: This directory externalizes game configuration and static data, which is a good practice.
    *   `GameConfig.js`: Defines parameters for enemy spawning, wave composition, airdrops, and more.
    *   `characters.js`: Defines the playable characters and their stats/skills.
    *   `perks.js`: Defines the available level-up perks.
*   **`css/style.css`**: Contains all the styling for the UI elements, creating a polished, cyberpunk-themed aesthetic.

## Building and Running

This project does not have a formal build system (like Webpack or Vite). It is a collection of static files that use ES Modules.

To run the game, you must serve the files from a local web server. Simply opening the `index.html` file directly in your browser will likely fail due to CORS restrictions on loading JavaScript modules from the local filesystem.

### Running with a Local Web Server

1.  Make sure you have a local web server installed. If you don't, you can use one of these simple options:
    *   **Node.js:** If you have Node.js installed, open your terminal in the project root and run `npx serve`.
    *   **Python:** If you have Python installed, open your terminal in the project root and run `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
    *   **XAMPP/WAMP/MAMP:** The user is using XAMPP, so placing the project folder (`tdg`) inside the `htdocs` directory and navigating to `http://localhost/menschki/tdg/` in the browser will work.

2.  Once the server is running, open your web browser and navigate to the local URL provided by your server (e.g., `http://localhost:8080` or `http://localhost/menschki/tdg/`).

3.  The game's main menu should appear, and you can start playing.

## Development Conventions

*   **Modularity**: The code is highly modular, with each file and class responsible for a single piece of functionality. This is enforced through the use of ES6 modules (`import`/`export`).
*   **Object-Oriented Programming**: The codebase heavily relies on classes to define game entities and systems (`Game`, `Player`, `Renderer`, etc.).
*   **Data Separation**: Game configuration is kept separate from game logic in the `js/data/` directory. This makes it easy to tweak game balance and add new content without changing the core code.
*   **No Dependencies**: The project is written in pure JavaScript, HTML, and CSS with no external libraries or frameworks.
*   **State Management**: The central game state is managed within the `Game.js` instance. Entities are stored in arrays within this object.
