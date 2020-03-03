import React, { useState } from 'react';

import Toolbar from '../common/Toolbar';

const SortContainer = () => {

  const [ data, updateData ] = useState([]);
  const [ dataParams, setDataParams ] = useState({ size: 40, min: -100, max: 100 });

  const generateData = () => {
    let newData = [];
    for (let i = 0; i < dataParams.size; i++) {
      newData.push(Math.floor(Math.random() * (dataParams.max - dataParams.min + 1)) + dataParams.min);
    };
    updateData(newData);
  };

  console.log(data);

  return (
    <div className='moduleContainer'>
      <Toolbar
        title='Sorting Algorithms'
      >
        <p onClick={generateData}>Generate random data</p>
        <p>Option 2</p>
        <p>Option 3</p>
      </Toolbar>
      <div className='sortContainer'>
        <div className='sortContainer__chart'>
          {data.map((elem, index) => 
            <div
              key={index}
              style={{
                height: (elem - dataParams.min) / (dataParams.max - dataParams.min) * 100 + '%',
                width: 80 / dataParams.size + '%',
                margin: '1px',
                backgroundColor: 'lightblue',
                textAlign: 'center',
              }}
            >
              <p>{elem}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortContainer;
