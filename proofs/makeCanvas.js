const fs = require('fs');

function generateSVG(grayscaleColors) {
    if (grayscaleColors.length !== 16) {
        throw new Error('There must be exactly 16 grayscale colors.');
    }

    const width = 1024;
    const height = 16;
    const squareWidth = width / 16;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    for (let i = 0; i < 16; i++) {
        svg += `<rect x="${i * squareWidth}" y="0" width="${squareWidth}" height="${height}" fill="${grayscaleColors[i]}" />`;
    }

    svg += '</svg>';

    return svg;
}

function writeSVGToHTMLFile(svg, filename) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grayscale Image</title>
</head>
<body>
    ${svg}
</body>
</html>`;

    fs.writeFileSync(filename, htmlContent, 'utf8');
}

function writeSVGSToHTMLFile(array) {
    let svgStr = '';
    for (let i = 0; i < array.length; i++) {
        svgStr += array[i];
        svgStr += '\n';
    }
    writeSVGToHTMLFile(svgStr, 'grayscale.html');
}

module.exports = {
    generateSVG,
    writeSVGToHTMLFile,
    writeSVGSToHTMLFile
};
