import React, { useState, useEffect } from 'react';

import { colours } from '../helpers';
import Chart from '../components/Chart';

const BubbleSort = ({
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

  useEffect(() => {
    if (hasStarted) {
      updateIteration({ i: data.length - 1, j: 0 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      let intervalID = null;
      if (iteration.i > 0) {
        intervalID = setTimeout(() => bubbleSort(), sortParams.interval);
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
      updateIteration({ i: null, j: null });
    };
  }, [hasFinished]);

  const bubbleSort = () => {
    if (iteration.j < iteration.i) {
      if (data[iteration.j] > data[iteration.j + 1]) {
        let newData = [ ...data ];
        let temp = data[iteration.j + 1];
        newData[iteration.j + 1] = data[iteration.j];
        newData[iteration.j] = temp;
        updateData(newData);
      };
      if (iteration.j < iteration.i - 1) {
        return updateIteration(iteration => { return { i: iteration.i, j: iteration.j + 1 }});
      };
    };
    updateIteration(iteration => { return { i: iteration.i - 1, j: 0 }});
  };

  const generateDataBackgroundStyles = () => {
    return data.length > 0 && data.map((elem, index) => 
        iteration.i !== null && index === iteration.i
      ? colours.pivot
      : iteration.j !== null  && (index === iteration.j || index === iteration.j + 1) && data[iteration.j] > data[iteration.j + 1]
      ? colours.active
      : iteration.j !== null  && (index === iteration.j || index === iteration.j + 1)
      ? colours.current
      : iteration.i !== null  && index > iteration.i
      ? colours.sorted
      : colours.unsorted
    );
  };

  return (
    <div className='sortContainer'>
      <Chart
        data={data}
        dataParams={dataParams}
        displayParams={displayParams}
        dataBackground={{ type: 'backgroundColor', values: generateDataBackgroundStyles() }}
      />
    </div>
  );
};

export default BubbleSort;
