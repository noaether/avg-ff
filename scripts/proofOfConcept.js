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
 * @returns {Array} An array containing the sections for the "below average" range, the number of values covered by each section in the "below average" range, the sections for the "above average" range, and the number of values covered by each section in the "above average" range.
 */
function divideRangeIntoSections(min, max, avg) {

  /*
  * WHY IT WORKS
  * Considering a max number of sections = 15 sections, take x as
  * above avg sections = x - 1
  * below avg sections = 15 - x
  * a = (Δ_MaxAvg)÷(1-x) => if there are '1-x' sections, each section will cover 'a' numbers
  * b = (Δ_AvgMin)÷(15-x) => if there are '15-x' sections, each section will cover 'b' numbers
  *
  * therefore
  *
  * (x-1)(Δ_MaxAvg)÷(x-1)
  *   => (x-1)^2 = (Δ_MaxAvg)
  *   => x = -sqrt(Δ_MaxAvg)+1
  *   => x = 1 - sqrt(Δ_MaxAvg)  => starting from the end, there are x sections for the "above average" range
  *   => y = (Δ_MaxAvg)÷(1-x)    => each section covers y numbers
  * (15-x) = (Δ_AvgMin)÷(15-x)
  *   => (15-x)^2 = (Δ_AvgMin)
  *   => x = -sqrt(Δ_AvgMin)+15
  *   => x = 15 - sqrt(Δ_AvgMin) => starting from the beginning, there are x sections for the "below average" range
  *   => y = (Δ_AvgMin)÷(15-x)   => each section covers y numbers
  */

  const deltaMaxAvg = max - avg;
  const deltaAvgMin = avg - min;

  const hexArray = [0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF]
  const minRangeArray = hexArray.slice(0, Math.round(15 - Math.sqrt(deltaAvgMin)));
  const maxRangeArray = hexArray.slice(Math.round(1 - Math.sqrt(deltaMaxAvg)));

  return [minRangeArray, Math.round(deltaAvgMin/minRangeArray.length), maxRangeArray, Math.round(deltaMaxAvg/maxRangeArray.length)] ;
}


/**
 * Calculates the rounded difference from the average for each element in the given array.
 * @param {number} greaterStep - The step value used for numbers greater than the average.
 * @param {number} lesserStep - The step value used for numbers less than the average.
 * @param {number} avg - The average value.
 * @param {number[]} startArray - The array of numbers to calculate the difference from the average.
 * @returns {number[]} - The array of rounded differences from the average.
 */
function roundedDiffFromAvg_DEC(greaterStep, lesserStep, avg, startArray) {
  let diffArrayDEC = [];
  for(let i = 0; i < startArray.length; i++) {
    const n = startArray[i];
    (n > avg) ? diffArrayDEC.push(greaterStep * Math.round((startArray[i]-avg)/greaterStep)) :
    (n < avg) ? diffArrayDEC.push(lesserStep * Math.round((startArray[i]-avg)/lesserStep)) :
                diffArrayDEC.push(0);
  }
  return diffArrayDEC;
}

function diffDEC_to_diffHEX(belowRangeSymbols, aboveRangeSymbols, diffArrayDEC) {
  let diffArrayHEX = [];
  for(let i = 0; i < diffArrayDEC.length; i++) {
    const n = diffArrayDEC[i];
    (n > 0) ? diffArrayHEX.push(aboveRangeSymbols[n]) :
    (n < 0) ? diffArrayHEX.push(belowRangeSymbols[n]) :
              diffArrayHEX.push(0);
  }
  return diffArrayHEX;
}


const startArray = [255, 212, 212, 161, 161, 120, 120, 84, 84];
const endArray = [255, 212, 212, 157, 157, 121, 121, 85, 85];

const divideRangeIntoSections_RESULTS = divideRangeIntoSections(getMin(startArray), getMax(startArray), getAvg(startArray));

console.log(roundedDiffFromAvg_DEC(11, 12, 157, startArray))
console.log(divideRangeIntoSections_RESULTS);
console.log(computeLostDiff(startArray, endArray));

