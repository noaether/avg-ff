const toHex = (dec) => {return dec.toString(16).padStart(2, '0')};
const toDec = (hex) => {return parseInt(hex, 16)};

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

function divideRangeIntoSections(min, max, avg) {

  /*
  * WHY IT WORKS
  * Considering a max number of sections = 15 sections, take x as 
  * above avg sections = x-1
  */

  const aboveAvgRange = max - avg;
  const belowAvgRange = avg - min;

  const hexArray = [0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF]

  return [hexArray.slice(0, Math.round(15 - Math.sqrt(belowAvgRange))), hexArray.slice(Math.round(1 - Math.sqrt(aboveAvgRange)))] ;
}

// Example usage:
const min = 84;
const max = 255;
const avg = 157;

const result = divideRangeIntoSections(min, max, avg);
console.log(result);

// 11, 255, 157
function stepGreater(steps, max, avg){
  let diff = max - avg;
  let step = diff / steps;
  return step;
};

function roundedDiffFromAvg_DEC(greaterStep, lesserStep, avg, startArray) {
  let diffArray = [];
  for(let i = 0; i < startArray.length; i++) {
    const n = startArray[i]
    const roundedDifference =
      (n > avg) ? diffArray.push(greaterStep * Math.round((startArray[i]-avg)/greaterStep)) :
      (n < avg) ? diffArray.push(lesserStep * Math.round((startArray[i]-avg)/lesserStep)) :
                  diffArray.push(0);
  }
  return diffArray;
}


const startArray = [255, 212, 212, 161, 161, 120, 120, 84, 84];
const endArray = [255, 212, 212, 157, 157, 121, 121, 85, 85];

//console.log(computeLostDiff(startArray, endArray));
console.log(roundedDiffFromAvg_DEC(11, 12, 157, startArray))
