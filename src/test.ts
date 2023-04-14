import ProgressBar from '.';
import axios from 'axios';
import http from 'http';
import https from 'https';

function testAxios() {
    const url = 'http://ipv4.download.thinkbroadband.com/100MB.zip';

    const bar = new ProgressBar('100MB.zip', 1, 'fill-left-bottom');

    bar.start(15);

    return axios.get(url, {
        onDownloadProgress: bar.axiosProgress()
    });
}

function testHttp() {
    const url = 'http://ipv4.download.thinkbroadband.com/100MB.zip';

    const bar = new ProgressBar('100MB.zip', 1, 'fill-left-bottom');

    bar.start(15);

    return new Promise<void>((resolve) => {
        http.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
            }
        }, (res) => {
            bar.httpProgress()(res);

            res.on('end', () => {
                resolve();
            });
        });
    });
}

function testHttps() {
    const url = 'https://speed.hetzner.de/100MB.bin';

    const bar = new ProgressBar('100MB.zip', 1, 'fill-left-bottom');

    bar.start(15);

    return new Promise<void>((resolve) => {
        https.get(url, (res) => {
            bar.httpProgress()(res);

            res.on('end', () => {
                resolve();
            });
        });
    });
}

async function main() {
    console.log('Testing axios');
    await testAxios();

    console.log('Testing http');
    await testHttp();

    console.log('Testing https');
    await testHttps();
}

main();
