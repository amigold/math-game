// Math Orb Collector - Refactored Game Logic with Lifecycle Methods

class MathOrbGame {
    constructor() {
        // Game state
        this.currentProblem = null;
        this.emojiCollection = [];
        this.magicFaceCollection = [];
        this.pictureCollection = [];
        this.difficulty = 1;
        this.problemsSolved = 0;
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

        // Load saved collections
        this.emojiCollection = this.loadCollection();
        this.magicFaceCollection = this.loadMagicCollection();
        this.pictureCollection = this.loadPictureCollection();

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

        // Update displays
        this.updateCollectionDisplay();
        this.updateMagicCollectionDisplay();
        this.updatePictureCollectionDisplay();

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

    // Generate a random math problem
    generateMathProblem(isMagic = false) {
        let num1, num2;

        if (isMagic) {
            // Magic balls: One double-digit, one single-digit
            num1 = Math.floor(Math.random() * 10) + 10; // 10-19
            num2 = Math.floor(Math.random() * 10); // 0-9
        } else {
            // Adjust difficulty based on progress
            if (this.difficulty <= 3) {
                // Easy: 0-9 + 0-9
                num1 = Math.floor(Math.random() * 10);
                num2 = Math.floor(Math.random() * 10);
            } else if (this.difficulty <= 6) {
                // Medium: results up to 15
                num1 = Math.floor(Math.random() * 10);
                num2 = Math.floor(Math.random() * (15 - num1));
            } else {
                // Hard: results up to 20
                num1 = Math.floor(Math.random() * 15);
                num2 = Math.floor(Math.random() * (20 - num1));
            }
        }

        return {
            num1: num1,
            num2: num2,
            answer: num1 + num2
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

            // Hide input/check button for rainbow ball
            this.answerInput.style.display = 'none';
            this.checkButton.style.display = 'none';
        } else {
            // Regular or magic ball
            this.currentProblem = this.generateMathProblem(this.isMagicBall);

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
            problemText.textContent = `${this.currentProblem.num1} + ${this.currentProblem.num2}`;
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
        // Show feedback
        this.feedbackMessage.textContent = this.isMagicBall ? 'Amazing! Magic Face!' : 'Great job!';
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

                // Increase difficulty gradually
                if (this.emojiCollection.length % 5 === 0) {
                    this.difficulty++;
                }
            }

            // Generate next problem after delay
            setTimeout(() => {
                this.generateNewProblem();
            }, 2000);
        }, 300);
    }

    // Handle wrong answer
    handleWrongAnswer(orb) {
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
            this.difficulty = 1;
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

        // Clear previous orb
        this.orbContainer.innerHTML = '';

        // Create new orb
        const orb = document.createElement('div');
        orb.className = 'orb';
        orb.style.background = this.getRandomOrbColor();

        const problemText = document.createElement('div');
        problemText.className = 'problem-text';
        problemText.textContent = `${this.currentProblem.num1} + ${this.currentProblem.num2}`;
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
}

// Export for use with GameManager
// Don't auto-initialize - let GameManager handle it
