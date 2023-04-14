export type BrailleGrid = [
    [boolean, boolean],
    [boolean, boolean],
    [boolean, boolean],
    [boolean, boolean]
];

export type SingleBits = 0b00000001 |
    0b00000010 |
    0b00000100 |
    0b00001000 |
    0b00010000 |
    0b00100000 |
    0b01000000 |
    0b10000000;

export type Indices = [number, number][][];

export enum BrailleStyleEnum {
    Clockwise = 'clockwise',
    CounterClockwise = 'counter-clockwise',
    FillTopLeft = 'fill-top-left',
    FillTopRight = 'fill-top-right',
    FillBottomLeft = 'fill-bottom-left',
    FillBottomRight = 'fill-bottom-right',
    FillLeftTop = 'fill-left-top',
    FillLeftBottom = 'fill-left-bottom',
    FillRightTop = 'fill-right-top',
    FillRightBottom = 'fill-right-bottom'
}
export type BrailleStyle = 'ccw' | 'cw' | `${'counter-' | ''}clockwise` | `fill-${`top-${'left' | 'right'}` | `bottom-${'left' | 'right'}` | `left-${'top' | 'bottom'}` | `right-${'top' | 'bottom'}`}` | Indices;
export const BrailleStyleArray: BrailleStyle[] = [
    'ccw',
    'cw',
    'clockwise',
    'counter-clockwise',
    'fill-top-left',
    'fill-top-right',
    'fill-bottom-left',
    'fill-bottom-right',
    'fill-left-top',
    'fill-left-bottom',
    'fill-right-top',
    'fill-right-bottom'
];

export class BrailleCharacter {
    private grid: BrailleGrid = [
        [false, false],
        [false, false],
        [false, false],
        [false, false]
    ];

    setPoint(x: number, y: number, value: boolean) {
        this.grid[y][x] = value;

        return this;
    }

    setBit(bit: SingleBits, value: boolean) {
        const indices: {
            [key in SingleBits]: [number, number];
        } = {
            0b00000001: [0, 0],
            0b00000010: [0, 1],
            0b00000100: [0, 2],
            0b00001000: [1, 0],
            0b00010000: [1, 1],
            0b00100000: [1, 2],
            0b01000000: [0, 3],
            0b10000000: [1, 3]
        };

        const [x, y] = indices[bit];

        return this.setPoint(x, y, value);
    }

    setUnicodeBit(bit: SingleBits, value: boolean) {
        const indices: {
            [key in SingleBits]: [number, number];
        } = {
            0b00000001: [0, 0],
            0b00000010: [0, 1],
            0b00000100: [0, 2],
            0b00001000: [0, 3],
            0b00010000: [1, 0],
            0b00100000: [1, 1],
            0b01000000: [1, 2],
            0b10000000: [1, 3]
        };

        const [x, y] = indices[bit];

        return this.setPoint(x, y, value);
    }

    xor(other: BrailleCharacter) {
        return this.xorGrid(other.grid);
    }

    xorGrid(grid: BrailleGrid) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 2; x++) {
                // console.log(x, y, this.grid[y][x], grid[y][x], this.grid[y][x] !== grid[y][x]);
                this.setPoint(x, y, this.grid[y][x] !== grid[y][x]);
            }
        }

        return this;
    }

    xorUnicodeStyleBinary(binary: number) {
        const grid: BrailleGrid = [
            [false, false],
            [false, false],
            [false, false],
            [false, false]
        ];

        grid[0][0] = ((binary >> 0) & 1) === 1;
        grid[1][0] = ((binary >> 1) & 1) === 1;
        grid[2][0] = ((binary >> 2) & 1) === 1;
        grid[0][1] = ((binary >> 3) & 1) === 1;
        grid[1][1] = ((binary >> 4) & 1) === 1;
        grid[2][1] = ((binary >> 5) & 1) === 1;
        grid[3][0] = ((binary >> 6) & 1) === 1;
        grid[3][1] = ((binary >> 7) & 1) === 1;

        return this.xorGrid(grid);
    }

    xorBinary(binary: number) {
        const grid: BrailleGrid = [
            [false, false],
            [false, false],
            [false, false],
            [false, false]
        ];

        grid[3][0] = ((binary >> 0) & 1) === 1;
        grid[3][1] = ((binary >> 1) & 1) === 1;
        grid[2][0] = ((binary >> 2) & 1) === 1;
        grid[2][1] = ((binary >> 3) & 1) === 1;
        grid[1][0] = ((binary >> 4) & 1) === 1;
        grid[1][1] = ((binary >> 5) & 1) === 1;
        grid[0][0] = ((binary >> 6) & 1) === 1;
        grid[0][1] = ((binary >> 7) & 1) === 1;

        return this.xorGrid(grid);
    }

    togglePoint(x: number, y: number) {
        this.setPoint(x, y, !this.grid[y][x]);

        return this;
    }

    getBinary() {
        let val = 0;

        // console.log(this.grid);

        val |= +this.grid[0][0] << 0;
        val |= +this.grid[1][0] << 1;
        val |= +this.grid[2][0] << 2;
        val |= +this.grid[0][1] << 3;
        val |= +this.grid[1][1] << 4;
        val |= +this.grid[2][1] << 5;
        val |= +this.grid[3][0] << 6;
        val |= +this.grid[3][1] << 7;

        return val;
    }

    getUnicode() {
        return 0x2800 + this.getBinary();
    }

    getChar() {
        return String.fromCharCode(this.getUnicode());
    }

    getGrid() {
        return this.grid;
    }

    setGrid(grid: BrailleGrid) {
        this.grid = grid;

        return this;
    }

    clone(): BrailleCharacter {
        const char = new BrailleCharacter();

        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 2; x++) {
                char.setPoint(x, y, this.grid[y][x]);
            }
        }

        return char;
    }

    getIndices() {
        const indices: Indices[0] = [];

        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 2; x++) {
                if (this.grid[y][x]) {
                    indices.push([x, y]);
                }
            }
        }

        return indices;
    }

    [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
        if (hint === 'string' || hint === 'default') {
            return this.getChar();
        }

        return this.getUnicode();
    }

    get [Symbol.toStringTag]() {
        return this.getChar();
    }

    toString() {
        return this.getChar();
    }

    static fromPercent(percent: number, style: BrailleStyle = 'cw') {
        const char = new BrailleCharacter();

        let indices: Indices;

        if (Array.isArray(style)) {
            indices = style;
        } else {
            indices = BrailleCharacter.mapStyle(style);
        }

        const filled = percent * indices.length;

        for (let i = 0; i < filled; i++) {
            // const [x, y] = indices[i];
            const chunk = indices[i];

            for (let j = 0; j < chunk.length; j++) {
                const [x, y] = chunk[j];

                char.togglePoint(x, y);
            }
        }

        return char;
    }

    static mapStyle(style: BrailleStyle): Indices {
        switch (style) {
            case 'cw':
            case 'clockwise': {
                return [
                    [[0, 3]],
                    [[0, 2]],
                    [[0, 1]],
                    [[0, 0]],
                    [[1, 0]],
                    [[1, 1]],
                    [[1, 2]],
                    [[1, 3]]
                ];
            }
            case 'ccw':
            case 'counter-clockwise': {
                return [
                    [[1, 3]],
                    [[1, 2]],
                    [[1, 1]],
                    [[1, 0]],
                    [[0, 0]],
                    [[0, 1]],
                    [[0, 2]],
                    [[0, 3]]
                ];
            }
            case 'fill-top-left': {
                return [
                    [[0, 0]],
                    [[1, 0]],
                    [[0, 1]],
                    [[1, 1]],
                    [[0, 2]],
                    [[1, 2]],
                    [[0, 3]],
                    [[1, 3]]
                ];
            }
            case 'fill-top-right': {
                return [
                    [[1, 0]],
                    [[0, 0]],
                    [[1, 1]],
                    [[0, 1]],
                    [[1, 2]],
                    [[0, 2]],
                    [[1, 3]],
                    [[0, 3]]
                ];
            }
            case 'fill-bottom-left': {
                return [
                    [[0, 3]],
                    [[1, 3]],
                    [[0, 2]],
                    [[1, 2]],
                    [[0, 1]],
                    [[1, 1]],
                    [[0, 0]],
                    [[1, 0]]
                ];
            }
            case 'fill-bottom-right': {
                return [
                    [[1, 3]],
                    [[0, 3]],
                    [[1, 2]],
                    [[0, 2]],
                    [[1, 1]],
                    [[0, 1]],
                    [[1, 0]],
                    [[0, 0]]
                ];
            }
            case 'fill-left-top': {
                return [
                    [[0, 0]],
                    [[0, 1]],
                    [[0, 2]],
                    [[0, 3]],
                    [[1, 0]],
                    [[1, 1]],
                    [[1, 2]],
                    [[1, 3]]
                ];
            }
            case 'fill-left-bottom': {
                return [
                    [[0, 3]],
                    [[0, 2]],
                    [[0, 1]],
                    [[0, 0]],
                    [[1, 3]],
                    [[1, 2]],
                    [[1, 1]],
                    [[1, 0]]
                ];
            }
            case 'fill-right-top': {
                return [
                    [[1, 0]],
                    [[1, 1]],
                    [[1, 2]],
                    [[1, 3]],
                    [[0, 0]],
                    [[0, 1]],
                    [[0, 2]],
                    [[0, 3]]
                ];
            }
            case 'fill-right-bottom': {
                return [
                    [[1, 3]],
                    [[1, 2]],
                    [[1, 1]],
                    [[1, 0]],
                    [[0, 3]],
                    [[0, 2]],
                    [[0, 1]],
                    [[0, 0]]
                ];
            }
            default: {
                throw new Error(`Unknown style: ${style}`);
            }
        }
    }

    static fromUnicodeStyleBinary(binary: number) {
        const char = new BrailleCharacter();

        char.xorUnicodeStyleBinary(binary);

        return char;
    }

    static fromBinary(binary: number) {
        const char = new BrailleCharacter();

        char.xorBinary(binary);

        return char;
    }

    static fromChar(char: string) {
        return BrailleCharacter.fromUnicodeStyleBinary(char.charCodeAt(0) - 0x2800);
    }

    static fromGrid(grid: BrailleGrid) {
        const char = new BrailleCharacter();

        char.xorGrid(grid);

        return char;
    }
}
