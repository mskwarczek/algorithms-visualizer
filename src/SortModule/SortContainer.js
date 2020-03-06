import React, { useState, useEffect } from 'react';

import Toolbar from '../common/Toolbar';
import SelectionSort from './containers/SelectionSort';
import BubbleSort from './containers/BubbleSort';
import QuickSort from './containers/QuickSort';

const SortContainer = () => {

  const [ data, updateData ] = useState([]);
  const [ dataParams, setDataParams ] = useState({ size: 30, min: -100, max: 100 });
  const [ sortParams, setSortParams ] = useState({ type: 'selectionSort' });
  const [ hasStarted, start ] = useState(false);
  const [ hasFinished, finish ] = useState(false);

  useEffect(() => {
    if (hasFinished) {
      start(false);
    };
  }, [hasFinished])

  const generateData = () => {
    let newData = [];
    for (let i = 0; i < dataParams.size; i++) {
      newData.push(Math.floor(Math.random() * (dataParams.max - dataParams.min + 1)) + dataParams.min);
    };
    updateData(newData);
  };

  const runAlgorithm = () => {
    finish(false);
    start(true);
  };

  const resetChart = () => {
    updateData([]);
    start(false);
    finish(false);
  };

  const renderChart = () => {
    switch(sortParams.type) {
      case 'selectionSort':
        return <SelectionSort
          data={data}
          updateData={updateData}
          dataParams={dataParams}
          sortParams={sortParams}
          hasStarted={hasStarted}
          hasFinished={hasFinished}
          finish={finish}
        />
      case 'bubbleSort':
        return <BubbleSort
          data={data}
          updateData={updateData}
          dataParams={dataParams}
          sortParams={sortParams}
          hasStarted={hasStarted}
          hasFinished={hasFinished}
          finish={finish}
        />
      case 'quickSort':
        return <QuickSort
          data={data}
          updateData={updateData}
          dataParams={dataParams}
          sortParams={sortParams}
          hasStarted={hasStarted}
          finish={finish}
        />
      default: return <div />
    };
  };

  return (
    <div className='moduleContainer'>
      <Toolbar
        title='Sorting Algorithms'
      >
        {!hasStarted && <p onClick={generateData}>Generate random data</p>}
        {!hasStarted && data.length > 0 && <p onClick={runAlgorithm}>Sort!</p>}
        <select value={sortParams.type} onChange={(event) => setSortParams({ ...sortParams, type: event.target.value })}>
          <option value='selectionSort'>Selection sort</option>
          <option value="bubbleSort">Bubble sort</option>
          <option value="quickSort">Quick sort</option>
        </select>
        {hasFinished && <p onClick={resetChart}>Reset chart</p>}
      </Toolbar>
      {renderChart()}
    </div>
  );
};

export default SortContainer;
