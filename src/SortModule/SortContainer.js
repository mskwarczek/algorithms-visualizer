import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Toolbar from '../common/Toolbar';

const SortContainer = () => {

  const [ data, updateData ] = useState([]);
  const [ dataParams, setDataParams ] = useState({ size: 30, min: -100, max: 100 });
  const [ sortParams, setSortParams ] = useState({ type: 'selectionSort' });
  const [ iteration, updateIteration ] = useState({ i: null, j: null });
  const min = useRef(null);

  const generateData = () => {
    let newData = [];
    for (let i = 0; i < dataParams.size; i++) {
      newData.push(Math.floor(Math.random() * (dataParams.max - dataParams.min + 1)) + dataParams.min);
    };
    updateData(newData);
  };

  useEffect(() => {
    if ( iteration.i !== null) {
      let intervalID = null;
      switch(sortParams.type) {
        case 'selectionSort':
          if (iteration.i < data.length) {
            intervalID = setTimeout(() => selectionSort(), 10);
          } else {
            clearTimeout(intervalID);
          };
          break;
        case 'bubbleSort':
          if (iteration.i > 0) {
            intervalID = setTimeout(() => bubbleSort(), 10);
          } else {
            clearTimeout(intervalID);
          };
          break;
        default: break;
      };
      return () => clearTimeout(intervalID);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iteration])

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

  const resetChart = () => {
    min.current = null;
    updateIteration({ i: null, j: null });
  };

  return (
    <div className='moduleContainer'>
      <Toolbar
        title='Sorting Algorithms'
      >
        {iteration.i === null && <p onClick={generateData}>Generate random data</p>}
        {iteration.i === null && data.length > 0 && <p onClick={() => updateIteration(() => { return sortParams.type === 'selectionSort' ? { i: 0, j: 1 } : { i: data.length - 1, j: 0 }})}>Sort!</p>}
        <select value={sortParams.type} onChange={(event) => setSortParams({ ...sortParams, type: event.target.value })}>
          <option value='selectionSort'>Selection sort</option>
          <option value="bubbleSort">Bubble sort</option>
        </select>
        {iteration.i !== null && iteration.i === data.length && <p onClick={resetChart}>Reset chart</p>}
      </Toolbar>
      <div className='sortContainer'>
        <div className='sortContainer__chart'>
          {data.map((elem, index) => 
            <div
              key={uuidv4()}
              style={{
                height: (elem - dataParams.min) / (dataParams.max - dataParams.min) * 100 + '%',
                width: 80 / dataParams.size + '%',
                margin: '1px',
                textAlign: 'center',
                backgroundColor: 
                  index === iteration.i
                    ? 'red' 
                    : index === iteration.j
                      ? 'gray'
                      : index === min.current || (sortParams.type === 'bubbleSort' && index === iteration.j + 1)
                        ? 'blue'
                        : index > iteration.i - 1
                          ? 'lightgray'
                          : 'lightblue',
              }}
            >
              <p className='sortContainer__label'>{elem}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortContainer;
