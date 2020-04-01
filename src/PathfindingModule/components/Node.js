import React from 'react';

const Node = ({ type }) => {

  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        borderBottom: '1px solid black',
        borderRight: '1px solid black',
      }}
    >
      { type === 'start' ? <p>S</p>
        : type === 'finish' ? <p>F</p>
        : type === 'visited' ? <p>**</p>
        : type === 'shortestPath' ? <p>X</p>
        : null
      }
    </div>
  );
};

export default Node;
