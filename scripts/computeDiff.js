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
