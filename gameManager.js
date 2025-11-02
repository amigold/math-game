// Game Manager - Central navigation and game registry system
// Manages transitions between lobby and different games

class GameManager {
    constructor() {
        // Registry of all available games
        this.games = new Map();

        // Currently active game instance
        this.currentGame = null;
        this.currentGameName = null;

        // View management
        this.lobbyView = null;
        this.currentGameView = null;
    }

    /**
     * Register a new game in the system
     * @param {string} name - Unique game identifier
     * @param {Object} config - Game configuration
     * @param {string} config.viewId - HTML element ID for this game's view
     * @param {Function} config.createInstance - Factory function that creates game instance
     * @param {string} config.title - Display title for the game
     */
    registerGame(name, config) {
        if (!config.viewId || !config.createInstance) {
            throw new Error(`Game ${name} must have viewId and createInstance`);
        }

        this.games.set(name, {
            name,
            viewId: config.viewId,
            createInstance: config.createInstance,
            title: config.title || name,
            instance: null
        });

        console.log(`✓ Game registered: ${name}`);
    }

    /**
     * Initialize the game manager
     */
    init() {
        this.lobbyView = document.getElementById('lobby-view');

        if (!this.lobbyView) {
            console.error('Lobby view not found! Make sure #lobby-view exists in HTML');
            return;
        }

        // Show lobby by default
        this.showLobby();
    }

    /**
     * Start a specific game
     * @param {string} gameName - Name of the game to start
     */
    startGame(gameName) {
        const gameConfig = this.games.get(gameName);

        if (!gameConfig) {
            console.error(`Game "${gameName}" not found in registry`);
            return;
        }

        // Pause current game if any
        if (this.currentGame) {
            this.pauseCurrentGame();
        }

        // Get game view
        const gameView = document.getElementById(gameConfig.viewId);
        if (!gameView) {
            console.error(`View #${gameConfig.viewId} not found for game ${gameName}`);
            return;
        }

        // Create game instance if not exists
        if (!gameConfig.instance) {
            console.log(`Creating new instance of ${gameName}...`);
            gameConfig.instance = gameConfig.createInstance();
        }

        // Update state
        this.currentGame = gameConfig.instance;
        this.currentGameName = gameName;
        this.currentGameView = gameView;

        // Hide lobby, show game
        this.hideAllViews();
        gameView.classList.remove('hidden');

        // Initialize/start the game
        if (this.currentGame.init && typeof this.currentGame.init === 'function') {
            this.currentGame.init();
        }
        if (this.currentGame.start && typeof this.currentGame.start === 'function') {
            this.currentGame.start();
        }

        console.log(`✓ Started game: ${gameName}`);
    }

    /**
     * Pause the current game without destroying it
     */
    pauseCurrentGame() {
        if (this.currentGame && this.currentGame.pause && typeof this.currentGame.pause === 'function') {
            this.currentGame.pause();
        }
    }

    /**
     * Exit current game and return to lobby
     */
    exitToLobby() {
        if (this.currentGame) {
            // Pause the game
            this.pauseCurrentGame();

            // Note: We don't destroy the game instance to preserve progress
            // The game will resume from where it left off when restarted
        }

        // Update state
        this.currentGame = null;
        this.currentGameName = null;
        this.currentGameView = null;

        // Show lobby
        this.showLobby();

        console.log('✓ Returned to lobby');
    }

    /**
     * Show the lobby view
     */
    showLobby() {
        this.hideAllViews();
        if (this.lobbyView) {
            this.lobbyView.classList.remove('hidden');
        }
    }

    /**
     * Hide all views (lobby and games)
     */
    hideAllViews() {
        // Hide lobby
        if (this.lobbyView) {
            this.lobbyView.classList.add('hidden');
        }

        // Hide all game views
        this.games.forEach(gameConfig => {
            const view = document.getElementById(gameConfig.viewId);
            if (view) {
                view.classList.add('hidden');
            }
        });
    }

    /**
     * Get current active game instance
     * @returns {Object|null} Current game instance or null
     */
    getCurrentGame() {
        return this.currentGame;
    }

    /**
     * Get current game name
     * @returns {string|null} Current game name or null
     */
    getCurrentGameName() {
        return this.currentGameName;
    }

    /**
     * Get list of all registered games
     * @returns {Array} Array of game configurations
     */
    getRegisteredGames() {
        return Array.from(this.games.values()).map(game => ({
            name: game.name,
            title: game.title,
            viewId: game.viewId
        }));
    }
}

// Create global instance
const gameManager = new GameManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    gameManager.init();
    console.log('✓ Game Manager initialized');
});
