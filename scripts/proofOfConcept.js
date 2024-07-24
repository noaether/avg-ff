let { generateSVG, writeSVGToHTMLFile, writeSVGSToHTMLFile } = require('./makeCanvas.js');

const toHex = (dec) => {return dec.toString(16).padStart(2, '0')};
const toDec = (hex) => {return parseInt(hex, 16)};
const getMax = (array) => {return Math.max(...array)};
const getAvg = (array) => {return array.reduce((a, b) => a + b) / array.length};
const getMin = (array) => {return Math.min(...array)};

/**
 * Computes the difference between corresponding elements of two arrays.
 * @param {number[]} startArray - The starting array.
 * @param {number[]} endArray - The ending array.
 * @returns {number[]} - The array containing the differences between corresponding elements.
 */
function computeLostDiff(startArray, endArray) {
  let finalArray = [];
  for (let i = 0; i < startArray.length; i++) {
    const startValue = startArray[i];
    const endValue = endArray[i];
    const diff = endValue - startValue;
    finalArray.push(diff);
  }
  return finalArray;
}

/**
 * Divides a range into sections based on the given minimum, maximum, and average values.
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {number} avg - The average value of the range.
 * @returns {Map} An array containing the sections for the "below average" range, the number of values covered by each section in the "below average" range, the sections for the "above average" range, and the number of values covered by each section in the "above average" range.
 */
function divideRangeIntoSections(min, max, avg) {
  const deltaMaxAvg = max - avg;
  const deltaAvgMin = avg - min;

  const nAboveSections = Math.round((15*deltaMaxAvg)/(deltaMaxAvg + deltaAvgMin));
  const nBelowSections = 15 - nAboveSections;

  const hexArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  const minRangeArray = hexArray.slice(0, nBelowSections);
  const maxRangeArray = hexArray.slice(0 - nAboveSections);

  const returnMap = new Map();

  returnMap.set("belowRangeSymbols", minRangeArray);
  returnMap.set("belowRangeStep", Math.round(deltaAvgMin/minRangeArray.length));
  returnMap.set("aboveRangeSymbols", maxRangeArray);
  returnMap.set("aboveRangeStep", Math.round(deltaMaxAvg/maxRangeArray.length));

  return returnMap;
}


/**
 * Calculates the rounded difference from the average for each element in the given array.
 * @param {number} belowRangeStep - The step value used for numbers less than the average.
 * @param {number} aboveRangeStep - The step value used for numbers greater than the average.
 * @param {number} avg - The average value.
 * @param {number[]} startArray - The array of numbers to calculate the difference from the average.
 * @returns {number[]} - The array of rounded differences from the average.
 */
function roundedDiffFromAvg_DEC(belowRangeStep, aboveRangeStep, avg, startArray) {
  let diffArrayDEC = [];
  for(let i = 0; i < startArray.length; i++) {
    const n = startArray[i];
    (n < avg) ? diffArrayDEC.push(belowRangeStep * Math.round((startArray[i]-avg)/belowRangeStep)) :
    (n > avg) ? diffArrayDEC.push(aboveRangeStep * Math.round((startArray[i]-avg)/aboveRangeStep)) :
                diffArrayDEC.push(0);
  }
  return diffArrayDEC;
}

/**
 * Converts the decimal difference array to hexadecimal.
 * @param {string[]} belowRangeSymbols - The symbols used for numbers less than the average.
 * @param {string[]} aboveRangeSymbols - The symbols used for numbers greater than the average.
 * @param {number[]} diffArrayDEC - The array of differences from the average in decimal.
 * @returns {string[]} - The array of differences from the average in hexadecimal.
 */
function diffDEC_to_diffHEX(belowRangeSymbols, belowRangeStep, aboveRangeSymbols, aboveRangeStep, diffArrayDEC) {
  let diffArrayHEX = [];
  for(let i = 0; i < diffArrayDEC.length; i++) {
    const n = diffArrayDEC[i];
    (n > 0) ? diffArrayHEX.push(aboveRangeSymbols[(n-aboveRangeStep)/aboveRangeStep]) :
    (n < 0) ? diffArrayHEX.push(belowRangeSymbols[belowRangeSymbols.length + (n/belowRangeStep)]) :
              diffArrayHEX.push(0);
  }
  return diffArrayHEX;
}

function diffToFinal(avg, min, max, diffArrayDEC) {
  let finalArray = [];
  for(let i = 0; i < diffArrayDEC.length; i++) {
    const n = diffArrayDEC[i];
    finalArray.push(
      (avg + n > max) ? max :
      (avg + n < min) ? min :
                        avg + n
    );
  }
  return finalArray;
}

function calculateRelativeError(startArray, finalArray) {
  let error = 0;
  for (let i = 0; i < startArray.length; i++) {
    startArray[i] === 0 ? error += Math.abs((startArray[i-1] - finalArray[i-1])/startArray[i-1]) * 100 :
    error += Math.abs((startArray[i] - finalArray[i])/startArray[i]) * 100;
  }
  return (error/startArray.length);
}

function startToFinish(startArray) {
  const max = getMax(startArray);
  const avg = Math.round(getAvg(startArray));
  const min = getMin(startArray);

  const dRIS = divideRangeIntoSections(min, max, avg);
  const diffArrayDEC = roundedDiffFromAvg_DEC(dRIS.get('belowRangeStep'), dRIS.get('aboveRangeStep'), avg, startArray);
  //const diffArrayHEX = diffDEC_to_diffHEX(dRIS.get('belowRangeSymbols'), dRIS.get('belowRangeStep'), dRIS.get('aboveRangeSymbols'), dRIS.get('aboveRangeStep'), diffArrayDEC);
  const finalArray = diffToFinal(avg, min, max, diffArrayDEC);

  return finalArray;
}


function runSimulation(maxRuns, width, range, bool_writeToSVG) {
  let svgArray = [];
  let relativeErrorTotal = 0;

  for(let i = 0; i < maxRuns; i++) {
    const startArray = Array.from({length: width}, () => Math.floor(Math.random() * range));
    const finalArray = startToFinish(startArray);

    bool_writeToSVG ? svgArray.push(generateSVG(startArray.map((n) => `#${toHex(n)}${toHex(n)}${toHex(n)}`))) : null;
    bool_writeToSVG ? svgArray.push(generateSVG(finalArray.map((n) => `#${toHex(n)}${toHex(n)}${toHex(n)}`))) : null;

    relativeErrorTotal += parseInt(calculateRelativeError(startArray, finalArray));

    //console.log(startArray);
    //console.log(computeLostDiff(startArray, finalArray));
    //console.log(finalArray)
  }

  bool_writeToSVG ? writeSVGSToHTMLFile(svgArray) : null;

  return relativeErrorTotal/maxRuns;
}

function testRelativeError() {
  let relativeErrorArray = [];
  for(let i = 0; i < 4096; i++) {
    const relativeError = runSimulation(64, 64, i, false);
    console.log(relativeError)
  }
}

testRelativeError();


const startArray = [0xFF, 0xD4, 0xA1, 0x78, 0x54, 0x30, 0x00, 0x30, 0x54, 0x78, 0xA1, 0xFF, 0xA1, 0x78, 0x54, 0x30]
const finalArray = startToFinish(startArray);

