// Hebrew Matching Game - Match vehicles to their Hebrew names

class HebrewMatchGame {
    constructor() {
        // All available vehicles
        this.allVehicles = [
            { emoji: '🚗', name: 'מְכוֹנִית' },
            { emoji: '🚲', name: 'אוֹפַנַּיִם' },
            { emoji: '✈️', name: 'מָטוֹס' },
            { emoji: '🚂', name: 'רַכֶּבֶת' },
            { emoji: '🚌', name: 'אוֹטוֹבּוּס' },
            { emoji: '🚁', name: 'מָסוֹק' },
            { emoji: '🚢', name: 'אֳנִיָּה' },
            { emoji: '🚕', name: 'מוֹנִית' },
            { emoji: '🏍️', name: 'אוֹפַנּוֹעַ' },
            { emoji: '🚜', name: 'טְרַקְטוֹר' },
            { emoji: '🛴', name: 'קוֹרְקִינֶט' },
            { emoji: '🚠', name: 'רַכְבָּל' },
            { emoji: '🚙', name: 'רֶכֶב שֶׁטַח' },
            { emoji: '🚛', name: 'מַשָּׂאִית' },
            { emoji: '🚝', name: 'רַכֶּבֶת חַשְׁמַלִּית' },
            { emoji: '🚆', name: 'רַכֶּבֶת מְהִירָה' },
            { emoji: '🚘', name: 'מְכוֹנִית קְטַנָּה' },
            { emoji: '🚔', name: 'נַיֶּדֶת מִשְׁטָרָה' },
            { emoji: '🚍', name: 'אוֹטוֹבּוּס קוֹמוֹתַיִם' },
            { emoji: '🚎', name: 'טְרוֹלֵיבּוּס' }
        ];

        // All available prizes (images to collect)
        this.allPrizes = [
            { emoji: '🐮', name: 'פָּרָה', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { emoji: '🐱', name: 'חָתוּל', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { emoji: '🦋', name: 'פַּרְפַּר', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { emoji: '🐶', name: 'כֶּלֶב', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            { emoji: '🐘', name: 'פִּיל', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { emoji: '🦁', name: 'אַרְיֵה', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
            { emoji: '🐼', name: 'פַּנְדָּה', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
            { emoji: '🦊', name: 'שׁוּעָל', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
            { emoji: '🐯', name: 'נָמֵר', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
            { emoji: '🐨', name: 'קוֹאָלָה', color: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
            { emoji: '🐸', name: 'צְפַרְדֵּעַ', color: 'linear-gradient(135deg, #52c234 0%, #061700 100%)' },
            { emoji: '🐵', name: 'קוֹף', color: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)' }
        ];

        // Used vehicles and prizes pools
        this.usedVehicles = [];
        this.usedPrizes = [];

        // Game state
        this.currentLevelNumber = 0;
        this.currentLevel = null;
        this.collectedPrizes = [];
        this.currentMatches = [];
        this.selectedEmoji = null;
        this.selectedName = null;

        // Canvas for drawing lines
        this.canvas = null;
        this.ctx = null;
        this.lines = [];

        // Puzzle state
        this.currentPuzzle = null;
        this.puzzleSolved = false;

        // DOM elements (will be initialized in init())
        this.elements = {};
    }

    /**
     * Initialize the game
     */
    init() {
        console.log('🎮 Initializing Hebrew Match Game...');

        // Get all DOM elements
        this.elements = {
            // Screens
            levelSelection: document.getElementById('level-selection'),
            matchingGame: document.getElementById('matching-game'),
            puzzleGame: document.getElementById('puzzle-game'),
            collectionScreen: document.getElementById('collection-screen'),

            // Level selection
            levelCards: document.querySelectorAll('.level-card'),
            showCollectionBtn: document.getElementById('show-collection-btn'),

            // Matching game
            matchingTitle: document.getElementById('matching-title'),
            emojiColumn: document.querySelector('.emoji-column'),
            nameColumn: document.querySelector('.name-column'),
            lineCanvas: document.getElementById('line-canvas'),
            matchingFeedback: document.getElementById('matching-feedback'),

            // Puzzle game
            puzzleBoard: document.querySelector('.puzzle-board'),
            puzzlePieces: document.querySelector('.puzzle-pieces'),
            puzzleFeedback: document.getElementById('puzzle-feedback'),

            // Collection
            puzzleCollection: document.getElementById('puzzle-collection'),
            backToLevelsBtn: document.getElementById('back-to-levels-btn'),

            // Exit button
            exitButton: document.getElementById('hebrew-exit-button')
        };

        // Setup canvas
        this.canvas = this.elements.lineCanvas;
        this.ctx = this.canvas.getContext('2d');

        // Load saved progress
        this.loadProgress();

        // Setup event listeners
        this.setupEventListeners();

        console.log('✓ Hebrew Match Game initialized');
    }

    /**
     * Generate a new level with random vehicles and prize
     */
    generateLevel() {
        this.currentLevelNumber++;

        // Get 3 random unused vehicles
        let availableVehicles = this.allVehicles.filter(v => !this.usedVehicles.includes(v));

        // If we've used all vehicles, reset the pool
        if (availableVehicles.length < 3) {
            this.usedVehicles = [];
            availableVehicles = [...this.allVehicles];
        }

        // Shuffle and pick 3
        const shuffled = this.shuffleArray([...availableVehicles]);
        const selectedVehicles = shuffled.slice(0, 3);

        // Mark as used
        selectedVehicles.forEach(v => this.usedVehicles.push(v));

        // Get a random unused prize
        let availablePrizes = this.allPrizes.filter(p => !this.usedPrizes.includes(p));

        // If we've used all prizes, reset the pool
        if (availablePrizes.length === 0) {
            this.usedPrizes = [];
            availablePrizes = [...this.allPrizes];
        }

        const prize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        this.usedPrizes.push(prize);

        return {
            id: this.currentLevelNumber,
            vehicles: selectedVehicles,
            prize: prize
        };
    }

    /**
     * Start the game (called by GameManager)
     */
    start() {
        // Go directly to a new level instead of showing level selection
        this.startNewLevel();
    }

    /**
     * Pause the game (called by GameManager)
     */
    pause() {
        // Clear any temporary state
        this.selectedEmoji = null;
        this.selectedName = null;
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Level selection - clicking any level card starts a new level
        this.elements.levelCards.forEach(card => {
            card.addEventListener('click', () => {
                this.startNewLevel();
            });
        });

        // Collection buttons
        this.elements.showCollectionBtn.addEventListener('click', () => {
            this.showCollection();
        });

        const showCollectionFromGame = document.getElementById('show-collection-from-game');
        if (showCollectionFromGame) {
            showCollectionFromGame.addEventListener('click', () => {
                this.showCollection();
            });
        }

        // Back to levels button - now starts a new game
        this.elements.backToLevelsBtn.addEventListener('click', () => {
            this.startNewLevel();
        });

        // Exit button
        this.elements.exitButton.addEventListener('click', () => {
            if (typeof gameManager !== 'undefined') {
                gameManager.exitToLobby();
            }
        });
    }

    /**
     * Show a specific screen
     */
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('hebrew-screen')) {
                el.classList.add('hidden');
            }
        });

        // Show requested screen
        const screens = {
            levelSelection: this.elements.levelSelection,
            matchingGame: this.elements.matchingGame,
            puzzleGame: this.elements.puzzleGame,
            collectionScreen: this.elements.collectionScreen
        };

        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
        }
    }

    /**
     * Start a new level
     */
    startNewLevel() {
        // Generate a new level
        this.currentLevel = this.generateLevel();

        console.log('Starting level:', this.currentLevel.id);

        // Reset matching state
        this.currentMatches = [];
        this.selectedEmoji = null;
        this.selectedName = null;
        this.lines = [];

        // Setup matching game
        this.setupMatchingGame();

        // Show matching screen
        this.showScreen('matchingGame');
    }

    /**
     * Setup the matching game for current level
     */
    setupMatchingGame() {
        // Update title
        this.elements.matchingTitle.textContent = `שָׁלָב ${this.currentLevel.id}`;

        // Clear previous content
        this.elements.emojiColumn.innerHTML = '';
        this.elements.nameColumn.innerHTML = '';
        this.elements.matchingFeedback.textContent = '';

        // Resize canvas
        this.resizeCanvas();

        // Create shuffled arrays
        const emojis = [...this.currentLevel.vehicles];
        const names = this.shuffleArray([...this.currentLevel.vehicles]);

        // Create emoji elements
        emojis.forEach((vehicle, index) => {
            const emojiEl = document.createElement('div');
            emojiEl.className = 'emoji-item';
            emojiEl.textContent = vehicle.emoji;
            emojiEl.dataset.emoji = vehicle.emoji;
            emojiEl.dataset.name = vehicle.name;
            emojiEl.dataset.index = index;
            emojiEl.addEventListener('click', () => this.selectEmoji(emojiEl));
            this.elements.emojiColumn.appendChild(emojiEl);
        });

        // Create name elements
        names.forEach((vehicle, index) => {
            const nameEl = document.createElement('div');
            nameEl.className = 'name-item';
            nameEl.textContent = vehicle.name;
            nameEl.dataset.emoji = vehicle.emoji;
            nameEl.dataset.name = vehicle.name;
            nameEl.dataset.index = index;
            nameEl.addEventListener('click', () => this.selectName(nameEl));
            this.elements.nameColumn.appendChild(nameEl);
        });
    }

    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.redrawLines();
    }

    /**
     * Handle emoji selection
     */
    selectEmoji(emojiEl) {
        // Skip if already matched
        if (emojiEl.classList.contains('matched')) return;

        // Deselect previous emoji
        document.querySelectorAll('.emoji-item.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Select this emoji
        this.selectedEmoji = emojiEl;
        emojiEl.classList.add('selected');

        // Check if we can make a match
        if (this.selectedName) {
            this.checkMatch();
        }
    }

    /**
     * Handle name selection
     */
    selectName(nameEl) {
        // Skip if already matched
        if (nameEl.classList.contains('matched')) return;

        // Deselect previous name
        document.querySelectorAll('.name-item.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Select this name
        this.selectedName = nameEl;
        nameEl.classList.add('selected');

        // Check if we can make a match
        if (this.selectedEmoji) {
            this.checkMatch();
        }
    }

    /**
     * Check if selected emoji and name match
     */
    checkMatch() {
        const emojiName = this.selectedEmoji.dataset.name;
        const selectedNameText = this.selectedName.dataset.name;

        if (emojiName === selectedNameText) {
            // Correct match!
            this.handleCorrectMatch();
        } else {
            // Wrong match
            this.handleWrongMatch();
        }
    }

    /**
     * Handle correct match
     */
    handleCorrectMatch() {
        // Mark as matched
        this.selectedEmoji.classList.add('matched');
        this.selectedEmoji.classList.remove('selected');
        this.selectedName.classList.add('matched');
        this.selectedName.classList.remove('selected');

        // Draw line
        this.drawLine(this.selectedEmoji, this.selectedName, '#4CAF50');

        // Add to matches
        this.currentMatches.push({
            emoji: this.selectedEmoji.dataset.emoji,
            name: this.selectedName.dataset.name
        });

        // Show feedback
        this.showFeedback('נָכוֹן! 🎉', 'correct');

        // Check if all matched
        if (this.currentMatches.length === 3) {
            setTimeout(() => {
                this.completeMatching();
            }, 1000);
        }

        // Reset selection
        this.selectedEmoji = null;
        this.selectedName = null;
    }

    /**
     * Handle wrong match
     */
    handleWrongMatch() {
        // Show feedback
        this.showFeedback('נַסֶּה שׁוּב', 'incorrect');

        // Shake elements
        this.selectedEmoji.classList.add('shake');
        this.selectedName.classList.add('shake');
        setTimeout(() => {
            if (this.selectedEmoji) this.selectedEmoji.classList.remove('shake');
            if (this.selectedName) this.selectedName.classList.remove('shake');
        }, 500);

        // Deselect after a moment
        setTimeout(() => {
            if (this.selectedEmoji) this.selectedEmoji.classList.remove('selected');
            if (this.selectedName) this.selectedName.classList.remove('selected');
            this.selectedEmoji = null;
            this.selectedName = null;
            this.elements.matchingFeedback.textContent = '';
        }, 1000);
    }

    /**
     * Complete matching phase and move to puzzle
     */
    completeMatching() {
        this.showFeedback('כָּל הַכָּבוֹד! עַכְשָׁיו בּוֹא נְרַכֵּב פַּאזָל! 🎊', 'correct');

        setTimeout(() => {
            this.startPuzzle();
        }, 1500);
    }

    /**
     * Start puzzle assembly
     */
    startPuzzle() {
        this.currentPuzzle = this.currentLevel.puzzleImage;
        this.puzzleSolved = false;

        this.setupPuzzleGame();
        this.showScreen('puzzleGame');
    }

    /**
     * Setup puzzle game
     */
    setupPuzzleGame() {
        // Clear previous content
        this.elements.puzzleBoard.innerHTML = '';
        this.elements.puzzlePieces.innerHTML = '';
        this.elements.puzzleFeedback.textContent = '';

        // Create 4 slots
        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.position = i;

            // Add drop handlers
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e));

            this.elements.puzzleBoard.appendChild(slot);
        }

        // Create 4 shuffled pieces
        const positions = this.shuffleArray([0, 1, 2, 3]);
        positions.forEach(pos => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.position = pos;
            piece.draggable = true;

            // Set background gradient - all pieces get the gradient
            piece.style.background = this.currentLevel.prize.color;

            // Add emoji to all pieces with position absolute
            piece.style.position = 'relative';
            piece.style.overflow = 'hidden';
            piece.style.display = 'flex';
            piece.style.alignItems = 'center';
            piece.style.justifyContent = 'center';

            const emoji = document.createElement('div');
            emoji.textContent = this.currentLevel.prize.emoji;
            emoji.style.fontSize = '420px';
            emoji.style.position = 'absolute';
            emoji.style.userSelect = 'none';
            emoji.style.pointerEvents = 'none';
            emoji.style.lineHeight = '1';
            emoji.style.left = '0';
            emoji.style.top = '0';
            emoji.style.transformOrigin = 'top left';

            // Position emoji parts based on piece position
            // 0=top-right, 1=top-left, 2=bottom-right, 3=bottom-left
            // Each piece is 200x200, gap is 10px between them when assembled
            // Emoji size 420px divided by 2 = 210px per row/col (includes the gap)
            let transform = '';
            if (pos === 0) {
                // ימני עליון (top-right)
                transform = 'translate(-210px, 0px)';
            } else if (pos === 1) {
                // שמאלי עליון (top-left)
                transform = 'translate(0px, 0px)';
            } else if (pos === 2) {
                // ימני תחתון (bottom-right)
                transform = 'translate(-210px, -210px)';
            } else if (pos === 3) {
                // שמאלי תחתון (bottom-left)
                transform = 'translate(0px, -210px)';
            }
            emoji.style.transform = transform;

            piece.appendChild(emoji);

            // Add drag handlers
            piece.addEventListener('dragstart', (e) => this.handleDragStart(e));
            piece.addEventListener('dragend', (e) => this.handleDragEnd(e));

            this.elements.puzzlePieces.appendChild(piece);
        });
    }

    /**
     * Handle drag start
     */
    handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.position);
        e.target.style.opacity = '0.5';
    }

    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        e.target.style.opacity = '1';
    }

    /**
     * Handle drag over
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    /**
     * Handle drop
     */
    handleDrop(e) {
        e.preventDefault();

        const piecePosition = e.dataTransfer.getData('text/plain');
        const slotPosition = e.currentTarget.dataset.position;

        // Check if correct position
        if (piecePosition === slotPosition) {
            // Correct placement
            const piece = document.querySelector(`.puzzle-piece[data-position="${piecePosition}"]`);
            if (piece) {
                // Move piece to slot
                e.currentTarget.appendChild(piece);
                e.currentTarget.classList.add('filled');
                piece.draggable = false;
                piece.style.margin = '0';

                // Check if puzzle complete
                this.checkPuzzleComplete();
            }
        } else {
            // Wrong placement
            this.showFeedback('נַסֶּה מָקוֹם אַחֵר', 'incorrect');
            setTimeout(() => {
                this.elements.puzzleFeedback.textContent = '';
            }, 1000);
        }
    }

    /**
     * Check if puzzle is complete
     */
    checkPuzzleComplete() {
        const filledSlots = document.querySelectorAll('.puzzle-slot.filled').length;

        if (filledSlots === 4) {
            this.puzzleSolved = true;
            this.completePuzzle();
        }
    }

    /**
     * Complete puzzle and save to collection
     */
    completePuzzle() {
        this.showFeedback('מַדְהִים! זָכִיתָ בְּ' + this.currentLevel.prize.name + '! 🎉🎊', 'correct');

        // Add prize to collection
        this.collectedPrizes.push(this.currentLevel.prize);
        this.saveProgress();

        // Add celebration animation
        this.elements.puzzleBoard.classList.add('celebrating');

        setTimeout(() => {
            this.elements.puzzleBoard.classList.remove('celebrating');
            // Start a new level immediately instead of going back to level selection
            this.startNewLevel();
        }, 3000);
    }

    /**
     * Show collection
     */
    showCollection() {
        this.elements.puzzleCollection.innerHTML = '';

        if (this.collectedPrizes.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'collection-empty';
            empty.textContent = 'עֲדַיִן לֹא אָסַפְתָּ תְּמוּנוֹת.\nשַׂחֵק כְּדֵי לֶאֱסוֹף!';
            this.elements.puzzleCollection.appendChild(empty);
        } else {
            this.collectedPrizes.forEach(prize => {
                const item = document.createElement('div');
                item.className = 'collection-item';

                // Create full image display with gradient and emoji
                const imageDisplay = document.createElement('div');
                imageDisplay.style.width = '100%';
                imageDisplay.style.height = '280px';
                imageDisplay.style.background = prize.color;
                imageDisplay.style.borderRadius = '15px';
                imageDisplay.style.display = 'flex';
                imageDisplay.style.alignItems = 'center';
                imageDisplay.style.justifyContent = 'center';
                imageDisplay.style.fontSize = '150px';
                imageDisplay.textContent = prize.emoji;

                // Add prize name
                const nameLabel = document.createElement('div');
                nameLabel.style.textAlign = 'center';
                nameLabel.style.marginTop = '10px';
                nameLabel.style.fontSize = '18px';
                nameLabel.style.fontWeight = 'bold';
                nameLabel.textContent = prize.name;

                item.appendChild(imageDisplay);
                item.appendChild(nameLabel);
                this.elements.puzzleCollection.appendChild(item);
            });
        }

        this.showScreen('collectionScreen');
    }

    /**
     * Draw line between two elements
     */
    drawLine(el1, el2, color) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();

        const x1 = rect1.right - canvasRect.left;
        const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
        const x2 = rect2.left - canvasRect.left;
        const y2 = rect2.top + rect2.height / 2 - canvasRect.top;

        this.lines.push({ x1, y1, x2, y2, color });
        this.redrawLines();
    }

    /**
     * Redraw all lines
     */
    redrawLines() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.lines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
            this.ctx.strokeStyle = line.color;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        });
    }

    /**
     * Show feedback message
     */
    showFeedback(message, type) {
        this.elements.matchingFeedback.textContent = message;
        this.elements.matchingFeedback.className = `feedback-message ${type}`;

        if (this.elements.puzzleFeedback) {
            this.elements.puzzleFeedback.textContent = message;
            this.elements.puzzleFeedback.className = `feedback-message ${type}`;
        }
    }

    /**
     * Play sound effect
     */
    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'correct') {
                oscillator.frequency.value = 523.25; // C5
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            } else {
                oscillator.frequency.value = 329.63; // E4
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            }
        } catch (e) {
            console.warn('Could not play sound:', e);
        }
    }

    /**
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('hebrewMatchProgress');
            if (saved) {
                const data = JSON.parse(saved);
                this.collectedPrizes = data.collectedPrizes || [];
                this.currentLevelNumber = data.currentLevelNumber || 0;
                this.usedVehicles = data.usedVehicles || [];
                this.usedPrizes = data.usedPrizes || [];
                console.log('✓ Progress loaded:', this.collectedPrizes.length, 'prizes collected');
            }
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const data = {
                collectedPrizes: this.collectedPrizes,
                currentLevelNumber: this.currentLevelNumber,
                usedVehicles: this.usedVehicles,
                usedPrizes: this.usedPrizes
            };
            localStorage.setItem('hebrewMatchProgress', JSON.stringify(data));
            console.log('✓ Progress saved');
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    }
}
