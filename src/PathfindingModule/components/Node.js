import React from 'react';

const Node = ({
  id,
  size,
  node,
  forwardRef,
  mouseDown,
  mouseEnter,
  mouseOut,
  mouseUp,
}) => {

  const { type } = node;
  const iconStyle = {
    fontSize: `${size * .9}px`,
    lineHeight: `${size}px`,
  };

  return (
    <div
      id={id}
      ref={forwardRef}
      className={type ? `node node--${type}` : 'node'}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseDown={() => mouseDown(node)}
      onMouseEnter={() => mouseEnter(node)}
      onMouseOut={() => mouseOut(node)}
      onMouseUp={() => mouseUp(node)}
    >
      { type === 'start' ? <p style={iconStyle}><i className='fas fa-street-view'></i></p>
        : type === 'finish' ? <p style={iconStyle}><i className='fas fa-map-marker-alt'></i></p>
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
