# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Math Orb Collector is a pure vanilla JavaScript educational game for first-graders to practice addition. The game has no build process, frameworks, or dependencies - it runs directly in the browser.

**Live Site:** https://amigoldenberg.github.io/math-game/

## Development Workflow

### Running the Game
```bash
open index.html
```
The game runs entirely client-side. Simply open `index.html` in any modern browser.

### Deploying Changes
```bash
git add .
git commit -m "Description of changes"
git push
```
GitHub Pages automatically deploys from the `main` branch within 1-2 minutes.

### Adding Pictures
1. Place image files (.jpg, .jpeg, .png, .gif) in `/pictures/` folder
2. Update `pictures.js` array with the new filenames:
```javascript
const AVAILABLE_PICTURES = [
    'image1.jpg',
    'image2.png',
    // ...
];
```

## Architecture

### Core Game State (game.js - MathOrbGame class)

The game is a single-class state machine with three distinct modes:

1. **Regular Mode**: Standard math problems with emoji rewards
2. **Magic Ball Mode**: Every 5th problem (harder equations, face emoji rewards)
3. **Challenge Mode**: Every 10th problem (timed 2-minute challenge for picture rewards)

**Key State Variables:**
- `problemsSolved`: Problem counter that determines orb type (% 5 for magic, % 10 for rainbow)
- `inChallengeMode`: Boolean flag that switches game behavior entirely
- `difficulty`: Progressive difficulty level (1-7+) that affects problem ranges

### Game Flow Logic

The orb selection happens in `generateNewProblem()`:
```javascript
if (problemsSolved % 10 === 0) → Rainbow orb (challenge)
else if (problemsSolved % 5 === 0) → Magic orb
else → Regular orb
```

**Important:** Rainbow orbs DON'T auto-increment `problemsSolved` when they appear - they only increment on successful challenge completion. This prevents the 10/15/20 pattern from breaking.

### Three Collection Systems

Each collection is independent with its own localStorage key:

1. **Regular Emojis** (`mathOrbCollection`):
   - 50 emojis defined in `availableEmojis` array
   - No duplicates stored (uses `includes()` check)

2. **Magic Faces** (`mathOrbMagicCollection`):
   - 30 face emojis defined in `faceEmojis` array
   - Earned from magic orbs AND as bonus (4x same picture)
   - No duplicates stored

3. **Pictures** (`mathOrbPictureCollection`):
   - Loaded from external `AVAILABLE_PICTURES` array (pictures.js)
   - DOES store duplicates (array of filenames)
   - Displays with count badges (x2, x3, x4, etc.)
   - 4th duplicate triggers bonus magic face

### Challenge Mode Architecture

Challenge mode is a completely separate game loop:

1. **Trigger**: Rainbow orb clicked → `startChallenge()`
2. **Countdown**: 3-2-1-START overlay via `runCountdown()`
3. **Challenge Loop**: `generateChallengeProb()` instead of `generateNewProblem()`
4. **Separate Answer Handling**: `handleChallengeCorrect()` / `handleChallengeWrong()`
5. **Timer**: `setInterval` in `beginChallenge()`, tracked by `challengeTimeLeft`
6. **Exit**: `endChallenge(success)` → Always returns to regular gameplay

**Critical:** `inChallengeMode` flag must be checked in `checkAnswer()` to route to correct handlers.

### Sound System

Uses Web Audio API (no external files):
- `playSound('correct')`: Ascending C5-E5-G5 progression
- `playSound('incorrect')`: Descending G4-E4 progression
- Implemented via oscillators with gain envelopes

### Animation System

All animations are CSS-based:
- Orb types have distinct classes: `.orb`, `.magic-orb`, `.rainbow-orb`
- State changes trigger class additions: `.shake`, `.opening`
- Sparkles for magic orbs: 12 `.sparkle` divs with staggered delays

## localStorage Keys

- `mathOrbCollection`: Array of regular emoji strings
- `mathOrbMagicCollection`: Array of face emoji strings
- `mathOrbPictureCollection`: Array of picture filenames (with duplicates)

## Important Implementation Details

### Math Problem Generation

Three difficulty tiers based on `generateMathProblem(isMagic)`:
- **Regular (difficulty 1-3)**: 0-9 + 0-9
- **Regular (difficulty 4-6)**: 0-9 + 0-9 with results ≤ 15
- **Regular (difficulty 7+)**: Numbers up to 15 with results ≤ 20
- **Magic**: Always 10-19 + 0-9 (max result: 28)

Difficulty increments every 5 correct answers in `handleCorrectAnswer()`.

### Problem Counter Behavior

- Regular/magic orbs: Increment AFTER correct answer
- Rainbow challenge: Increment ONLY on challenge completion (not on appearance)
- Wrong answers: NEVER increment counter

This ensures the 5/10 pattern stays consistent.

### Picture Duplicate Tracking

The 4x bonus logic in `awardPicture()`:
```javascript
const pictureCount = this.pictureCollection.filter(p => p === randomPicture).length;
if (pictureCount === 4) {
    // Award bonus magic face
}
```
This checks the total count INCLUDING the just-added picture.

## File Organization

- `index.html`: Static DOM structure, no dynamic HTML generation
- `game.js`: All game logic in single MathOrbGame class (650+ lines)
- `styles.css`: All styling including animations (580+ lines)
- `pictures.js`: Single exported constant array
- `spec.md`: Complete game design specification

## Common Modifications

### Adjusting Difficulty
Modify `generateMathProblem()` ranges or the difficulty tier thresholds.

### Changing Orb Frequency
Modify the modulo checks in `generateNewProblem()`:
```javascript
problemsSolved % 10 === 0  // Rainbow frequency
problemsSolved % 5 === 0   // Magic frequency
```

### Adding New Emoji/Collections
Add to `availableEmojis` or `faceEmojis` arrays in constructor.

### Modifying Challenge Timer
Change `this.challengeTimeLeft = 120` (in seconds) or required problems count in `handleChallengeCorrect()`.

## Testing Considerations

- Test localStorage persistence across page reloads
- Verify orb sequence: 1-4 regular, 5 magic, 6-9 regular, 10 rainbow, repeat
- Test challenge mode timer expiration and success paths
- Verify picture duplicate counting (especially the 4x bonus trigger)
- Test with empty `AVAILABLE_PICTURES` array (should show message)
