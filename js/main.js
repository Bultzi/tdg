import { Game } from './Game.js';
import { Characters } from './data/characters.js';

const init = () => {
    // Loader Sequence - Run this first and independently
    setTimeout(() => {
        const loader = document.getElementById('loader');
        const mainMenu = document.getElementById('main-menu');
        
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.classList.add('hidden');
                if (mainMenu) mainMenu.classList.remove('hidden-initially');
            }, 500);
        }
    }, 2000);

    try {
        const game = new Game();
        
        // Populate Character Selection
        const charList = document.getElementById('character-list');
        let selectedChar = null;
        
        if (charList) {
            Object.keys(Characters).forEach(key => {
                const char = Characters[key];
                const card = document.createElement('div');
                card.className = 'char-card';
                card.innerHTML = `
                    <h3>${char.name}</h3>
                    <p>HP: ${char.stats.hp}</p>
                    <p>Skill: ${char.skills.q.name}</p>
                `;
                
                card.addEventListener('click', () => {
                    document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    selectedChar = char;
                    const startBtn = document.getElementById('start-btn');
                    if (startBtn) startBtn.disabled = false;
                });
                
                charList.appendChild(card);
            });
        }

        // Start Game
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('player-name');
                const name = nameInput ? nameInput.value.trim() : "Hero";
                
                if (name && selectedChar) {
                    game.start(name, selectedChar);
                } else {
                    alert("IDENTITY REQUIRED. SELECT AVATAR.");
                }
            });
        }
        
        // Highscore Modal Handling
        const highscoreBtn = document.getElementById('highscore-btn');
        const highscoreModal = document.getElementById('menu-highscore-modal');
        const closeHighscoreBtn = document.getElementById('close-highscore-btn');
        const highscoreList = document.getElementById('menu-highscore-list');

        if (highscoreBtn && highscoreModal && closeHighscoreBtn && highscoreList) {
            highscoreBtn.addEventListener('click', () => {
                const highscores = JSON.parse(localStorage.getItem('tdg_highscores')) || [];
                highscoreList.innerHTML = '';
                
                if (highscores.length === 0) {
                    highscoreList.innerHTML = '<li>NO DATA FOUND</li>';
                } else {
                    highscores.forEach((entry, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <span>#${index + 1} ${entry.name} [${entry.character}]</span>
                            <span>${entry.score} PTS</span>
                        `;
                        highscoreList.appendChild(li);
                    });
                }
                highscoreModal.classList.remove('hidden');
            });

            closeHighscoreBtn.addEventListener('click', () => {
                highscoreModal.classList.add('hidden');
            });
        }
        
        // Restart Game
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                location.reload();
            });
        }

    } catch (error) {
        console.error("Initialization Error:", error);
    }
};

// Handle module loading state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
