import React, { useState, useEffect } from 'react';

import Toolbar from '../common/Toolbar';
import DijkstraAlgorithm from './containers/DijkstraAlgorithm';


const PathfinidingContainer = () => {

  // Temporary solution, these are to be defined by the user or auto calculated
  const START_NODE_X = 5;
  const START_NODE_Y = 11;
  const FINISH_NODE_X = 35;
  const FINISH_NODE_Y = 21;
  const LENGTH_X = 40;
  const LENGTH_Y = 30;


  return (
    <div className='moduleContainer'>
      <DijkstraAlgorithm
        lengthX={LENGTH_X}
        lengthY={LENGTH_Y}
        start={{ x: START_NODE_X, y: START_NODE_Y }}
        finish={{ x: FINISH_NODE_X, y: FINISH_NODE_Y }}
      />
    </div>
  );
};

export default PathfinidingContainer;
