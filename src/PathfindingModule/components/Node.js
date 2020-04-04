import React from 'react';

const Node = ({
  id,
  size,
  node,
  forwardRef,
  mouseDown,
  mouseEnter,
  mouseUp,
}) => {

  const { type } = node;

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
      onMouseDown={() => mouseDown(node)}
      onMouseEnter={() => mouseEnter(node)}
      onMouseUp={() => mouseUp(node)}
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
