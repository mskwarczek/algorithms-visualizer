import React, { useState } from 'react';

const Toolbar = ({ children }) => {

  const [ activeChild, setActiveChild ] = useState(null);

  const expandBox = id => {
    activeChild === id
      ? setActiveChild(null)
      : setActiveChild(id);
  };

  return (
    <div className='toolbar'>
      <div className='toolbar__mainBox'>
        {children.map(element => {
        const { id, type, button, active, buttonclass, disabled } = element.props;
        return (
          <div key={id}
            onClick={type !== 'button' && !disabled ? () => expandBox(id) : null}
            style={{
              width: `${100 / children.length}%`,
            }}>
            <div className={!disabled ? `button ${buttonclass}` : `button button--disabled ${buttonclass}`}>
              {button}
              {type === 'select' &&
                <p className='label'>{active}</p>}
            </div>
            {id === activeChild && !disabled && type === 'select' &&
              <div
                className='toolbar__selectBox'
                onClick={() => setActiveChild(null)}>
                {element}
              </div>}
          </div>
      )})}
      </div>
    </div>
  );
};

export default Toolbar;
