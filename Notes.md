# Note file

Adding some of the text from some of the changes markdown files that occasionally get added with some of the text prompts.

## Text prompt and Response

Text prompt - For the playback controls, I want the stop button to take place of the play button when the repeat or continuous action is performed. For instance, If I'm playing on the 6th string, I want only that play button to show the stop button when it's in use.

Also, for the continuous mode, I want it to play continuously when pressed, not when I'm holding the key down. I'm also noting here that the actual code that was produced for the updates was not just broken, but adding and point to files that not only didn't exist, but where seeming to confuse Claude as to what they were meant to be doing in the first place. Simplifying the ask seemed to present better results, but in the end, I wasn't asking Claude to do anything differently, just giving it a chance to give me a second option or path to finishing this.

------------------------------------------------------------------

Response below -

## Changes Made

### 1. Play/Stop Button Toggle on Each String

**Location:** `components/StringDisplay.vue`

- Each string now shows either a "Play" button or a "Stop" button depending on its state
- When a string is not playing, it shows "▶ Play"
- When a string is playing (in either repeat or continuous mode), the Play button changes to "■ Stop"
- Only the currently playing string shows the Stop button - all others show Play buttons
- The active string row is highlighted with a blue background

**Key Implementation:**
```vue
<button v-if="playingString !== index" @click="$emit('play', index)" class="play-button">
  ▶ Play
</button>
<button v-else @click="$emit('stop', index)" class="stop-button">
  ■ Stop
</button>
```

### 2. Playback Modes

**Location:** `composables/useAudio.js` (no changes needed)

#### Repeat Mode (3s intervals)
- Plays the note immediately
- Repeats every 3 seconds indefinitely
- The Play button transforms into a Stop button
- Click Stop to end the repetition
- Interval is properly cleared when stopped

#### Continuous Mode
- Click Play once to start a continuous drone/loop
- The Play button immediately transforms into a Stop button
- The sound continues looping until you click Stop
- Automatically stops the previous string when a new one is selected
- No need to hold down any button - it's a simple toggle

### 3. State Management

**Location:** `App.vue`

- Added `playingString` ref to track which string is currently playing (by index)
- Properly manages state transitions when switching strings in continuous mode
- When switching to a new string in continuous mode, automatically stops the previous string
- Cleans up state when stopping playback

## Files Modified

1. **App.vue** - Main component
   - Added `playingString` state tracking
   - Added global "Stop All" button
   - Updated play/stop handlers
   - Automatic stop when switching strings in continuous mode
   - Added `playingString` prop to StringDisplay component

2. **components/StringDisplay.vue** - String display component
   - Toggle between play and stop buttons based on `playingString` prop
   - Visual feedback for playing state (blue background)
   - Accepts `playingString` prop to determine which string is active
   - Emits 'play' and 'stop' events to parent

3. **composables/useAudio.js** - Audio playback logic
   - No changes needed - the existing implementation already supports:
     - Repeat mode with 3-second intervals
     - Continuous mode with looping samples
     - Proper cleanup in `stopNote()`
   - Uses MP3 samples for realistic guitar/bass sounds
   - Falls back to pure tone oscillators when needed

## User Experience Improvements

1. **Clear Visual Feedback:** Users can see which string is currently playing with the blue highlight
2. **Intuitive Controls:** Each string's Play button becomes a Stop button when that specific string is active
3. **One Button Per String:** Simple, clean interface - each string has only one action button at a time
4. **Smart Switching:** In continuous mode, selecting a new string automatically stops the previous one
5. **Proper Cleanup:** All intervals and audio sources are properly cleaned up to prevent audio glitches

## Testing Recommendations

1. Test repeat mode - verify it plays every 3 seconds and the Play button changes to Stop, then stops when clicking Stop
2. Test continuous mode - verify clicking Play starts a continuous loop, the button changes to Stop, and clicking Stop ends it
3. Verify only the active string shows a Stop button while all others show Play buttons
4. Test rapid switching between strings in continuous mode to ensure proper cleanup
5. Verify the blue highlight appears only on the currently playing string
