import React, { useState, useEffect } from 'react';

const BubbleSort = ({
  data,
  updateData,
  dataParams,
  sortParams,
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
  }, [hasStarted])

  useEffect(() => {
    if (hasStarted) {
      let intervalID = null;
      if (iteration.i > 0) {
        intervalID = setTimeout(() => bubbleSort(), 10);
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
      updateIteration({ i: null, j: null });
    };
  }, [hasFinished])

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
                iteration.i !== null && index === iteration.i
                  ? 'red' 
                  : iteration.j !== null  && (index === iteration.j || index === iteration.j + 1) && data[iteration.j] > data[iteration.j + 1]
                    ? 'blue'
                    : iteration.j !== null  && (index === iteration.j || index === iteration.j + 1)
                      ? 'gray'
                      : iteration.i !== null  && index > iteration.i
                        ? 'lightblue'
                        : 'lightgray',
            }}
          >
            <p className='sortContainer__label'>{elem}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BubbleSort;
