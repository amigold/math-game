// Speech Recognition Game - Practice Hebrew pronunciation with voice recognition

class SpeechGame {
    constructor() {
        // Game data
        this.data = SPEECH_DATA;

        // Current level (1-4)
        this.currentLevel = 1;

        // Progress tracking
        this.correctAnswers = 0;
        this.totalAttempts = 0;
        this.currentChallengeIndex = 0;

        // Current challenge
        this.currentChallenge = null;

        // Collected prizes
        this.collectedPrizes = [];

        // Speech recognition
        this.recognition = null;
        this.isRecording = false;

        // DOM elements (will be initialized in init())
        this.elements = {};
    }

    /**
     * Initialize the game
     */
    init() {
        console.log('🎤 Initializing Speech Game...');

        // Get all DOM elements
        this.elements = {
            // Screens
            levelSelection: document.getElementById('speech-level-selection'),
            gameScreen: document.getElementById('speech-game-screen'),
            prizeScreen: document.getElementById('speech-prize-screen'),
            collectionScreen: document.getElementById('speech-collection-screen'),

            // Level selection
            levelCards: document.querySelectorAll('.speech-level-card'),
            showCollectionBtn: document.getElementById('speech-show-collection-btn'),

            // Game screen
            challengeText: document.getElementById('challenge-text'),
            challengeDescription: document.getElementById('challenge-description'),
            examplesList: document.getElementById('examples-list'),
            micButton: document.getElementById('speech-mic-button'),
            skipButton: document.getElementById('skip-button'),
            statusText: document.getElementById('speech-status-text'),
            resultText: document.getElementById('speech-result-text'),
            progressBar: document.getElementById('speech-progress-bar'),
            progressText: document.getElementById('speech-progress-text'),

            // Prize screen
            prizeEmoji: document.getElementById('prize-emoji'),
            prizeName: document.getElementById('prize-name'),
            continueButton: document.getElementById('continue-button'),

            // Collection
            prizeCollection: document.getElementById('speech-prize-collection'),
            backToLevelsBtn: document.getElementById('speech-back-to-levels-btn'),

            // Exit button
            exitButton: document.getElementById('speech-exit-button')
        };

        // Setup speech recognition
        this.setupSpeechRecognition();

        // Load saved progress
        this.loadProgress();

        // Setup event listeners
        this.setupEventListeners();

        console.log('✓ Speech Game initialized');
    }

    /**
     * Setup Web Speech API
     */
    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Speech Recognition not supported');
            alert('הַדַּפְדְּפָן שֶׁלְּךָ אֵינוֹ תּוֹמֵךְ בְּזִיהוּי קוֹלִי. אָנָּא הִשְׁתַּמֵּשׁ בְּכְרוֹם אוֹ סַפָּארִי.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'he-IL';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;

        // Event handlers
        this.recognition.onstart = () => {
            this.isRecording = true;
            this.elements.micButton.classList.add('recording');
            this.elements.statusText.textContent = '🎙️ מַאֲזִין... דַּבֵּר עַכְשָׁיו!';
            this.elements.statusText.className = 'status-message listening';
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;

            console.log('Recognized:', transcript, 'Confidence:', confidence);

            this.handleSpeechResult(transcript, confidence);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isRecording = false;
            this.elements.micButton.classList.remove('recording');

            if (event.error === 'no-speech') {
                this.elements.statusText.textContent = 'לֹא שָׁמַעְתִּי. נַסֶּה שׁוּב!';
            } else {
                this.elements.statusText.textContent = 'שְׁגִיאָה. נַסֶּה שׁוּב.';
            }
            this.elements.statusText.className = 'status-message error';
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            this.elements.micButton.classList.remove('recording');
        };
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Level cards
        this.elements.levelCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.startLevel(index + 1);
            });
        });

        // Mic button
        this.elements.micButton.addEventListener('click', () => {
            if (this.recognition && !this.isRecording) {
                try {
                    this.recognition.start();
                } catch (e) {
                    console.error('Error starting recognition:', e);
                }
            }
        });

        // Skip button
        this.elements.skipButton.addEventListener('click', () => {
            this.skipChallenge();
        });

        // Continue button (after prize)
        this.elements.continueButton.addEventListener('click', () => {
            this.showScreen('gameScreen');
            this.nextChallenge();
        });

        // Collection buttons
        this.elements.showCollectionBtn.addEventListener('click', () => {
            this.showCollection();
        });

        this.elements.backToLevelsBtn.addEventListener('click', () => {
            this.showScreen('levelSelection');
        });

        // Exit button
        this.elements.exitButton.addEventListener('click', () => {
            if (typeof gameManager !== 'undefined') {
                gameManager.exitToLobby();
            }
        });
    }

    /**
     * Start the game (called by GameManager)
     */
    start() {
        this.showScreen('levelSelection');
    }

    /**
     * Pause the game (called by GameManager)
     */
    pause() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
    }

    /**
     * Show a specific screen
     */
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('speech-screen')) {
                el.classList.add('hidden');
            }
        });

        // Show requested screen
        const screens = {
            levelSelection: this.elements.levelSelection,
            gameScreen: this.elements.gameScreen,
            prizeScreen: this.elements.prizeScreen,
            collectionScreen: this.elements.collectionScreen
        };

        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
        }
    }

    /**
     * Start a specific level
     */
    startLevel(level) {
        this.currentLevel = level;
        this.currentChallengeIndex = 0;
        this.correctAnswers = 0;
        this.totalAttempts = 0;

        console.log('Starting level:', level);

        this.showScreen('gameScreen');
        this.nextChallenge();
    }

    /**
     * Load next challenge
     */
    nextChallenge() {
        const levelData = this.getLevelData();

        if (this.currentChallengeIndex >= levelData.length) {
            // Level completed - loop back
            this.currentChallengeIndex = 0;
        }

        this.currentChallenge = levelData[this.currentChallengeIndex];
        this.displayChallenge();
        this.updateProgress();
    }

    /**
     * Get data for current level
     */
    getLevelData() {
        return this.data[`level${this.currentLevel}`];
    }

    /**
     * Display current challenge
     */
    displayChallenge() {
        const challenge = this.currentChallenge;

        // Display main text (syllable or word)
        const mainText = challenge.syllable || challenge.word;
        this.elements.challengeText.textContent = mainText;

        // Display description
        const description = challenge.description || '';
        this.elements.challengeDescription.textContent = description;

        // Display examples (for syllables)
        this.elements.examplesList.innerHTML = '';
        if (challenge.examples) {
            challenge.examples.forEach(example => {
                const li = document.createElement('li');
                li.textContent = example;
                this.elements.examplesList.appendChild(li);
            });
            this.elements.examplesList.parentElement.style.display = 'block';
        } else {
            this.elements.examplesList.parentElement.style.display = 'none';
        }

        // Reset status
        this.elements.statusText.textContent = 'לְחַץ עַל הַמִּיקְרוֹפוֹן וְאֱמוֹר אֶת הַמִּלָּה';
        this.elements.statusText.className = 'status-message';
        this.elements.resultText.textContent = '';
    }

    /**
     * Handle speech recognition result
     */
    handleSpeechResult(transcript, confidence) {
        this.totalAttempts++;

        const isCorrect = this.checkAnswer(transcript);

        if (isCorrect) {
            this.handleCorrectAnswer(transcript);
        } else {
            this.handleWrongAnswer(transcript);
        }
    }

    /**
     * Check if the spoken text matches the challenge
     */
    checkAnswer(transcript) {
        const challenge = this.currentChallenge;
        const targetText = challenge.syllable || challenge.word;

        // Normalize text (remove nikud for comparison)
        const normalizedTranscript = this.removeNikud(transcript.trim());
        const normalizedTarget = this.removeNikud(targetText);

        console.log('Comparing:', normalizedTranscript, 'vs', normalizedTarget);

        // For syllables, check if transcript starts with the syllable
        // For words, check exact match
        if (challenge.syllable) {
            // Check if any of the examples were said
            if (challenge.examples) {
                return challenge.examples.some(example => {
                    const normalizedExample = this.removeNikud(example);
                    return normalizedTranscript === normalizedExample ||
                           normalizedTranscript.startsWith(normalizedExample);
                });
            }
            // Or check if starts with syllable
            return normalizedTranscript.startsWith(normalizedTarget);
        } else {
            // Exact match for words
            return normalizedTranscript === normalizedTarget;
        }
    }

    /**
     * Remove nikud (vowel marks) from Hebrew text for comparison
     */
    removeNikud(text) {
        // Remove Hebrew vowel marks (U+0591 to U+05C7)
        return text.replace(/[\u0591-\u05C7]/g, '').toLowerCase();
    }

    /**
     * Handle correct answer
     */
    handleCorrectAnswer(transcript) {
        this.correctAnswers++;

        // Show success feedback
        this.elements.statusText.textContent = 'נָכוֹן מְאוֹד! 🎉';
        this.elements.statusText.className = 'status-message success';
        this.elements.resultText.textContent = `אָמַרְתָּ: "${transcript}"`;
        this.elements.resultText.className = 'result-text success';

        // Play success sound
        this.playSound('correct');

        // Update progress
        this.updateProgress();

        // Check if earned a prize (every 5 correct answers)
        if (this.correctAnswers % 5 === 0) {
            setTimeout(() => {
                this.awardPrize();
            }, 1500);
        } else {
            // Move to next challenge
            setTimeout(() => {
                this.currentChallengeIndex++;
                this.nextChallenge();
            }, 2000);
        }
    }

    /**
     * Handle wrong answer
     */
    handleWrongAnswer(transcript) {
        // Show error feedback
        this.elements.statusText.textContent = 'לֹא מְדֻיָּק. נַסֶּה שׁוּב!';
        this.elements.statusText.className = 'status-message error';
        this.elements.resultText.textContent = `אָמַרְתָּ: "${transcript}"`;
        this.elements.resultText.className = 'result-text error';

        // Play error sound
        this.playSound('incorrect');

        // Shake animation
        this.elements.challengeText.classList.add('shake');
        setTimeout(() => {
            this.elements.challengeText.classList.remove('shake');
        }, 500);
    }

    /**
     * Skip current challenge
     */
    skipChallenge() {
        this.currentChallengeIndex++;
        this.nextChallenge();
    }

    /**
     * Award a prize
     */
    awardPrize() {
        // Get random prize
        const availablePrizes = this.data.prizes.filter(
            p => !this.collectedPrizes.some(cp => cp.emoji === p.emoji)
        );

        let prize;
        if (availablePrizes.length > 0) {
            prize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        } else {
            // All collected, pick random
            prize = this.data.prizes[Math.floor(Math.random() * this.data.prizes.length)];
        }

        // Add to collection
        this.collectedPrizes.push(prize);
        this.saveProgress();

        // Show prize screen
        this.elements.prizeEmoji.textContent = prize.emoji;
        this.elements.prizeEmoji.style.background = prize.color;
        this.elements.prizeName.textContent = `זָכִיתָ בְּ${prize.name}! 🎊`;

        this.showScreen('prizeScreen');

        // Play celebration sound
        this.playSound('prize');
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        const nextPrize = 5 - (this.correctAnswers % 5);
        const progress = ((this.correctAnswers % 5) / 5) * 100;

        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.progressText.textContent =
            `עוֹד ${nextPrize} ${nextPrize === 1 ? 'נָכוֹן' : 'נְכוֹנִים'} לְפֶרֶס!`;
    }

    /**
     * Show collection
     */
    showCollection() {
        this.elements.prizeCollection.innerHTML = '';

        if (this.collectedPrizes.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'collection-empty';
            empty.textContent = 'עֲדַיִן לֹא אָסַפְתָּ פְּרָסִים.\nשַׂחֵק כְּדֵי לֶאֱסוֹף!';
            this.elements.prizeCollection.appendChild(empty);
        } else {
            this.collectedPrizes.forEach(prize => {
                const item = document.createElement('div');
                item.className = 'collection-item';

                const display = document.createElement('div');
                display.className = 'prize-display';
                display.style.background = prize.color;
                display.textContent = prize.emoji;

                const name = document.createElement('div');
                name.className = 'prize-name';
                name.textContent = prize.name;

                item.appendChild(display);
                item.appendChild(name);
                this.elements.prizeCollection.appendChild(item);
            });
        }

        this.showScreen('collectionScreen');
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
                // Happy ascending sound
                oscillator.frequency.value = 523.25; // C5
                gainNode.gain.value = 0.3;
                oscillator.start();
                setTimeout(() => {
                    oscillator.frequency.value = 659.25; // E5
                }, 100);
                setTimeout(() => {
                    oscillator.frequency.value = 783.99; // G5
                }, 200);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'incorrect') {
                // Sad descending sound
                oscillator.frequency.value = 392.00; // G4
                gainNode.gain.value = 0.3;
                oscillator.start();
                setTimeout(() => {
                    oscillator.frequency.value = 329.63; // E4
                }, 100);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'prize') {
                // Celebration sound
                oscillator.type = 'sine';
                oscillator.frequency.value = 523.25;
                gainNode.gain.value = 0.3;
                oscillator.start();

                for (let i = 1; i < 5; i++) {
                    setTimeout(() => {
                        oscillator.frequency.value = 523.25 * (1 + i * 0.2);
                    }, i * 100);
                }

                oscillator.stop(audioContext.currentTime + 0.5);
            }
        } catch (e) {
            console.warn('Could not play sound:', e);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('speechGameProgress');
            if (saved) {
                const data = JSON.parse(saved);
                this.collectedPrizes = data.collectedPrizes || [];
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
                collectedPrizes: this.collectedPrizes
            };
            localStorage.setItem('speechGameProgress', JSON.stringify(data));
            console.log('✓ Progress saved');
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    }
}
