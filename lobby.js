// Lobby - Handles lobby interactions and game selection

class Lobby {
    constructor() {
        this.gameCards = null;
        this.playButtons = null;
    }

    /**
     * Initialize lobby event listeners
     */
    init() {
        this.gameCards = document.querySelectorAll('.game-card');
        this.playButtons = document.querySelectorAll('.game-card .play-button');

        // Add click handlers to play buttons
        this.playButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click from triggering
                const card = button.closest('.game-card');
                this.handlePlayClick(card);
            });
        });

        // Add click handlers to game cards
        this.gameCards.forEach(card => {
            // Don't make locked cards clickable
            if (!card.classList.contains('game-card-locked')) {
                card.addEventListener('click', () => {
                    this.handlePlayClick(card);
                });
            }
        });

        console.log('✓ Lobby initialized');
    }

    /**
     * Handle play button/card click
     * @param {HTMLElement} card - The game card element
     */
    handlePlayClick(card) {
        const gameName = card.dataset.game;

        if (!gameName) {
            console.error('No game name found on card');
            return;
        }

        // Check if card is locked
        if (card.classList.contains('game-card-locked')) {
            console.log(`Game ${gameName} is locked`);
            return;
        }

        // Add click animation
        card.classList.add('card-clicked');
        setTimeout(() => {
            card.classList.remove('card-clicked');
        }, 300);

        // Start the game via game manager
        if (typeof gameManager !== 'undefined') {
            gameManager.startGame(gameName);
        } else {
            console.error('GameManager not found');
        }
    }

    /**
     * Add a visual effect when hovering over unlocked cards
     */
    addHoverEffects() {
        this.gameCards.forEach(card => {
            if (!card.classList.contains('game-card-locked')) {
                card.addEventListener('mouseenter', () => {
                    card.classList.add('card-hover');
                });
                card.addEventListener('mouseleave', () => {
                    card.classList.remove('card-hover');
                });
            }
        });
    }

    /**
     * Unlock a game card
     * @param {string} gameName - Name of the game to unlock
     */
    unlockGame(gameName) {
        const card = document.querySelector(`.game-card[data-game="${gameName}"]`);
        if (card) {
            card.classList.remove('game-card-locked');
            const button = card.querySelector('.play-button');
            if (button) {
                button.disabled = false;
                button.textContent = 'Play';
            }
            console.log(`✓ Game unlocked: ${gameName}`);
        }
    }

    /**
     * Lock a game card
     * @param {string} gameName - Name of the game to lock
     */
    lockGame(gameName) {
        const card = document.querySelector(`.game-card[data-game="${gameName}"]`);
        if (card) {
            card.classList.add('game-card-locked');
            const button = card.querySelector('.play-button');
            if (button) {
                button.disabled = true;
                button.textContent = 'Locked';
            }
            console.log(`✓ Game locked: ${gameName}`);
        }
    }
}

// Create global lobby instance
const lobby = new Lobby();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lobby.init();
});
