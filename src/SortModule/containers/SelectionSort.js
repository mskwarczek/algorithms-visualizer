import React, { useState, useEffect, useRef } from 'react';

import { colours } from '../helpers';
import Chart from '../components/Chart';

const SelectionSort = ({
  data,
  updateData,
  dataParams,
  sortParams,
  displayParams,
  hasStarted,
  hasFinished,
  finish,
}) => {

  const [ iteration, updateIteration ] = useState({ i: null, j: null });
  const min = useRef(null);

  useEffect(() => {
    if (hasStarted) {
      updateIteration({ i: 0, j: 1 });
    };
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      let intervalID = null;
      if (iteration.i < data.length) {
        intervalID = setTimeout(() => selectionSort(), sortParams.interval);
      } else {
        clearTimeout(intervalID);
        finish(true);
      };
      return () => clearTimeout(intervalID);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iteration]);

  useEffect(() => {
    if (hasFinished) {
      min.current = null;
      updateIteration({ i: null, j: null });
    };
  }, [hasFinished]);

  const selectionSort = () => {
    if (!min.current) {
      min.current = 0;
    };
    if (iteration.j < data.length) {
      if (data[iteration.j] < data[min.current]) {
        min.current = iteration.j;
      };
      return updateIteration(iteration => { return { i: iteration.i, j: iteration.j + 1 }})
    };
    if (min.current !== iteration.i) {
      let newData = [ ...data ];
      let temp = data[iteration.i];
      newData[iteration.i] = data[min.current];
      newData[min.current] = temp;
      updateData(newData);
    };
    min.current = iteration.i + 1;
    updateIteration(iteration => { return { i: iteration.i + 1, j: iteration.i + 2 }});
  };

  const generateDataBackgroundStyles = () => {
    return data.length > 0 && data.map((elem, index) => 
        index === iteration.i
      ? colours.pivot
      : index === iteration.j
      ? colours.current
      : index === min.current
      ? colours.active
      : index > iteration.i - 1
      ? colours.unsorted
      : colours.sorted
    );
  };

  return (
    <div className='workspace sortContainer'>
      <Chart
        data={data}
        dataParams={dataParams}
        displayParams={displayParams}
        dataBackground={{ type: 'backgroundColor', values: generateDataBackgroundStyles() }}
      />
    </div>
  );
};

export default SelectionSort;
