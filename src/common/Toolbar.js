import React from 'react';

const Toolbar = ({ title, children }) => {

  return (
    <div className='toolbar'>
      <h2>{title}</h2>
      <div className='toolbar__options'>
        {children.map((elem, index) => 
          <div
            key={index}
            className='toolbar__button'
          >
            {elem}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
