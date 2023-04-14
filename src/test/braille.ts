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
