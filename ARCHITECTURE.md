# Architecture Documentation

## Overview

The game has been refactored into a modular architecture that supports multiple games with a central lobby system. This design makes it easy to add new games without modifying existing code.

## Directory Structure

```
/
├── index.html              # Main HTML with lobby and game views
├── gameManager.js          # Central game registry and navigation
├── lobby.js                # Lobby logic and interactions
├── styles/
│   ├── common.css         # Shared styles (reset, body)
│   ├── lobby.css          # Lobby-specific styles
│   └── mathOrb.css        # Math Orb game-specific styles
└── games/
    └── mathOrb/
        ├── mathOrbGame.js  # Math Orb game logic
        ├── pictures.js     # Available pictures array
        └── pictures/       # Picture assets
```

## Core Components

### 1. GameManager (`gameManager.js`)

The central controller for all games. Handles:
- Game registration
- View switching (lobby ↔ games)
- Game lifecycle management (init, start, pause)
- Navigation state

**Key Methods:**
- `registerGame(name, config)` - Register a new game
- `startGame(name)` - Start a specific game
- `exitToLobby()` - Return to lobby
- `showLobby()` - Display lobby view
- `hideAllViews()` - Hide all views

### 2. Lobby (`lobby.js`)

Manages the lobby interface:
- Game card interactions
- Play button clicks
- Lock/unlock games
- Visual feedback

**Key Methods:**
- `init()` - Setup event listeners
- `handlePlayClick(card)` - Launch a game
- `unlockGame(name)` - Unlock a game card
- `lockGame(name)` - Lock a game card

### 3. Game Lifecycle

Each game must implement these methods:

```javascript
class MyGame {
    constructor() {
        // Initialize state
    }

    init() {
        // Setup DOM elements and event listeners
        // Called once when game is first loaded
    }

    start() {
        // Start/resume game
        // Called when game becomes active
    }

    pause() {
        // Pause game
        // Called when leaving to lobby
    }

    destroy() {
        // Cleanup (optional)
        // Remove event listeners, clear timers
    }
}
```

## Adding a New Game

### Step 1: Create Game Directory

```bash
mkdir -p games/myGame
```

### Step 2: Create Game Class

Create `games/myGame/myGame.js`:

```javascript
class MyGame {
    constructor() {
        this.isInitialized = false;
        this.isPaused = false;
        // Your game state here
    }

    init() {
        if (this.isInitialized) return;

        // Get DOM elements
        this.gameElement = document.getElementById('my-game-element');

        // Setup event listeners
        this.boundHandleClick = () => this.handleClick();
        this.gameElement.addEventListener('click', this.boundHandleClick);

        this.isInitialized = true;
        console.log('✓ My Game initialized');
    }

    start() {
        this.isPaused = false;
        // Start game logic
        console.log('✓ My Game started');
    }

    pause() {
        this.isPaused = true;
        // Pause game logic (stop timers, etc.)
        console.log('✓ My Game paused');
    }

    destroy() {
        // Cleanup
        if (this.gameElement && this.boundHandleClick) {
            this.gameElement.removeEventListener('click', this.boundHandleClick);
        }
        this.isInitialized = false;
    }

    handleClick() {
        if (this.isPaused) return;
        // Game logic here
    }
}
```

### Step 3: Add Game View to HTML

In `index.html`, add your game view:

```html
<!-- My Game View -->
<div id="my-game-view" class="hidden">
    <!-- Exit Button -->
    <button id="my-game-exit-button" class="exit-button" title="Exit to Lobby">
        <span class="exit-icon">←</span>
        <span class="exit-text">Exit</span>
    </button>

    <!-- Your game UI here -->
    <div class="game-container">
        <!-- ... -->
    </div>
</div>
```

### Step 4: Create Game Styles

Create `styles/myGame.css` with your game-specific styles.

### Step 5: Add Game Card to Lobby

In `index.html`, add a card in the lobby:

```html
<div class="game-card" data-game="myGame">
    <div class="game-card-icon">🎮</div>
    <h2>My Awesome Game</h2>
    <p>Game description here!</p>
    <button class="play-button">Play</button>
</div>
```

### Step 6: Register Game

In `index.html` script section:

```html
<script src="games/myGame/myGame.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        gameManager.registerGame('myGame', {
            viewId: 'my-game-view',
            title: 'My Awesome Game',
            createInstance: () => {
                const game = new MyGame();
                return game;
            }
        });

        console.log('✓ All games registered');
    });
</script>
```

### Step 7: Connect Exit Button

In your game's `init()` method:

```javascript
this.exitButton = document.getElementById('my-game-exit-button');
this.boundExitToLobby = () => {
    if (typeof gameManager !== 'undefined') {
        gameManager.exitToLobby();
    }
};
this.exitButton.addEventListener('click', this.boundExitToLobby);
```

## Game Isolation

Each game is completely isolated:
- **Separate localStorage keys**: Use unique prefixes (e.g., `myGame_progress`)
- **Independent state**: Each game maintains its own state
- **Separate assets**: Keep all assets in game folder
- **Scoped CSS**: Use game-specific CSS files

## Best Practices

1. **Always check `isPaused`** before processing game logic
2. **Clean up timers** in `pause()` method
3. **Use bound event handlers** for easy cleanup
4. **Keep DOM queries in init()** for performance
5. **Use localStorage** for persistent progress
6. **Test lifecycle**: lobby → game → lobby → game

## Testing Checklist

When adding a new game, verify:

- [ ] Lobby displays game card correctly
- [ ] Clicking Play launches game
- [ ] Game initializes without errors
- [ ] Game logic works as expected
- [ ] Exit button returns to lobby
- [ ] Progress is saved in localStorage
- [ ] Re-entering game restores progress
- [ ] No console errors

## File Naming Conventions

- Game class: `MyGame` (PascalCase)
- Game file: `myGame.js` (camelCase)
- Game folder: `myGame` (camelCase)
- View ID: `my-game-view` (kebab-case)
- CSS file: `myGame.css` (camelCase)

## Future Enhancements

Possible improvements to the architecture:

1. **Game configuration file**: JSON config for each game
2. **Progress indicators**: Show completion % on lobby cards
3. **Shared utilities**: Common functions (sounds, animations)
4. **Game difficulty selection**: Choose level before playing
5. **Achievements system**: Cross-game achievement tracking
6. **Analytics**: Track game usage and progress
