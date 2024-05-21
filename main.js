/*----------------------------------------------------------------------------------------------\
|  _____      _   __ _             _ _         ____   ___ ____  _    ______   ___ ____  _  _    |
| /__   \__ _(_) / _\ |_ _   _  __| (_) ___   |___ \ / _ \___ \/ |  / /___ \ / _ \___ \| || |   |
|   / /\/ _` | | \ \| __| | | |/ _` | |/ _ \    __) | | | |__) | | / /  __) | | | |__) | || |_  |
|  / / | (_| | | _\ \ |_| |_| | (_| | | (_) |  / __/| |_| / __/| |/ /  / __/| |_| / __/|__   _| |
|  \/   \__,_|_| \__/\__|\__,_|\__,_|_|\___/  |_____|\___/_____|_/_/  |_____|\___/_____|  |_|   |
|                                                                                               |
\----------------------------------------------------------------------------------------------*/
const fs = require('fs-extra');
const { createCanvas, loadImage } = require('canvas');

const inputFolder = './input';
const outputFolder = './output';

async function generateMapTiles(inputImagePath, outputFolder) {
    // Load the input image
    console.log(`Loading image: ${inputImagePath}`);
    const image = await loadImage(inputImagePath);
    const imageWidth = image.width;
    const imageHeight = image.height;

    // Create output folder if it doesn't exist
    await fs.ensureDir(outputFolder);

    for (let zoom = 0; zoom <= 18; zoom++) {
        const zoomFolder = `${outputFolder}/${zoom}`;
        await fs.ensureDir(zoomFolder);
        console.log(`Generating tiles for zoom level ${zoom}...`);

        const scaleFactor = Math.pow(2, zoom);

        for (let x = 0; x < scaleFactor; x++) {
            for (let y = 0; y < scaleFactor; y++) {
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
                const tilePath = `${zoomFolder}/${x}_${y}.png`;
                await fs.writeFile(tilePath, tileBuffer);
                console.log(`Generated tile ${x}_${y}.png for zoom level ${zoom}`);
            }
        }
    }

    console.log(`Map tiles generated for ${inputImagePath}`);
}

async function processInputFolder(inputFolder, outputFolder) {
    try {
        const files = await fs.readdir(inputFolder);

        for (const file of files) {
            const inputImagePath = `${inputFolder}/${file}`;
            const outputImageFolder = `${outputFolder}/${file.replace(/\.[^/.]+$/, '')}`;
            console.log(`Processing image: ${file}`);

            await generateMapTiles(inputImagePath, outputImageFolder);
        }
    } catch (err) {
        console.error('Error processing input folder:', err);
    }
}

// Start processing the input folder
console.log('Starting map tile generation...');
processInputFolder(inputFolder, outputFolder);
