import React, { useState, useEffect } from 'react';

import Toolbar from '../common/Toolbar';
import SelectionSort from './containers/SelectionSort';
import BubbleSort from './containers/BubbleSort';
import QuickSort from './containers/QuickSort';

const SortContainer = () => {

  const initialDataParams = {
    size: 50,
    min: -100,
    max: 100,
  };
  const initialSortParams = {
    type: 'selectionSort',
    interval: 5,
  }
  const initialDisplayParams = {
    chartMargins: true,
    dataMargins: 'true', // 'true', 'false', 'true disabled', 'false disabled'
    dataLabels: 'true', // 'true', 'false', 'true disabled', 'false disabled'
  };

  const [ data, updateData ] = useState([]);
  const [ dataParams, setDataParams ] = useState(initialDataParams);
  const [ sortParams, setSortParams ] = useState(initialSortParams);
  const [ displayParams, setDisplayParams ] = useState(initialDisplayParams);
  const [ hasStarted, start ] = useState(false);
  const [ hasFinished, finish ] = useState(false);

  useEffect(() => {
    if (hasFinished) {
      start(false);
    };
  }, [hasFinished]);

  useEffect(() => {
    generateData();
    if (dataParams.size > 400) {
      setDisplayParams({
        ...displayParams,
        chartMargins: false,
        dataMargins: `${displayParams.dataMargins.split(' ')[0]} disabled`,
        dataLabels: `${displayParams.dataLabels.split(' ')[0]} disabled`,
      });
    } else if (dataParams.size > 80) {
      setDisplayParams({
        ...displayParams,
        chartMargins: false,
        dataMargins: displayParams.dataMargins.includes('true') ? 'true' : 'false',
        dataLabels: `${displayParams.dataLabels.split(' ')[0]} disabled`,
      });
    } else if (dataParams.size > 50) {
      setDisplayParams({
        ...displayParams,
        chartMargins: false,
        dataMargins: displayParams.dataMargins.includes('true') ? 'true' : 'false',
        dataLabels: displayParams.dataLabels.includes('true') ? 'true' : 'false',
      });
    } else {
      setDisplayParams({
        ...displayParams,
        chartMargins: true,
        dataMargins: displayParams.dataMargins.includes('true') ? 'true' : 'false',
        dataLabels: displayParams.dataLabels.includes('true') ? 'true' : 'false',
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataParams]);

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

  const renderChart = () => {
    switch(sortParams.type) {
      case 'selectionSort':
        return <SelectionSort
          data={data}
          updateData={updateData}
          dataParams={dataParams}
          sortParams={sortParams}
          displayParams={displayParams}
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
          displayParams={displayParams}
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
          displayParams={displayParams}
          hasStarted={hasStarted}
          finish={finish}
        />
      default: return <div />
    };
  };

  const resetSettings = () => {
    updateData([]);
    setDataParams(initialDataParams);
    setSortParams(initialSortParams);
    setDisplayParams(initialDisplayParams);
    start(false);
    finish(false);
  };

  console.log(displayParams);

  return (
    <div className='moduleContainer'>
      <Toolbar
        title='Sorting Algorithms'
        box_1={
          [
            !hasStarted &&
              <p onClick={generateData}>Generate new data</p>,
            !hasStarted && data.length > 0 &&
              <p onClick={runAlgorithm} className='callToAction'>Sort!</p>,
            !hasStarted && data.length > 0 &&
              <div>
                <label>Algorithm:</label>
                <select value={sortParams.type} onChange={event => setSortParams({ ...sortParams, type: event.target.value })}>
                  <option value='selectionSort'>Selection sort</option>
                  <option value="bubbleSort">Bubble sort</option>
                  <option value="quickSort">Quick sort</option>
                </select>
              </div>,
          ]
        }
        box_2={
          [
            !hasStarted &&
              <div>
                <label>Array size: {dataParams.size}</label>
                <input
                  type='range'
                  max={1000}
                  min={2}
                  step={1}
                  value={dataParams.size}
                  onChange={event => setDataParams({ ...dataParams, size: parseInt(event.target.value) })}
                />
              </div>,
            !hasStarted && 
              <div>
                <label>Values min range: {dataParams.min}</label>
                <input
                  type='range'
                  min={-1000}
                  max={dataParams.max}
                  step={1}
                  value={dataParams.min}
                  onChange={event => setDataParams({ ...dataParams, min: parseInt(event.target.value) })}
                />
              </div>,
            !hasStarted && 
              <div>
                <label>Values max range: {dataParams.max}</label>
                <input
                  type='range'
                  min={dataParams.min}
                  max={1000}
                  step={1}
                  value={dataParams.max}
                  onChange={event => setDataParams({ ...dataParams, max: parseInt(event.target.value) })}
                />
              </div>,
            !hasStarted && data.length > 0 &&
              <div>
                <label>Step interval (ms): {sortParams.interval}</label>
                <input
                  type='range'
                  max={1000}
                  min={5}
                  step={5}
                  value={sortParams.interval}
                  onChange={event => setSortParams({ ...sortParams, interval: parseInt(event.target.value) })}
                />
              </div>,
            !hasStarted && data.length > 0 &&
              <div>
                <label>Show data labels:</label>
                <input
                  type='checkbox'
                  name={'dataLabels'}
                  checked={displayParams.dataLabels === 'true'}
                  onChange={event => setDisplayParams({ ...displayParams, dataLabels: event.target.checked ? 'true' : 'false' })}
                  disabled={displayParams.dataLabels.includes('disabled')}
                />
              </div>,
            !hasStarted && data.length > 0 &&
              <div>
                <label>Show data margins:</label>
                <input
                  type='checkbox'
                  name={'dataMargins'}
                  checked={displayParams.dataMargins === 'true'}
                  onChange={event => setDisplayParams({ ...displayParams, dataMargins: event.target.checked ? 'true' : 'false' })}
                  disabled={displayParams.dataMargins.includes('disabled')}
                />
              </div>,
            hasFinished && <p onClick={resetSettings}>Reset all</p>,
          ]
        }
      >
      </Toolbar>
      {renderChart()}
    </div>
  );
};

export default SortContainer;
