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
    type: 'Quick Sort',
    interval: 5,
    speed: 'fast',
  };
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
    } else if (dataParams.size > 50) {
      setDisplayParams({
        ...displayParams,
        chartMargins: false,
        dataMargins: displayParams.dataMargins.includes('true') ? 'true' : 'false',
        dataLabels: `${displayParams.dataLabels.split(' ')[0]} disabled`,
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
      case 'Selection Sort':
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
      case 'Bubble Sort':
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
      case 'Quick Sort':
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

  return (
    <div className='moduleContainer'>
      <Toolbar>
        <div
          id='sort_algorithm'
          type='select'
          button={<p>Algorithm:</p>}
          active={sortParams.type}
          disabled={hasStarted}>
          <div
            className={sortParams.type === 'Selection Sort' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setSortParams({ ...sortParams, type: 'Selection Sort'}) : null}>
            <p>Selection Sort</p>
          </div>
          <div
            className={sortParams.type === 'Bubble Sort' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setSortParams({ ...sortParams, type: 'Bubble Sort'}) : null}>
            <p>Bubble Sort</p>
          </div>
          <div
            className={sortParams.type === 'Quick Sort' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setSortParams({ ...sortParams, type: 'Quick Sort'}) : null}>
            <p>Quick Sort</p>
          </div>
        </div>
        <div
          id='sort__speed'
          type='select'
          button={<p>Speed:</p>}
          active={sortParams.speed}
          disabled={hasStarted}>
          <div
            className={sortParams.interval === 200 ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setSortParams({ ...sortParams, interval: 200, speed: 'slow'}) : null}>
            <p>Slow</p>
          </div>
          <div
            className={sortParams.interval === 25 ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setSortParams({ ...sortParams, interval: 25, speed: 'average'}) : null}>
            <p>Average</p>
          </div>
          <div
            className={sortParams.interval === 5 ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setSortParams({ ...sortParams, interval: 5, speed: 'fast'}) : null}>
            <p>Fast</p>
          </div>
        </div>
        <div
          id='sort__start'
          type='button'
          button={
            !hasStarted
              ? <p onClick={runAlgorithm}>Sort!</p>
              : <p onClick={() => window.location.reload()}>Break</p>}
          buttonclass={!hasStarted ? 'callToAction' : undefined}
        />
        <div
          id='sort__newData'
          type='button'
          button={<p onClick={!hasStarted ? generateData : null}>Generate new data</p>}
          disabled={hasStarted}
        />
        <div
          id='sort__options'
          type='options'
          button={<p>More options</p>}
          disabled={hasStarted}>
          <div>
            <label>Values min range: {dataParams.min}</label><br/>
            <input
              type='range'
              min={-100}
              max={dataParams.max}
              step={1}
              value={dataParams.min}
              onChange={event => setDataParams({ ...dataParams, min: parseInt(event.target.value) })}
              disabled={hasStarted}
            />
          </div>
          <div>
            <label>Values max range: {dataParams.max}</label><br/>
            <input
              type='range'
              min={dataParams.min}
              max={100}
              step={1}
              value={dataParams.max}
              onChange={event => setDataParams({ ...dataParams, max: parseInt(event.target.value) })}
              disabled={hasStarted}
            />
          </div>
          <div>
            <label>Array size: {dataParams.size}</label><br/>
            <input
              type='range'
              max={1000}
              min={2}
              step={1}
              value={dataParams.size}
              onChange={event => setDataParams({ ...dataParams, size: parseInt(event.target.value) })}
              disabled={hasStarted}
            />
          </div>
          <div className='checkboxContainer'>
            <label>Labels:&nbsp;</label>
            <input
              type='checkbox'
              name={'dataLabels'}
              checked={displayParams.dataLabels === 'true'}
              onChange={event => setDisplayParams({ ...displayParams, dataLabels: event.target.checked ? 'true' : 'false' })}
              disabled={displayParams.dataLabels.includes('disabled')}
            />
          </div>
          <div className='checkboxContainer'>
            <label>Margins:&nbsp;</label>
            <input
              type='checkbox'
              name={'dataMargins'}
              checked={displayParams.dataMargins === 'true'}
              onChange={event => setDisplayParams({ ...displayParams, dataMargins: event.target.checked ? 'true' : 'false' })}
              disabled={displayParams.dataMargins.includes('disabled')}
            />
          </div>
        </div>
      </Toolbar>
      {renderChart()}
    </div>
  );
};

export default SortContainer;
