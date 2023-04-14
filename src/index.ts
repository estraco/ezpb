import type { AxiosProgressEvent } from 'axios';
import { BrailleStyle, BrailleCharacter } from './braille';
import http from 'http';

export default class ProgressBar {
    max: number;
    value: number;
    name: string;

    refreshInterval: number;
    interval: NodeJS.Timeout;

    barLength: number;
    style: BrailleStyle;

    constructor(name: string, max: number, style: BrailleStyle = 'cw') {
        this.name = name;
        this.max = max;
        this.value = 0;

        this.style = style;

        process.stdout.on('resize', () => {
            this.barLength = this.getBarLength();
        });
    }

    update(value: number) {
        this.value = Math.min(value, this.max);

        if (this.value === this.max) {
            this.stop();
        }
    }

    private render() {
        process.stdout.cursorTo(0);
        process.stdout.write(this.getLine());
    }

    private getLine() {
        const bar = this.getBar();
        const percent = this.value / this.max;
        let percentString = (percent * 100).toFixed(2);

        if (percentString.length < 6) {
            if (!percentString.includes('.')) {
                percentString += '.00';
            } else {
                const beforeDecimal = percentString.split('.')[0];
                const afterDecimal = percentString.split('.')[1];

                if (afterDecimal.length === 1) {
                    percentString += '0';
                }

                if (beforeDecimal.length === 1) {
                    percentString = `  ${percentString}`;
                } else if (beforeDecimal.length === 2) {
                    percentString = ` ${percentString}`;
                }
            }
        }

        return `${this.name} ${bar} ${percentString}% ${' '.repeat(this.max.toString().length - this.value.toString().length)}(${this.value}/${this.max})`;
    }

    private getBarLength() {
        return process.stdout.columns - this.name.length - `  [] 100.00% (${this.max}/${this.max})`.length;
    }

    private getBar() {
        const percent = this.value / this.max;

        this.barLength ??= this.getBarLength();

        const filled = Math.floor(this.barLength * percent);
        let empty = this.barLength;

        empty -= filled;
        empty -= 1; // for the partial block

        const quantity = this.max / this.barLength;
        const completeQuantity = quantity * filled;
        const incompleteQuantity = this.value - completeQuantity;
        const incompletePercent = incompleteQuantity / quantity;

        return `[${BrailleCharacter.fromUnicodeStyleBinary(0b11111111).getChar().repeat(filled)}${percent === 1
            ? ''
            : BrailleCharacter.fromPercent(incompletePercent, this.style)}${percent === 1 // eslint-disable-next-line indent
                ? '' // eslint-disable-next-line indent
                : BrailleCharacter.fromUnicodeStyleBinary(0b00000000).getChar().repeat(empty)}]`;
    }

    axiosProgress() {
        let fetchedMax = false;

        return (progressEvent: AxiosProgressEvent) => {
            if (!fetchedMax) {
                this.max = progressEvent.total;
                this.barLength = this.getBarLength();

                fetchedMax = true;
            }

            this.update(progressEvent.loaded);
        };
    }

    httpProgress() {
        let fetchedMax = false;

        return (res: http.IncomingMessage) => {
            if (!fetchedMax) {
                this.max = Number(res.headers['content-length']);
                this.barLength = this.getBarLength();

                fetchedMax = true;
            }

            res.on('data', (chunk) => {
                this.update(this.value + chunk.length);
            });
        };
    }

    start(refreshInterval: number) {
        if (this.interval) {
            this.stop();
        }

        this.interval = setInterval(() => {
            this.render();
        }, refreshInterval);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;

            this.render();

            process.stdout.write('\n');
        }
    }
}

export * as Braille from './braille';
