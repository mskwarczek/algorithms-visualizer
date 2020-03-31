import React from 'react';

const Toolbar = ({ title, box_1, box_2 }) => {

  return (
    <div className='toolbar'>
      <h2>{title}</h2>
      <div className='toolbar__box'>
        {box_1.map((elem, index) => 
          <div
            key={`1_${index}`}
            className='toolbar__button'
          >
            {elem}
          </div>
        )}
      </div>
      { box_2 && box_2.length > 0 && !box_2.every(elem => elem === false) &&
        <div className='toolbar__box'>
          {box_2.map((elem, index) => 
            <div
              key={`2_${index}`}
              className='toolbar__button'
            >
              {elem}
            </div>
          )}
        </div> }
    </div>
  );
};

export default Toolbar;
