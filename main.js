/*----------------------------------------------------------------------------------------------\
|  _____      _   __ _             _ _         ____   ___ ____  _    ______   ___ ____  _  _    |
| /__   \__ _(_) / _\ |_ _   _  __| (_) ___   |___ \ / _ \___ \/ |  / /___ \ / _ \___ \| || |   |
|   / /\/ _` | | \ \| __| | | |/ _` | |/ _ \    __) | | | |__) | | / /  __) | | | |__) | || |_  |
|  / / | (_| | | _\ \ |_| |_| | (_| | | (_) |  / __/| |_| / __/| |/ /  / __/| |_| / __/|__   _| |
|  \/   \__,_|_| \__/\__|\__,_|\__,_|_|\___/  |_____|\___/_____|_/_/  |_____|\___/_____|  |_|   |
|                                                                                               |
\----------------------------------------------------------------------------------------------*/
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs-extra');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const inputFolder = core.getInput('input_dir') || './input';
const outputFolder = core.getInput('output_dir') || './output';
const logFilePath = path.join(outputFolder, 'progress.log');

async function loadProgress() {
    try {
        const data = await fs.readFile(logFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function saveProgress(progress) {
    await fs.writeFile(logFilePath, JSON.stringify(progress, null, 2), 'utf8');
}

async function generateMapTiles(inputImagePath, outputFolder, progress) {
    // Load the input image
    console.log(`Loading image: ${inputImagePath}`);
    const image = await loadImage(inputImagePath);
    const imageWidth = image.width;
    const imageHeight = image.height;

    // Create output folder if it doesn't exist
    await fs.ensureDir(outputFolder);

    for (let zoom = 0; zoom <= 18; zoom++) {
        if (progress[inputImagePath] && progress[inputImagePath].zoom > zoom) continue;
        
        const zoomFolder = `${outputFolder}/${zoom}`;
        await fs.ensureDir(zoomFolder);
        console.log(`Generating tiles for zoom level ${zoom}...`);

        const scaleFactor = Math.pow(2, zoom);

        for (let x = 0; x < scaleFactor; x++) {
            for (let y = 0; y < scaleFactor; y++) {
                if (progress[inputImagePath] && progress[inputImagePath].zoom === zoom && (progress[inputImagePath].x > x || (progress[inputImagePath].x === x && progress[inputImagePath].y > y))) continue;

                const tileCanvas = createCanvas(256, 256);
                const tileCtx = tileCanvas.getContext('2d');

                tileCtx.drawImage(
                    image,
                    Math.floor(x * imageWidth / scaleFactor),
                    Math.floor(y * imageHeight / scaleFactor),
                    Math.floor(imageWidth / scaleFactor),
                    Math.floor(imageHeight / scaleFactor),
                    0,
                    0,
                    256,
                    256
                );

                const tileBuffer = tileCanvas.toBuffer('image/png');
                await fs.ensureDir(`${zoomFolder}/${x}`);
                const tilePath = `${zoomFolder}/${x}/${x}_${y}.png`;
                await fs.writeFile(tilePath, tileBuffer);
                console.log(`Generated tile ${x}_${y}.png for zoom level ${zoom}`);

                progress[inputImagePath] = { zoom, x, y };
                await saveProgress(progress);
            }
        }
    }

    console.log(`Map tiles generated for ${inputImagePath}`);
    delete progress[inputImagePath];
    await saveProgress(progress);
}

async function processInputFolder(inputFolder, outputFolder) {
    try {
        const progress = await loadProgress();
        const files = await fs.readdir(inputFolder);

        for (const file of files) {
            const inputImagePath = `${inputFolder}/${file}`;
            const outputImageFolder = `${outputFolder}/${file.replace(/\.[^/.]+$/, '')}`;
            console.log(`Processing image: ${file}`);

            await generateMapTiles(inputImagePath, outputImageFolder, progress);
        }
    } catch (err) {
        console.error('Error processing input folder:', err);
    }
}

// Start processing the input folder
console.log('Starting map tile generation...');
processInputFolder(inputFolder, outputFolder);
