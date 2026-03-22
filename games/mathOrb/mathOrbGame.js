// Math Orb Collector - Refactored Game Logic with Lifecycle Methods

// Number of consecutive correct answers required to auto-advance one level
const LEVEL_UP_THRESHOLD = 5;

// Explicit map from each level to the next
const NEXT_LEVEL = { '1': '2', '2': '3' };

// Maximum total beads to show in the supply tray
const MAX_SUPPLY_BEADS = 20;

// Colors for bead blocks
const BEAD_COLORS = ['bead-red', 'bead-blue', 'bead-green', 'bead-yellow', 'bead-purple'];

class MathOrbGame {
    constructor() {
        // Game state
        this.currentProblem = null;
        this.emojiCollection = [];
        this.magicFaceCollection = [];
        this.pictureCollection = [];
        this.selectedDifficulty = '1';
        this.selectedMode = 'addition';
        this.problemsSolved = 0;
        this.consecutiveCorrect = 0;
        this.isMagicBall = false;
        this.isRainbowBall = false;

        // Challenge mode state
        this.inChallengeMode = false;
        this.challengeTimeLeft = 120;
        this.challengeProblemsCompleted = 0;
        this.challengeTimer = null;

        // Lifecycle state
        this.isInitialized = false;
        this.isPaused = false;

        // Available emojis to collect
        this.availableEmojis = [
            '🐸', '🦄', '🦖', '🧸', '🌈', '👑', '🚀', '🎨', '🎭', '🎪',
            '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
            '🦋', '🐝', '🐞', '🦗', '🐠', '🐡', '🐙', '🦀', '🐳', '🦈',
            '🍎', '🍌', '🍓', '🍇', '🍉', '🍕', '🍔', '🍰', '🍪', '🍩',
            '⚽', '🏀', '🎾', '🏈', '🎯', '🎲', '🎮', '🎸', '🎺', '🎻'
        ];

        // Face emojis for magic ball collection
        this.faceEmojis = [
            '😀', '😃', '😄', '😁', '😆', '😊', '😍', '🤩', '😎', '🤗',
            '🥳', '🤠', '😇', '🥰', '😋', '😜', '🤪', '😏', '🤓', '🧐',
            '🤡', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '🙀'
        ];

        // Orb colors
        this.orbColors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        ];

        // DOM elements (will be initialized in init())
        this.orbContainer = null;
        this.answerInput = null;
        this.checkButton = null;
        this.feedbackMessage = null;
        this.emojiCollectionDiv = null;
        this.collectionCountSpan = null;
        this.magicFaceCollectionDiv = null;
        this.magicCountSpan = null;
        this.pictureCollectionDiv = null;
        this.pictureCountSpan = null;
        this.resetButton = null;
        this.countdownOverlay = null;
        this.countdownText = null;
        this.challengeTimerDiv = null;
        this.timerDisplay = null;
        this.problemsCounterSpan = null;
        this.exitButton = null;
        this.difficultyButtons = null;
        this.modeButtons = null;
        this.beadWorkspace = null;
        this.beadSupply = null;
        this.beadDropzone = null;
        this.dropzoneCount = null;

        // Drag state
        this.draggedBead = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Event handlers (stored for cleanup)
        this.boundCheckAnswer = null;
        this.boundKeyPress = null;
        this.boundResetCollection = null;
        this.boundExitToLobby = null;
    }

    /**
     * Initialize the game - sets up DOM references and event listeners
     */
    init() {
        if (this.isInitialized) {
            console.log('Game already initialized');
            return;
        }

        // Get DOM elements
        this.orbContainer = document.getElementById('orb-container');
        this.answerInput = document.getElementById('answer-input');
        this.checkButton = document.getElementById('check-button');
        this.feedbackMessage = document.getElementById('feedback-message');
        this.emojiCollectionDiv = document.getElementById('emoji-collection');
        this.collectionCountSpan = document.getElementById('collection-count');
        this.magicFaceCollectionDiv = document.getElementById('magic-face-collection');
        this.magicCountSpan = document.getElementById('magic-count');
        this.pictureCollectionDiv = document.getElementById('picture-collection');
        this.pictureCountSpan = document.getElementById('picture-count');
        this.resetButton = document.getElementById('reset-button');
        this.countdownOverlay = document.getElementById('countdown-overlay');
        this.countdownText = document.getElementById('countdown-text');
        this.challengeTimerDiv = document.getElementById('challenge-timer');
        this.timerDisplay = document.getElementById('timer-display');
        this.problemsCounterSpan = document.getElementById('problems-counter');
        this.exitButton = document.getElementById('exit-button');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.beadWorkspace = document.getElementById('bead-workspace');
        this.beadSupply = document.getElementById('bead-supply');
        this.beadDropzone = document.getElementById('bead-dropzone');
        this.dropzoneCount = document.getElementById('dropzone-count');

        // Load saved collections
        this.emojiCollection = this.loadCollection();
        this.magicFaceCollection = this.loadMagicCollection();
        this.pictureCollection = this.loadPictureCollection();
        this.selectedDifficulty = this.loadSelectedDifficulty() || '1';
        this.selectedMode = this.loadSelectedMode() || 'addition';

        // Create bound event handlers
        this.boundCheckAnswer = () => this.checkAnswer();
        this.boundKeyPress = (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        };
        this.boundResetCollection = () => this.resetCollection();
        this.boundExitToLobby = () => {
            if (typeof gameManager !== 'undefined') {
                gameManager.exitToLobby();
            }
        };

        // Attach event listeners
        this.checkButton.addEventListener('click', this.boundCheckAnswer);
        this.answerInput.addEventListener('keypress', this.boundKeyPress);
        this.resetButton.addEventListener('click', this.boundResetCollection);
        this.exitButton.addEventListener('click', this.boundExitToLobby);
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setDifficulty(btn.dataset.level));
        });
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
        });

        // Set up drag-and-drop for bead workspace (mouse + touch)
        this.setupBeadDragHandlers();

        // Update displays
        this.updateCollectionDisplay();
        this.updateMagicCollectionDisplay();
        this.updatePictureCollectionDisplay();
        this.updateDifficultyDisplay();
        this.updateModeDisplay();

        this.isInitialized = true;
        console.log('✓ Math Orb Game initialized');
    }

    /**
     * Start/resume the game
     */
    start() {
        if (!this.isInitialized) {
            console.error('Game must be initialized before starting');
            return;
        }

        this.isPaused = false;

        // Generate first problem if needed
        if (!this.currentProblem && !this.inChallengeMode) {
            this.generateNewProblem();
        }

        // Focus on input
        if (this.answerInput && !this.isRainbowBall) {
            this.answerInput.focus();
        }

        console.log('✓ Math Orb Game started');
    }

    /**
     * Pause the game
     */
    pause() {
        this.isPaused = true;

        // Stop challenge timer if running
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
            this.challengeTimer = null;
        }

        console.log('✓ Math Orb Game paused');
    }

    /**
     * Cleanup and destroy the game instance
     */
    destroy() {
        // Remove event listeners
        if (this.checkButton && this.boundCheckAnswer) {
            this.checkButton.removeEventListener('click', this.boundCheckAnswer);
        }
        if (this.answerInput && this.boundKeyPress) {
            this.answerInput.removeEventListener('keypress', this.boundKeyPress);
        }
        if (this.resetButton && this.boundResetCollection) {
            this.resetButton.removeEventListener('click', this.boundResetCollection);
        }
        if (this.exitButton && this.boundExitToLobby) {
            this.exitButton.removeEventListener('click', this.boundExitToLobby);
        }

        // Stop timers
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
            this.challengeTimer = null;
        }

        // Reset state
        this.isInitialized = false;
        this.isPaused = false;

        console.log('✓ Math Orb Game destroyed');
    }

    // Generate a random math problem based on selected difficulty
    generateMathProblem(isMagic = false) {
        let num1, num2;
        const level = this.selectedDifficulty;

        // Determine operator based on selected mode
        let operator;
        if (this.selectedMode === 'subtraction') {
            operator = '-';
        } else if (this.selectedMode === 'both') {
            operator = Math.random() < 0.5 ? '+' : '-';
        } else {
            operator = '+';
        }

        if (isMagic) {
            if (level === '1') {
                num1 = Math.floor(Math.random() * 5) + 5; // 5-9
                num2 = Math.floor(Math.random() * 5) + 1; // 1-5
            } else if (level === '3') {
                num1 = Math.floor(Math.random() * 11) + 15; // 15-25
                num2 = Math.floor(Math.random() * 11) + 5;  // 5-15
            } else {
                // Level 2 magic
                num1 = Math.floor(Math.random() * 10) + 10; // 10-19
                num2 = Math.floor(Math.random() * 10);       // 0-9
            }
        } else {
            if (level === '1') {
                num1 = Math.floor(Math.random() * 5) + 1; // 1-5
                num2 = Math.floor(Math.random() * 5) + 1; // 1-5
            } else if (level === '3') {
                num1 = Math.floor(Math.random() * 11) + 5; // 5-15
                num2 = Math.floor(Math.random() * 11) + 5; // 5-15
            } else {
                // Level 2: full single-digit range
                num1 = Math.floor(Math.random() * 10); // 0-9
                num2 = Math.floor(Math.random() * 10); // 0-9
            }
        }

        // For subtraction ensure no negative result (swap if needed)
        if (operator === '-' && num2 > num1) {
            [num1, num2] = [num2, num1];
        }

        return {
            num1: num1,
            num2: num2,
            operator: operator,
            answer: operator === '-' ? num1 - num2 : num1 + num2
        };
    }

    // Create and display a new orb with a math problem
    generateNewProblem() {
        // Don't generate if in challenge mode or paused
        if (this.inChallengeMode || this.isPaused) {
            return;
        }

        // Check if this should be a rainbow ball (every 10 problems)
        this.isRainbowBall = (this.problemsSolved > 0 && this.problemsSolved % 10 === 0);

        // Check if this should be a magic ball (every 5 problems, but not on 10)
        this.isMagicBall = (this.problemsSolved > 0 && this.problemsSolved % 5 === 0 && !this.isRainbowBall);

        // Clear previous orb
        this.orbContainer.innerHTML = '';

        // Create new orb
        const orb = document.createElement('div');

        if (this.isRainbowBall) {
            // Rainbow ball - clickable to start challenge
            orb.className = 'orb rainbow-orb';
            orb.style.background = 'linear-gradient(135deg, #ff0000 0%, #ff7f00 14%, #ffff00 28%, #00ff00 42%, #0000ff 57%, #4b0082 71%, #9400d3 85%, #ff0000 100%)';
            orb.style.cursor = 'pointer';

            const challengeText = document.createElement('div');
            challengeText.className = 'problem-text challenge-text';
            challengeText.textContent = 'CHALLENGE!';
            orb.appendChild(challengeText);

            // Add click event to start challenge
            orb.addEventListener('click', () => this.startChallenge());

            // Hide input/check button and beads for rainbow ball
            this.answerInput.style.display = 'none';
            this.checkButton.style.display = 'none';
            this.updateBeadWorkspace(null);
        } else {
            // Regular or magic ball
            this.currentProblem = this.generateMathProblem(this.isMagicBall);
            this.updateBeadWorkspace(this.currentProblem);

            orb.className = this.isMagicBall ? 'orb magic-orb' : 'orb';

            if (this.isMagicBall) {
                orb.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF69B4 100%)';

                // Add sparkles to magic orb
                for (let i = 0; i < 12; i++) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    orb.appendChild(sparkle);
                }
            } else {
                orb.style.background = this.getRandomOrbColor();
            }

            const problemText = document.createElement('div');
            problemText.className = 'problem-text';
            problemText.textContent = `${this.currentProblem.num1} ${this.currentProblem.operator} ${this.currentProblem.num2}`;
            orb.appendChild(problemText);

            // Show input/check button
            this.answerInput.style.display = '';
            this.checkButton.style.display = '';
        }

        this.orbContainer.appendChild(orb);

        // Clear input and focus
        this.answerInput.value = '';
        if (!this.isRainbowBall) {
            this.answerInput.focus();
        }

        // Hide feedback
        this.feedbackMessage.className = 'feedback-message';
    }

    // Get a random orb color
    getRandomOrbColor() {
        return this.orbColors[Math.floor(Math.random() * this.orbColors.length)];
    }

    // Get a random emoji that hasn't been collected yet
    getRandomEmoji() {
        // If all emojis are collected, allow repeats
        if (this.emojiCollection.length >= this.availableEmojis.length) {
            return this.availableEmojis[Math.floor(Math.random() * this.availableEmojis.length)];
        }

        // Get an emoji that hasn't been collected
        let emoji;
        do {
            emoji = this.availableEmojis[Math.floor(Math.random() * this.availableEmojis.length)];
        } while (this.emojiCollection.includes(emoji));

        return emoji;
    }

    // Get a random face emoji for magic balls
    getRandomFaceEmoji() {
        // If all face emojis are collected, allow repeats
        if (this.magicFaceCollection.length >= this.faceEmojis.length) {
            return this.faceEmojis[Math.floor(Math.random() * this.faceEmojis.length)];
        }

        // Get a face emoji that hasn't been collected
        let emoji;
        do {
            emoji = this.faceEmojis[Math.floor(Math.random() * this.faceEmojis.length)];
        } while (this.magicFaceCollection.includes(emoji));

        return emoji;
    }

    // Check the user's answer
    checkAnswer() {
        if (this.isPaused) {
            return;
        }

        const userAnswer = parseInt(this.answerInput.value);

        if (isNaN(userAnswer)) {
            return; // Ignore empty or invalid input
        }

        const orb = this.orbContainer.querySelector('.orb');

        if (userAnswer === this.currentProblem.answer) {
            // Correct answer!
            if (this.inChallengeMode) {
                this.handleChallengeCorrect(orb);
            } else {
                this.handleCorrectAnswer(orb);
            }
        } else {
            // Wrong answer
            if (this.inChallengeMode) {
                this.handleChallengeWrong(orb);
            } else {
                this.handleWrongAnswer(orb);
            }
        }
    }

    // Handle correct answer in challenge mode
    handleChallengeCorrect(orb) {
        this.challengeProblemsCompleted++;
        this.updateTimerDisplay();

        // Show brief feedback
        this.feedbackMessage.textContent = `Correct! ${this.challengeProblemsCompleted}/3`;
        this.feedbackMessage.className = 'feedback-message correct show';

        this.playSound('correct');

        if (this.challengeProblemsCompleted >= 3) {
            // Challenge complete!
            this.endChallenge(true);
        } else {
            // Next problem
            setTimeout(() => {
                this.generateChallengeProb();
            }, 500);
        }
    }

    // Handle wrong answer in challenge mode
    handleChallengeWrong(orb) {
        this.feedbackMessage.textContent = 'Try again!';
        this.feedbackMessage.className = 'feedback-message incorrect show';

        this.playSound('incorrect');

        orb.classList.add('shake');

        setTimeout(() => {
            this.generateChallengeProb();
        }, 600);
    }

    // Handle correct answer
    handleCorrectAnswer(orb) {
        // Increment consecutive correct counter and check for auto-level-up
        this.consecutiveCorrect++;
        const leveledUp = this.maybeAutoAdvanceLevel();

        // Show feedback
        let feedbackText = this.isMagicBall ? 'Amazing! Magic Face!' : 'Great job!';
        if (leveledUp) {
            feedbackText += ' ⬆️ Level Up!';
        }
        this.feedbackMessage.textContent = feedbackText;
        this.feedbackMessage.className = 'feedback-message correct show';

        // Play success sound
        this.playSound('correct');

        // Animate orb opening
        orb.classList.add('opening');

        // Increment problems solved counter
        this.problemsSolved++;

        // Reveal emoji after animation starts
        setTimeout(() => {
            let emoji;
            if (this.isMagicBall) {
                // Magic ball gives face emoji
                emoji = this.getRandomFaceEmoji();
                this.revealEmoji(emoji);
                this.addToMagicCollection(emoji);
            } else {
                // Regular ball gives regular emoji
                emoji = this.getRandomEmoji();
                this.revealEmoji(emoji);
                this.addToCollection(emoji);
            }

            // Generate next problem after delay
            setTimeout(() => {
                this.generateNewProblem();
            }, 2000);
        }, 300);
    }

    // Handle wrong answer
    handleWrongAnswer(orb) {
        // Reset consecutive correct streak
        this.consecutiveCorrect = 0;

        // Show feedback
        this.feedbackMessage.textContent = 'Try again!';
        this.feedbackMessage.className = 'feedback-message incorrect show';

        // Play error sound
        this.playSound('incorrect');

        // Shake and fade orb
        orb.classList.add('shake');

        // Generate new problem after animation
        setTimeout(() => {
            this.generateNewProblem();
        }, 600);
    }

    // Reveal emoji animation
    revealEmoji(emoji) {
        const emojiReveal = document.createElement('div');
        emojiReveal.className = 'emoji-reveal';
        emojiReveal.textContent = emoji;

        this.orbContainer.appendChild(emojiReveal);

        // Remove after animation
        setTimeout(() => {
            emojiReveal.remove();
        }, 2000);
    }

    // Add emoji to collection
    addToCollection(emoji) {
        // Avoid duplicates (unless all collected)
        if (!this.emojiCollection.includes(emoji)) {
            this.emojiCollection.push(emoji);
            this.saveCollection();
            this.updateCollectionDisplay();
        }
    }

    // Add face emoji to magic collection
    addToMagicCollection(emoji) {
        // Avoid duplicates (unless all collected)
        if (!this.magicFaceCollection.includes(emoji)) {
            this.magicFaceCollection.push(emoji);
            this.saveMagicCollection();
            this.updateMagicCollectionDisplay();
        }
    }

    // Update the collection display
    updateCollectionDisplay() {
        this.emojiCollectionDiv.innerHTML = '';

        this.emojiCollection.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.textContent = emoji;
            this.emojiCollectionDiv.appendChild(emojiItem);
        });

        this.collectionCountSpan.textContent = this.emojiCollection.length;
    }

    // Update the magic face collection display
    updateMagicCollectionDisplay() {
        this.magicFaceCollectionDiv.innerHTML = '';

        this.magicFaceCollection.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item magic-emoji-item';
            emojiItem.textContent = emoji;
            this.magicFaceCollectionDiv.appendChild(emojiItem);
        });

        this.magicCountSpan.textContent = this.magicFaceCollection.length;
    }

    // Save collection to localStorage
    saveCollection() {
        localStorage.setItem('mathOrbCollection', JSON.stringify(this.emojiCollection));
    }

    // Load collection from localStorage
    loadCollection() {
        const saved = localStorage.getItem('mathOrbCollection');
        return saved ? JSON.parse(saved) : [];
    }

    // Save magic collection to localStorage
    saveMagicCollection() {
        localStorage.setItem('mathOrbMagicCollection', JSON.stringify(this.magicFaceCollection));
    }

    // Load magic collection from localStorage
    loadMagicCollection() {
        const saved = localStorage.getItem('mathOrbMagicCollection');
        return saved ? JSON.parse(saved) : [];
    }

    // Reset collection
    resetCollection() {
        if (confirm('Are you sure you want to reset your collection? This cannot be undone!')) {
            this.emojiCollection = [];
            this.magicFaceCollection = [];
            this.pictureCollection = [];
            this.problemsSolved = 0;
            localStorage.removeItem('mathOrbCollection');
            localStorage.removeItem('mathOrbMagicCollection');
            localStorage.removeItem('mathOrbPictureCollection');
            this.updateCollectionDisplay();
            this.updateMagicCollectionDisplay();
            this.updatePictureCollectionDisplay();
        }
    }

    // Play sound using Web Audio API
    playSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'correct') {
            // Happy ascending notes
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } else if (type === 'incorrect') {
            // Gentle descending tone
            oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
            oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.1); // E4
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }

    // Start challenge mode
    startChallenge() {
        this.runCountdown();
    }

    // Run countdown (3-2-1-START!)
    runCountdown() {
        let count = 3;
        this.countdownOverlay.classList.remove('hidden');
        this.countdownText.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                this.countdownText.textContent = count;
            } else if (count === 0) {
                this.countdownText.textContent = 'START!';
            } else {
                clearInterval(countdownInterval);
                this.countdownOverlay.classList.add('hidden');
                this.beginChallenge();
            }
        }, 1000);
    }

    // Begin challenge mode
    beginChallenge() {
        this.inChallengeMode = true;
        this.challengeTimeLeft = 120;
        this.challengeProblemsCompleted = 0;

        // Show timer
        this.challengeTimerDiv.classList.remove('hidden');
        this.updateTimerDisplay();

        // Show input/check button
        this.answerInput.style.display = '';
        this.checkButton.style.display = '';

        // Start timer
        this.challengeTimer = setInterval(() => {
            this.challengeTimeLeft--;
            this.updateTimerDisplay();

            if (this.challengeTimeLeft <= 0) {
                this.endChallenge(false);
            }
        }, 1000);

        // Generate first problem
        this.generateChallengeProb();
    }

    // Generate a problem during challenge mode
    generateChallengeProb() {
        this.currentProblem = this.generateMathProblem(false);
        this.updateBeadWorkspace(this.currentProblem);

        // Clear previous orb
        this.orbContainer.innerHTML = '';

        // Create new orb
        const orb = document.createElement('div');
        orb.className = 'orb';
        orb.style.background = this.getRandomOrbColor();

        const problemText = document.createElement('div');
        problemText.className = 'problem-text';
        problemText.textContent = `${this.currentProblem.num1} ${this.currentProblem.operator} ${this.currentProblem.num2}`;
        orb.appendChild(problemText);

        this.orbContainer.appendChild(orb);

        // Clear input and focus
        this.answerInput.value = '';
        this.answerInput.focus();

        // Hide feedback
        this.feedbackMessage.className = 'feedback-message';
    }

    // Update timer display
    updateTimerDisplay() {
        const minutes = Math.floor(this.challengeTimeLeft / 60);
        const seconds = this.challengeTimeLeft % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.problemsCounterSpan.textContent = this.challengeProblemsCompleted;
    }

    // End challenge mode
    endChallenge(success) {
        clearInterval(this.challengeTimer);
        this.inChallengeMode = false;
        this.isRainbowBall = false;
        this.challengeTimerDiv.classList.add('hidden');

        if (success) {
            // Count the rainbow ball challenge as 1 problem solved
            this.problemsSolved++;

            // Award a random picture
            this.awardPicture();
        } else {
            // Failed challenge - don't count as solved
            this.feedbackMessage.textContent = 'Time\'s up! Try again!';
            this.feedbackMessage.className = 'feedback-message incorrect show';

            setTimeout(() => {
                // Return to normal gameplay
                this.answerInput.style.display = '';
                this.checkButton.style.display = '';
                this.generateNewProblem();
            }, 2000);
        }
    }

    // Award a picture
    awardPicture() {
        if (typeof AVAILABLE_PICTURES === 'undefined' || AVAILABLE_PICTURES.length === 0) {
            this.feedbackMessage.textContent = 'Challenge Complete! (No pictures configured)';
            this.feedbackMessage.className = 'feedback-message correct show';

            setTimeout(() => {
                // Return to normal gameplay
                this.answerInput.style.display = '';
                this.checkButton.style.display = '';
                this.generateNewProblem();
            }, 2000);
            return;
        }

        // Get random picture
        const randomPicture = AVAILABLE_PICTURES[Math.floor(Math.random() * AVAILABLE_PICTURES.length)];

        // Add to collection
        this.pictureCollection.push(randomPicture);
        this.savePictureCollection();
        this.updatePictureCollectionDisplay();

        // Check if got 4 of the same picture
        const pictureCount = this.pictureCollection.filter(p => p === randomPicture).length;
        if (pictureCount === 4) {
            // Award bonus magic face
            const bonusFace = this.getRandomFaceEmoji();
            this.addToMagicCollection(bonusFace);
            this.feedbackMessage.textContent = 'Challenge Complete! Bonus Magic Face!';
        } else {
            this.feedbackMessage.textContent = 'Challenge Complete! Picture Unlocked!';
        }

        this.feedbackMessage.className = 'feedback-message correct show';

        // Show picture reveal
        this.revealPicture(randomPicture);

        setTimeout(() => {
            // Return to normal gameplay
            this.answerInput.style.display = '';
            this.checkButton.style.display = '';
            this.generateNewProblem();
        }, 3000);
    }

    // Reveal picture animation
    revealPicture(picturePath) {
        const pictureReveal = document.createElement('div');
        pictureReveal.className = 'picture-reveal';

        const img = document.createElement('img');
        img.src = `games/mathOrb/pictures/${picturePath}`;
        img.alt = 'Unlocked Picture';
        pictureReveal.appendChild(img);

        this.orbContainer.appendChild(pictureReveal);

        // Remove after animation
        setTimeout(() => {
            pictureReveal.remove();
        }, 3000);
    }

    // Picture collection management
    updatePictureCollectionDisplay() {
        this.pictureCollectionDiv.innerHTML = '';

        // Group pictures by filename and count
        const pictureCounts = {};
        this.pictureCollection.forEach(pic => {
            pictureCounts[pic] = (pictureCounts[pic] || 0) + 1;
        });

        // Display each unique picture with count badge
        Object.entries(pictureCounts).forEach(([picturePath, count]) => {
            const pictureItem = document.createElement('div');
            pictureItem.className = 'picture-item';

            const img = document.createElement('img');
            img.src = `games/mathOrb/pictures/${picturePath}`;
            img.alt = 'Collected Picture';
            pictureItem.appendChild(img);

            if (count > 1) {
                const countBadge = document.createElement('div');
                countBadge.className = 'count-badge';
                countBadge.textContent = `x${count}`;
                pictureItem.appendChild(countBadge);
            }

            this.pictureCollectionDiv.appendChild(pictureItem);
        });

        this.pictureCountSpan.textContent = this.pictureCollection.length;
    }

    savePictureCollection() {
        localStorage.setItem('mathOrbPictureCollection', JSON.stringify(this.pictureCollection));
    }

    loadPictureCollection() {
        const saved = localStorage.getItem('mathOrbPictureCollection');
        return saved ? JSON.parse(saved) : [];
    }

    // Show or hide the bead workspace and populate supply tray
    updateBeadWorkspace(problem) {
        if (!this.beadWorkspace) return;

        if (!problem || problem.answer > MAX_SUPPLY_BEADS) {
            this.beadWorkspace.classList.add('hidden');
            return;
        }

        // Reset dropzone
        this.beadDropzone.querySelectorAll('.bead-block').forEach(b => b.remove());
        this.beadDropzone.classList.remove('has-beads');
        this.dropzoneCount.textContent = '0';

        // Populate supply tray with enough beads to solve the problem
        // Give a generous supply: max of the two operands + answer (capped)
        const supplyCount = Math.min(problem.num1 + problem.num2, MAX_SUPPLY_BEADS);
        const supplyContainer = this.beadSupply;
        // Keep the label, remove old beads
        supplyContainer.querySelectorAll('.bead-block').forEach(b => b.remove());

        for (let i = 0; i < supplyCount; i++) {
            const block = document.createElement('div');
            block.className = `bead-block ${BEAD_COLORS[i % BEAD_COLORS.length]}`;
            block.setAttribute('draggable', 'false'); // we handle drag manually
            supplyContainer.appendChild(block);
        }

        this.beadWorkspace.classList.remove('hidden');
    }

    // Set up mouse and touch drag handlers for bead blocks
    setupBeadDragHandlers() {
        // We use event delegation on the workspace
        const ws = this.beadWorkspace;
        if (!ws) return;

        // --- Mouse events ---
        ws.addEventListener('mousedown', (e) => this.onBeadPointerDown(e, e.clientX, e.clientY));
        document.addEventListener('mousemove', (e) => this.onBeadPointerMove(e, e.clientX, e.clientY));
        document.addEventListener('mouseup', (e) => this.onBeadPointerUp(e, e.clientX, e.clientY));

        // --- Touch events ---
        ws.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            this.onBeadPointerDown(e, t.clientX, t.clientY);
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!this.draggedBead) return;
            e.preventDefault();
            const t = e.touches[0];
            this.onBeadPointerMove(e, t.clientX, t.clientY);
        }, { passive: false });
        document.addEventListener('touchend', (e) => {
            if (!this.draggedBead) return;
            const t = e.changedTouches[0];
            this.onBeadPointerUp(e, t.clientX, t.clientY);
        });

        // Visual feedback on dropzone
        this.beadDropzone.addEventListener('dragover', (e) => e.preventDefault());
    }

    onBeadPointerDown(e, clientX, clientY) {
        const block = e.target.closest('.bead-block');
        if (!block) return;
        e.preventDefault();

        this.draggedBead = block;
        block.classList.add('dragging');

        // Create a floating clone for visual feedback
        const rect = block.getBoundingClientRect();
        this.dragOffsetX = clientX - rect.left;
        this.dragOffsetY = clientY - rect.top;

        const ghost = block.cloneNode(true);
        ghost.className = block.className + ' bead-ghost';
        ghost.style.position = 'fixed';
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '9999';
        ghost.style.opacity = '0.85';
        document.body.appendChild(ghost);
        this.dragGhost = ghost;

        // Dim the original
        block.style.opacity = '0.3';
    }

    onBeadPointerMove(e, clientX, clientY) {
        if (!this.draggedBead || !this.dragGhost) return;

        this.dragGhost.style.left = `${clientX - this.dragOffsetX}px`;
        this.dragGhost.style.top = `${clientY - this.dragOffsetY}px`;

        // Highlight dropzone when hovering over it
        const dzRect = this.beadDropzone.getBoundingClientRect();
        const over = clientX >= dzRect.left && clientX <= dzRect.right &&
                     clientY >= dzRect.top && clientY <= dzRect.bottom;
        this.beadDropzone.classList.toggle('drag-over', over);
    }

    onBeadPointerUp(e, clientX, clientY) {
        if (!this.draggedBead) return;

        const block = this.draggedBead;
        block.classList.remove('dragging');
        block.style.opacity = '';
        this.beadDropzone.classList.remove('drag-over');

        // Remove ghost
        if (this.dragGhost) {
            this.dragGhost.remove();
            this.dragGhost = null;
        }

        // Check if dropped on dropzone or supply
        const dzRect = this.beadDropzone.getBoundingClientRect();
        const supRect = this.beadSupply.getBoundingClientRect();
        const inDropzone = clientX >= dzRect.left && clientX <= dzRect.right &&
                           clientY >= dzRect.top && clientY <= dzRect.bottom;
        const inSupply = clientX >= supRect.left && clientX <= supRect.right &&
                         clientY >= supRect.top && clientY <= supRect.bottom;

        const wasInDropzone = block.parentElement === this.beadDropzone;

        if (inDropzone && !wasInDropzone) {
            // Move from supply to dropzone
            this.beadDropzone.appendChild(block);
            block.classList.add('just-landed');
            setTimeout(() => block.classList.remove('just-landed'), 200);
        } else if (inSupply && wasInDropzone) {
            // Move back from dropzone to supply
            this.beadSupply.appendChild(block);
        }

        // Update count
        this.updateDropzoneCount();
        this.draggedBead = null;
    }

    updateDropzoneCount() {
        const count = this.beadDropzone.querySelectorAll('.bead-block').length;
        this.dropzoneCount.textContent = count;
        this.beadDropzone.classList.toggle('has-beads', count > 0);
    }

    // Set the active difficulty level
    setDifficulty(level) {
        this.selectedDifficulty = level;
        this.consecutiveCorrect = 0;
        this.saveSelectedDifficulty();
        this.updateDifficultyDisplay();
        if (!this.inChallengeMode) {
            this.generateNewProblem();
        }
    }

    // Update which difficulty button appears active
    updateDifficultyDisplay() {
        if (!this.difficultyButtons) return;
        this.difficultyButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === this.selectedDifficulty);
        });
    }

    // Persist the selected difficulty
    saveSelectedDifficulty() {
        localStorage.setItem('mathOrbDifficulty', this.selectedDifficulty);
    }

    // Load the persisted difficulty selection
    loadSelectedDifficulty() {
        const saved = localStorage.getItem('mathOrbDifficulty');
        // Migrate legacy string values to numbered levels
        if (saved === 'easy') return '1';
        if (saved === 'medium') return '2';
        if (saved === 'hard') return '3';
        return saved;
    }

    // Auto-advance level after consecutive correct answers threshold
    maybeAutoAdvanceLevel() {
        if (this.consecutiveCorrect < LEVEL_UP_THRESHOLD) {
            return false;
        }
        const next = NEXT_LEVEL[this.selectedDifficulty];
        if (!next) {
            this.consecutiveCorrect = 0;
            return false;
        }
        this.selectedDifficulty = next;
        this.consecutiveCorrect = 0;
        this.saveSelectedDifficulty();
        this.updateDifficultyDisplay();
        return true;
    }

    // Set the active operation mode
    setMode(mode) {
        this.selectedMode = mode;
        this.saveSelectedMode();
        this.updateModeDisplay();
        if (!this.inChallengeMode) {
            this.generateNewProblem();
        }
    }

    // Update which mode button appears active
    updateModeDisplay() {
        if (!this.modeButtons) return;
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.selectedMode);
        });
    }

    // Persist the selected mode
    saveSelectedMode() {
        localStorage.setItem('mathOrbMode', this.selectedMode);
    }

    // Load the persisted mode selection
    loadSelectedMode() {
        return localStorage.getItem('mathOrbMode');
    }
}

// Export for use with GameManager
// Don't auto-initialize - let GameManager handle it
