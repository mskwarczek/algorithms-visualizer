import React from 'react';

const Node = ({
  id,
  type,
  size,
  forwardRef,
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
    >
      { type === 'start' ? <p>></p>
        : type === 'finish' ? <p>X</p>
        : null
      }
    </div>
  );
};

export default Node;
