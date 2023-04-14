export type BrailleGrid = [
    [boolean, boolean],
    [boolean, boolean],
    [boolean, boolean],
    [boolean, boolean]
];

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
export type BrailleStyle = 'ccw' | 'cw' | `${'counter-' | ''}clockwise` | `fill-${`top-${'left' | 'right'}` | `bottom-${'left' | 'right'}` | `left-${'top' | 'bottom'}` | `right-${'top' | 'bottom'}`}`;
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
    num = 0;
    grid: BrailleGrid = [
        [false, false],
        [false, false],
        [false, false],
        [false, false]
    ];

    setPoint(x: number, y: number, value: boolean) {
        this.grid[x][y] = value;

        return this;
    }

    setBit(bit: number, value: boolean) {
        const indices = [
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 0],
            [3, 1]
        ];

        const [x, y] = indices[bit];

        return this.setPoint(x, y, value);
    }

    xor(other: BrailleCharacter) {
        return this.xorGrid(other.grid);
    }

    xorGrid(grid: BrailleGrid) {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 2; y++) {
                this.setPoint(x, y, this.grid[x][y] !== grid[x][y]);
            }
        }

        return this;
    }

    xorBinary(binary: number) {
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

    togglePoint(x: number, y: number) {
        this.setPoint(x, y, !this.grid[x][y]);

        return this;
    }

    getBinary() {
        let val = 0x2800;

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

    getChar() {
        return String.fromCharCode(this.getBinary());
    }

    [Symbol.toPrimitive](hint: 'string' | 'number') {
        if (hint === 'string') {
            return this.getChar();
        }

        return this.getBinary();
    }

    [Symbol.toStringTag]() {
        return 'BrailleCharacter';
    }

    toString() {
        return this.getChar();
    }

    static fromPercent(percent: number, style: BrailleStyle = 'cw') {
        const char = new BrailleCharacter();

        let indices: [number, number][];

        switch (style) {
            case 'cw':
            case 'clockwise': {
                indices = [
                    [3, 0],
                    [2, 0],
                    [1, 0],
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1]
                ];

                break;
            }
            case 'ccw':
            case 'counter-clockwise': {
                indices = [
                    [3, 1],
                    [2, 1],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                    [1, 0],
                    [2, 0],
                    [3, 0]
                ];

                break;
            }
            case 'fill-top-left': {
                indices = [
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1],
                    [2, 0],
                    [2, 1],
                    [3, 0],
                    [3, 1]
                ];

                break;
            }
            case 'fill-top-right': {
                indices = [
                    [0, 1],
                    [0, 0],
                    [1, 1],
                    [1, 0],
                    [2, 1],
                    [2, 0],
                    [3, 1],
                    [3, 0]
                ];

                break;
            }
            case 'fill-bottom-left': {
                indices = [
                    [3, 0],
                    [3, 1],
                    [2, 0],
                    [2, 1],
                    [1, 0],
                    [1, 1],
                    [0, 0],
                    [0, 1]
                ];

                break;
            }
            case 'fill-bottom-right': {
                indices = [
                    [3, 1],
                    [3, 0],
                    [2, 1],
                    [2, 0],
                    [1, 1],
                    [1, 0],
                    [0, 1],
                    [0, 0]
                ];

                break;
            }
            case 'fill-left-top': {
                indices = [
                    [0, 0],
                    [1, 0],
                    [2, 0],
                    [3, 0],
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1]
                ];

                break;
            }
            case 'fill-left-bottom': {
                indices = [
                    [3, 0],
                    [2, 0],
                    [1, 0],
                    [0, 0],
                    [3, 1],
                    [2, 1],
                    [1, 1],
                    [0, 1]
                ];

                break;
            }
            case 'fill-right-top': {
                indices = [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1],
                    [0, 0],
                    [1, 0],
                    [2, 0],
                    [3, 0]
                ];

                break;
            }
            case 'fill-right-bottom': {
                indices = [
                    [3, 1],
                    [2, 1],
                    [1, 1],
                    [0, 1],
                    [3, 0],
                    [2, 0],
                    [1, 0],
                    [0, 0]
                ];

                break;
            }
            default: {
                throw new Error(`Unknown style: ${style}`);
            }
        }

        const filled = Math.round(percent * 8);

        for (let i = 0; i < filled; i++) {
            const [x, y] = indices[i];

            char.setPoint(x, y, true);
        }

        return char;
    }

    static fromBinary(binary: number) {
        const char = new BrailleCharacter();

        char.xorBinary(binary);

        return char;
    }

    static fromChar(char: string) {
        return BrailleCharacter.fromBinary(char.charCodeAt(0) - 0x2800);
    }

    static fromGrid(grid: BrailleGrid) {
        const char = new BrailleCharacter();

        char.xorGrid(grid);

        return char;
    }
}
