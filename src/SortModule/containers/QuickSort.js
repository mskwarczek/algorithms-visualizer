import React, { useState, useEffect } from 'react';

import Chart from '../components/Chart';

const QuickSort = ({
  data,
  updateData,
  dataParams,
  sortParams,
  displayParams,
  hasStarted,
  finish,
}) => {

  const [ states, updateStates ] = useState([]);

  useEffect(() => {
    if (hasStarted) {
      const initialStates = data.map(elem => -1)
      updateStates(initialStates);
      quickSort(data, 0, data.length - 1);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted])

  const step = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const swap = async (array, leftIndex, rightIndex) => {
    const temp = array[leftIndex];
    array[leftIndex] = array[rightIndex];
    array[rightIndex] = temp;
    let copyData = [ ...data ];
    let arrayData = array.slice(leftIndex, rightIndex + 1);
    copyData.splice(leftIndex, rightIndex - leftIndex + 1, ...arrayData);
    updateData(copyData);
    await step(sortParams.interval);
  };

  const partition = async (array, leftIndex, rightIndex) => {
    let pivotIndex = leftIndex;
    let pivotValue = array[rightIndex];
    updateStates(states => states.map((elem, index) => index === pivotIndex ? 0 : index === rightIndex ? 3 : elem));
    await step(sortParams.interval);
    for (let i = leftIndex; i < rightIndex; i++) {
      if (array[i] < pivotValue) {
        if (i !== pivotIndex) {
          updateStates(states => states.map((elem, index) => index === i ? 2 : elem));
          await step(sortParams.interval);
        };
        await swap(array, i, pivotIndex);
        pivotIndex++;
        // eslint-disable-next-line no-loop-func
        updateStates(states => states.map((elem, index) => index === pivotIndex ? 0 : index === pivotIndex - 1 ? -1 : elem));
        await step(sortParams.interval);
      } else if (i !== pivotIndex) {
        updateStates(states => states.map((elem, index) => index === i ? 1 : elem));
        await step(sortParams.interval);
      };
      if (i !== pivotIndex) {
        updateStates(states => states.map((elem, index) => index === i && elem === 2 ? 1 : elem));
      };
    };
    updateStates(states => states.map((elem, index) => index === rightIndex ? 2 : elem));
    await step(sortParams.interval);
    await swap(array, pivotIndex, rightIndex);
    updateStates(states => states.map((elem, index) => (index === pivotIndex || index === rightIndex) ? -1 : (index > pivotIndex && index < rightIndex) ? -1 : elem));
    return pivotIndex;
  };

  const quickSort = async (array, left, right, recursions = 1) => {
    if (left >= right) {
      updateStates(states => states.map((elem, index) => index === right ? 1 : elem));
      await step(sortParams.interval);
      updateStates(states => states.map((elem, index) => index === right ? 4 : elem));
      await step(sortParams.interval);
      recursions--;
      return;
    };
    let pivot = await partition(array, left, right);
    updateStates(states => states.map((elem, index) => index === pivot ? 4 : elem));
    await step(sortParams.interval);
    recursions++;
    await Promise.all([
      quickSort(array, left, pivot - 1, recursions),
      quickSort(array, pivot + 1, right, recursions),
    ]);
    recursions--;
    if (recursions <= 1) {
      finish(true);
    };
    return array;
  };

  const generateDataBackgroundStyles = () => {
    return data.length > 0 && data.map((elem, index) => 
        hasStarted && states[index] === 0 && states[index + 1] === 1
      ? 'linear-gradient(to right, red, gray)'
      : hasStarted && states[index] === 0 && states[index + 1] === 2
      ? 'linear-gradient(to right, red, blue)'
      : hasStarted && states[index] === 0
      ? 'linear-gradient(to right, red, lightgray)'
      : hasStarted && states[index] === 1
      ? 'linear-gradient(gray, gray)'
      : hasStarted && states[index] === 2
      ? 'linear-gradient(blue, blue)'
      : hasStarted && states[index] === 3 && states[index - 1] === 1
      ? 'linear-gradient(to left, red, gray)'
      : hasStarted && states[index] === 3 && states[index - 1] === 2
      ? 'linear-gradient(to left, red, blue)'
      : hasStarted && states[index] === 3
      ? 'linear-gradient(to left, red, lightgray)'
      : hasStarted && states[index] === 4
      ? 'linear-gradient(lightblue, lightblue)'
      : 'linear-gradient(lightgray, lightgray)'
    );
  };

  return (
    <div className='sortContainer'>
      <Chart
        data={data}
        dataParams={dataParams}
        displayParams={displayParams}
        dataBackground={{ type: 'backgroundImage', values: generateDataBackgroundStyles() }}
      />
    </div>
  );
};

export default QuickSort;
