# progressbar-ts

## Description

This was made because I wanted a progress bar that was easy to use and integrate with other libraries, and I was bored. \
I hve attempted to build one from scratch for a few other projects, but it always ended up being buggy and hard to use. \
It uses the [Braille Unicode characters](https://en.wikipedia.org/wiki/Braille_Patterns) to display the progress bar. \
It also has a few other features like an axios progress handler and an http progress handler.

## Usage

```typescript
import { ProgressBar } from 'progressbar-ts';

const bar = new ProgressBar('name', 100 /* total */);

bar.start(15); // start the progress bar loop with 15ms interval (~60fps)

bar.update(10); // update the progress bar to 10 out of 100

bar.stop(); // stop the progress bar loop
```

## API

### `new ProgressBar(name: string, total: number, style?: BrailleStyle)`

Creates a new progress bar with the given name and total.

### `bar.start()`

Starts the progress bar loop. Automatically stops when the progress bar is full.

### `bar.update(current: number)`

Updates the progress bar to the given current value.

### `bar.stop()`

Stops the progress bar loop.

### `bar.axiosProgress()`

Returns an axios progress handler that updates the progress bar. \
Use `axios[METHOD](url, bar.axiosProgress())` or use the `bar.axiosProgress().onDownloadProgress` function as the `onDownloadProgress` option when requesting.

### `bar.httpProgress()`

Returns an http progress handler that updates the progress bar. \
Call `bar.httpProgress()(response)` to start the progress bar.

## Submodules

### Braille

```typescript
import { BrailleCharacter } from 'progressbar-ts/braille';

const character = new BrailleCharacter();

character.setPoint(0, 0, true); // set the top left dot
character.setBit(0b00000010); // set the second dot down on the left
character.xor(new BrailleCharacter().setBit(0b00000100)); // xor against other character object
character.xorGrid([
    [false, true],
    [false, false],
    [false, false],
    [false, false]
]); // xor against grid
character.xorBinary(0b00010000); // xor against binary number
character.togglePoint(1, 3, true); // toggle third dot down on the right

const unicode = character.getBinary(); // get the unicode character code
const char = character.getChar(); // get the string representation of the character
const string = character.toString(); // get the string representation of the character

// [Symbol.toPrimitive] is implemented
console.log(`The character is ${character}.`); // The character is ⠿.
console.log('0x' + (character + 2).toString(16)); // 0x2841

// You can also use the static methods
const character2 = BrailleCharacter.fromBinary(0b01010101);
const character3 = BrailleCharacter.fromChar('⠿');
const character4 = BrailleCharacter.fromGrid([
    [false, true],
    [false, false],
    [false, false],
    [false, false]
]);
const character5 = BrailleCharacter.fromPercent(0.5, 'clockwise'); // display style are defined as an enum at BrailleStyleEnum, a type alias at BrailleStyle, and an array at BrailleStyleArray
```

#### Note on binary numbers

The binary numbers used in this module are in the following format below `(x, y): binary literal [bit mask]` where (0, 0) is the top left dot and (3, 1) is the bottom right dot:

```typescript
(0, 0): 0b00000001 [1 << 0]
(0, 1): 0b00000010 [1 << 1]
(0, 2): 0b00000100 [1 << 2]
(1, 0): 0b00001000 [1 << 3]
(1, 1): 0b00010000 [1 << 4]
(1, 2): 0b00100000 [1 << 5]
(0, 3): 0b01000000 [1 << 6]
(1, 3): 0b10000000 [1 << 7]
```
