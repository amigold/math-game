
🎮 Game Design Specification: "Math Orb Collector"

📁 Project Structure
```
math-game/
├── index.html          # Main game HTML structure
├── styles.css          # All styling and animations
├── game.js             # Core game logic and mechanics
├── pictures.js         # Picture configuration array
├── pictures/           # Folder for custom reward pictures
│   ├── README.md
│   └── [your images]
└── spec.md            # This specification document
```

⸻

🧩 Concept

A fun, interactive 2D math game designed for first-grade students to practice addition up to two-digit numbers.
Players solve addition exercises to "unlock" colorful orbs that contain collectible rewards.
The game features three types of orbs: regular orbs (emojis), magic orbs (face emojis), and rainbow orbs (picture challenges).

The goal is to collect as many rewards as possible by solving math problems correctly.

⸻

🕹 Gameplay Flow

## Regular Orbs (Standard Gameplay)
  1.  Falling Orb:
  • A colorful orb drops from the top of the screen into the center area.
  • On the orb, a simple addition problem is displayed (e.g., "3 + 5").
  2.  Player Input:
  • The player types the answer using the keyboard and presses Enter (or clicks a "Check" button).
  • The input field appears below the orb, clearly visible and easy for young players to use.
  3.  Correct Answer:
  • If the answer is correct, the orb opens with an animation.
  • A random emoji character appears (e.g., 🐸, 🦄, 🦖, 🧸, 🌈, 👑, 🚀).
  • The emoji is added to the player's collection displayed on the sidebar.
  • The player sees a "Great job!" message and hears a positive sound.
  4.  Wrong Answer:
  • If the answer is incorrect, the orb shakes and fades out.
  • A new orb with a different exercise immediately appears.
  5.  Progressive Difficulty:
  • The game continues with new orbs appearing one after another.
  • Exercises get slightly harder over time (higher numbers, results up to 20).
  • Difficulty increases every 5 correct answers.

## Magic Orbs (Every 5 Problems)
  • Appears every 5 problems solved
  • Golden/pink gradient with animated sparkles
  • More challenging problems: one double-digit number (10-19) + one single-digit (0-9)
  • Reward: Random face emoji (😀, 🤩, 😎, etc.) added to "Magic Faces" collection
  • Special feedback: "Amazing! Magic Face!"

## Rainbow Orbs (Every 10 Problems) - Challenge Mode
  1.  Rainbow Ball Appears:
  • Every 10 problems solved, a rainbow-colored orb appears
  • Displays "CHALLENGE!" text with pulsing animation
  • Player clicks the orb to start the challenge

  2.  Countdown Sequence:
  • Full-screen countdown: 3... 2... 1... START!
  • Each number animates with pulse effect

  3.  Challenge Mode (2 Minutes):
  • Timer appears in top-right corner showing time remaining
  • Player must solve 3 math problems within 2 minutes
  • Problems counter shows progress (e.g., "Problems: 2/3")
  • Standard difficulty addition problems

  4.  Challenge Success:
  • If 3 problems solved within 2 minutes: WIN!
  • Random picture from configured collection is awarded
  • Picture displays with reveal animation
  • Picture added to "Picture Gallery" collection
  • Message: "Challenge Complete! Picture Unlocked!"
  • Bonus: Collecting the same picture 4 times awards a magic face emoji

  5.  Challenge Failure:
  • If time runs out before 3 problems solved
  • Message: "Time's up! Try again!"
  • Returns to normal gameplay
  • Can try again at the next rainbow orb (every 10 problems)

⸻

🧮 Math Rules
  • Operations: Addition only
  • Regular Orbs: 0–9 + 0–9 at first, increasing to results up to 20
  • Magic Orbs: 10–19 + 0–9 (results up to 28)
  • Challenge Mode: Standard difficulty (0–9 + 0–9 to results up to 20)
  • Each problem is randomly generated
  • Difficulty level increases every 5 correct answers

⸻

🎨 Visual Style & UI
  • 2D colorful cartoon style with gradient background
  • Three orb types with distinct appearances:
    - Regular: Colorful gradients (8 different color schemes)
    - Magic: Golden/pink gradient with 12 floating sparkles
    - Rainbow: Rainbow gradient with color rotation animation
  • Smooth animations for:
    - Orbs falling from the top
    - Orbs opening on correct answers
    - Orbs shaking on wrong answers
    - Emoji/picture reveal animations
  • Sidebar Collections:
    - "My Collection": Regular emojis (4-column grid)
    - "Magic Faces": Face emojis (4-column grid, golden theme)
    - "Picture Gallery": Photos (3-column grid with count badges)
  • Challenge Mode UI:
    - Full-screen countdown overlay
    - Timer display in top-right corner (red gradient)
    - Problems counter showing progress
  • Reset Collection button at bottom of sidebar

⸻

🔊 Sounds & Feedback
  • Sound effects using Web Audio API:
    - Correct answer: Ascending musical tones (C5-E5-G5)
    - Wrong answer: Descending tones (G4-E4)
  • Visual feedback messages:
    - "Great job!" (correct answer)
    - "Amazing! Magic Face!" (magic orb correct)
    - "Try again!" (wrong answer)
    - "Challenge Complete! Picture Unlocked!" (challenge success)
    - "Challenge Complete! Bonus Magic Face!" (4th duplicate picture)
    - "Time's up! Try again!" (challenge failure)

⸻

🧠 Technical Requirements & Implementation
  • Platform: Browser (HTML5 + JavaScript + CSS)
  • Pure JavaScript (no frameworks)
  • Runs on desktop and tablet browsers (Chrome, Safari)
  • Data Persistence using localStorage:
    - Regular emoji collection
    - Magic face emoji collection
    - Picture collection (with duplicates tracked)
  • Picture System:
    - Pictures stored in `/pictures` folder
    - Configuration via `pictures.js` file
    - Supports: .jpg, .jpeg, .png, .gif
  • No backend required
  • Responsive design for tablets and desktops

⸻

🧩 Game Flow Logic

## Regular Gameplay Loop
1. Check problem count:
   - If count % 10 == 0: Display rainbow orb (challenge)
   - Else if count % 5 == 0: Display magic orb
   - Else: Display regular orb
2. Display orb with addition problem
3. Wait for user input (keyboard or check button)
4. If answer == correct:
   - Animate orb opening
   - Reveal reward (emoji/face emoji)
   - Add to appropriate collection
   - Play success sound
   - Show feedback message
   - Increment problem counter
5. Else (wrong answer):
   - Shake orb
   - Play error sound
   - Show "Try again!" message
6. Spawn new orb and repeat

## Rainbow Challenge Flow
1. Display rainbow orb with "CHALLENGE!" text
2. Wait for player to click orb
3. Run countdown: 3... 2... 1... START!
4. Start 2-minute timer
5. Challenge loop (repeat until 3 problems solved or timer expires):
   - Display problem
   - If correct: increment challenge counter, continue
   - If wrong: show feedback, give new problem
   - If 3 problems complete: Award picture, check for 4x bonus
   - If timer expires: End challenge (failed)
6. Return to regular gameplay

⸻

🎯 Collection System

## Three Collection Types:
1. **Regular Emojis** (My Collection)
   - 50 different emojis (animals, objects, sports, food)
   - Earned from regular orbs
   - No duplicates shown (each appears once)

2. **Magic Face Emojis** (Magic Faces)
   - 30 different face emojis
   - Earned from magic orbs (every 5 problems)
   - Also earned as bonus when collecting same picture 4 times
   - No duplicates shown

3. **Pictures** (Picture Gallery)
   - Custom photos from `/pictures` folder
   - Earned from rainbow challenge completion
   - Duplicates tracked with count badges (x2, x3, x4, etc.)
   - Getting same picture 4 times awards bonus magic face

## Persistence
  • All collections saved to browser localStorage
  • Collections persist across sessions
  • Reset Collection button clears all progress

⸻

🌟 Implemented Features
  ✅ Three types of orbs (regular, magic, rainbow)
  ✅ Progressive difficulty system
  ✅ Three separate collection systems
  ✅ Challenge mode with timer
  ✅ Picture reward system
  ✅ Duplicate tracking with bonuses
  ✅ Sound effects (Web Audio API)
  ✅ Multiple animations and visual effects
  ✅ localStorage persistence
  ✅ Reset functionality
  ✅ Responsive design

⸻

🌟 Future Enhancement Ideas
  • Different math operations (subtraction, multiplication)
  • Multiple difficulty settings (easy/medium/hard modes)
  • Score tracking and leaderboards
  • Daily challenges
  • Achievement system
  • Background music toggle
  • Custom emoji/picture themes
  • Confetti/fireworks animations for milestones
  • Parent/teacher dashboard for progress tracking
