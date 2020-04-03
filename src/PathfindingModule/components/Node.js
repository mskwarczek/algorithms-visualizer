import React from 'react';

const Node = ({
  id,
  size,
  position,
  type,
  forwardRef,
  mouseDown,
  mouseEnter,
  mouseUp,
}) => {

  return (
    <div
      id={id}
      ref={forwardRef}
      className={
        type === 'start'
          ? 'node node--start'
          : type === 'finish'
          ? 'node node--finish'
          : 'node'
      }
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseDown={() => mouseDown(position)}
      onMouseEnter={() => mouseEnter(position)}
      onMouseUp={() => mouseUp(position)}
    >
      { type === 'start' ? <p>></p>
        : type === 'finish' ? <p>X</p>
        : null
        // For debug:
        // : <div style={{ fontSize: '.5em', display: 'flex', flexFlow: 'column nowrap' }}>
        //   <p>{id.split('-')[1]}</p>
        //   <p>{id.split('-')[2]}</p>
        // </div>
      }
    </div>
  );
};

export default Node;
