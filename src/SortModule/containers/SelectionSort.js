import React, { useState, useEffect, useRef } from 'react';

const SelectionSort = ({
  data,
  updateData,
  dataParams,
  sortParams,
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
  }, [hasStarted])

  useEffect(() => {
    if (hasStarted) {
      let intervalID = null;
      if (iteration.i < data.length) {
        intervalID = setTimeout(() => selectionSort(), 10);
      } else {
        clearTimeout(intervalID);
        finish(true);
      };
      return () => clearTimeout(intervalID);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iteration])

  useEffect(() => {
    if (hasFinished) {
      min.current = null;
      updateIteration({ i: null, j: null });
    };
  }, [hasFinished])

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

  return (
    <div className='sortContainer'>
      <div className='sortContainer__chart'>
        {data.length > 0 && data.map((elem, index) => 
          <div
            key={index}
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
                    : index === min.current
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
  );
};

export default SelectionSort;
