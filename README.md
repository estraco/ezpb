# ezpb

## Description

This was made because I wanted a progress bar that was easy to use and integrate with other libraries, and I was bored. \
I have attempted to build one from scratch for a few other projects, but it always ended up being buggy and hard to use. \
It uses the [Braille Unicode characters](https://en.wikipedia.org/wiki/Braille_Patterns) to display the progress bar. \
It also has a few other features like an axios progress handler and an http progress handler.

## Usage

```typescript
import { ProgressBar } from 'ezpb';

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
import { BrailleCharacter, Indices } from '../braille';

const character = new BrailleCharacter();

character.setPoint(0, 0, true); // set the top left dot
console.log(character.toString()); // ⠁

character.setBit(0b00000010, true); // set the second dot down on the left
console.log(character.toString()); // ⠃

character.xor(new BrailleCharacter().setBit(0b00000100, true)); // xor against other character object
console.log(character.toString()); // ⠇

character.xorGrid([
    [false, true],
    [false, false],
    [false, false],
    [false, false]
]); // xor against grid
console.log(character.toString()); // ⠏

character.xorBinary(0b00100000); // xor against binary number
console.log(character.toString()); // ⠟

character.togglePoint(1, 2); // toggle third dot down on the right
console.log(character.toString()); // ⠿

const unicode = character.getUnicode(); // get the unicode character code

console.log(unicode.toString(16)); // 283f

const char = character.getChar(); // get the string representation of the character

console.log(char); // ⠿

const string = character.toString(); // get the string representation of the character

console.log(string); // ⠿

// You can also use the static methods
const character2 = BrailleCharacter.fromUnicodeStyleBinary(0b01010101);

console.log(character2.toString()); // ⡕

const character3 = BrailleCharacter.fromChar('⠿');

console.log(character3.toString()); // ⠿

const character4 = BrailleCharacter.fromGrid([
    [false, true],
    [false, false],
    [false, false],
    [false, false]
]);

console.log(character4.toString()); // ⠈

const character5 = BrailleCharacter.fromPercent(0.5, 'clockwise'); // display styles are defined as an enum at BrailleStyleEnum, a type alias at BrailleStyle, an array at BrailleStyleArray, or can be a GeneratorFunction that yields a 2x8 grid of indices and returns a BrailleCharacter as fallback

console.log(character5.toString()); // ⡇

const binaryMapping: { [key: number]: { base: BrailleCharacter; xor: BrailleCharacter; }; } = {};

binaryMapping[0] = {
    base: BrailleCharacter.fromUnicodeStyleBinary(0),
    xor: BrailleCharacter.fromUnicodeStyleBinary(0)
};

for (let i = 1; i < 256; i++) {
    const currentChar = BrailleCharacter.fromBinary(i);

    binaryMapping[i] = {
        base: currentChar,
        xor: currentChar.clone().xor(BrailleCharacter.fromBinary(i - 1))
    };
}

const indices: Indices = Object.values(binaryMapping).map((value) => value.xor.getIndices());

let str = '';

for (let i = 0; i < 256; i++) {
    str += BrailleCharacter.fromPercent(i / 255, indices).toString();
}

console.log(str); // 256 braille characters
```

#### Note on binary numbers

The binary numbers in Unicode's positioning format used in this module are in the following format below `(x, y): binary literal [bit mask]` where (0, 0) is the top left dot and (1, 3) is the bottom right dot:

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

The binary numbers not in Unicode's positioning format are in the following format below `(x, y): binary literal [bit mask]` where (0, 0) is the top left dot and (1, 3) is the bottom right dot:

```typescript
(0, 0): 0b00000001 [1 << 0]
(0, 1): 0b00000010 [1 << 1]
(0, 2): 0b00000100 [1 << 2]
(0, 3): 0b00001000 [1 << 3]
(1, 0): 0b00010000 [1 << 4]
(1, 1): 0b00100000 [1 << 5]
(1, 2): 0b01000000 [1 << 6]
(1, 3): 0b10000000 [1 << 7]
```
