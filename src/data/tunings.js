export const STANDARD_TUNINGS = {
  'bass': {
    '4-string': {
      'standard': ['E1', 'A1', 'D2', 'G2'],
      'drop-d': ['D1', 'A1', 'D2', 'G2'],
      'half-step-down': ['D#1', 'G#1', 'C#2', 'F#2'],
      'whole-step-down': ['D1', 'G1', 'C2', 'F2']
    },
    '5-string': {
      'standard': ['B0', 'E1', 'A1', 'D2', 'G2'],
      'half-step-down': ['A#0', 'D#1', 'G#1', 'C#2', 'F#2'],
      'drop-a': ['A0', 'E1', 'A1', 'D2', 'G2']
    },
    '6-string': {
      'standard': ['B0', 'E1', 'A1', 'D2', 'G2', 'C3'],
      'drop-a': ['A0', 'E1', 'A1', 'D2', 'G2', 'C3']
    }
  },
  'electric-guitar': {
    '6-string': {
      'standard': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'half-step-down': ['D#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
      'whole-step-down': ['D2', 'G2', 'C3', 'F3', 'A3', 'D4'],
      'drop-d': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'drop-c#': ['C#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
      'drop-c': ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'],
      'drop-b': ['B1', 'F#2', 'B2', 'E3', 'G#3', 'C#4'],
      'DADGAD': ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
      'open-g': ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
      'open-d': ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
      'open-c': ['C2', 'G2', 'C3', 'G3', 'C4', 'E4']
    },
    '7-string': {
      'standard': ['B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'half-step-down': ['A#1', 'D#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
      'whole-step-down': ['A1', 'D2', 'G2', 'C3', 'F3', 'A3', 'D4'],
      'drop-a': ['A1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    },
    '8-string': {
      'standard': ['F#1', 'B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'drop-e': ['E1', 'B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4']
    }
  },
  'acoustic-guitar': {
    '6-string': {
      'standard': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'half-step-down': ['D#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
      'DADGAD': ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
      'drop-d': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'open-c': ['C2', 'G2', 'C3', 'G3', 'C4', 'E4'],
      'open-d': ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
      'open-e': ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'],
      'open-g': ['D2', 'G2', 'D3', 'G3', 'B3', 'D4']
    }
  },
  'pure-tone': {
    'ukelele': {
      'standard': ['G3', 'C3', 'E3', 'A3'],
    },
    '4-string bass': {
      'standard': ['E1', 'A1', 'D2', 'G2'],
    },
    '5-string bass': {
      'standard': ['B0', 'E1', 'A1', 'D2', 'G2'],
    },
    '6-string guitar': {
      'standard': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
    }
  }
}
