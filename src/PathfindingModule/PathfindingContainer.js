import React, { useState, useRef, useLayoutEffect } from 'react';

import Toolbar from '../common/Toolbar';
import Node from './components/Node';
import DijkstraAlgorithm from './algorithms/DijkstraAlgorithm';

const PathfinidingContainer = () => {

  const NODE_SIZE_DIVIDER = 60;

  const initialAlgorithmParams = {
    type: 'dijkstra',
    interval: 5,
  };

  const [ grid, updateGrid ] = useState([]);
  const [ gridParams, setGridParams ] = useState({});
  const [ algorithmParams, setAlgorithmParams ] = useState(initialAlgorithmParams);
  const [ hasStarted, start ] = useState(false);
  const [ hasFinished, finish ] = useState(false);

  const gridContainerRef = useRef();
  const nodesRef = useRef([]);

  useLayoutEffect(() => {
    if (gridContainerRef.current) {
      const nodeSize = gridContainerRef.current.offsetWidth / NODE_SIZE_DIVIDER - 1;
      const axisX = Math.floor(gridContainerRef.current.offsetWidth / nodeSize);
      const axisY = Math.floor(gridContainerRef.current.offsetHeight / nodeSize);
      const startNode = {
        x: Math.floor(axisX / 5),
        y: Math.floor(axisY / 2),
      };
      const finishNode = {
        x: Math.floor(axisX / 5 * 4),
        y: Math.floor(axisY / 2),
      };
      setGridParams({
        nodeSize,
        axisX,
        axisY,
        startNode,
        finishNode,
      });
      generateGrid(axisX, axisY, startNode, finishNode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateGrid = (axisX, axisY, startNode, finishNode) => {
    let newGrid = [];
    for (let y = 0; y < axisY; y++) {
      newGrid.push([]);
      for (let x = 0; x < axisX; x++) {
        newGrid[y].push({
          x,
          y,
          type: null,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          isWall: false,
        });
      };
    };
    const newStartNode = { ...newGrid[startNode.y][startNode.x], type: 'start', distance: 0, isVisited: true };
    const newFinishNode = { ...newGrid[finishNode.y][finishNode.x], type: 'finish' };
    newGrid[startNode.y][startNode.x] = newStartNode;
    newGrid[finishNode.y][finishNode.x] = newFinishNode;
    updateGrid(newGrid);
  };

  const displayGrid = () => {
    return grid.map((axisY, idx) => 
      <div
        key={idx}
        style={{ display: 'flex', flexFlow: 'row nowrap' }}>
        {axisY.map(node => 
          <Node
            key={`${node.x}-${node.y}`}
            id={`node-x${node.x}-y${node.y}`}
            forwardRef={el => nodesRef.current[`node-x${node.x}-y${node.y}`] = el}
            size={gridParams.nodeSize}
            type={node.type}
        />)}
      </div>
    );
  };

  const reset = () => {
    const { axisX, axisY, startNode, finishNode } = gridParams;
    // generateGrid(axisX, axisY, startNode, finishNode);
    for (const node in nodesRef.current) {
      nodesRef.current[node].className = 'node';
    };
    nodesRef.current[`node-x${startNode.x}-y${startNode.y}`].classList.add('node--start');
    nodesRef.current[`node-x${finishNode.x}-y${finishNode.y}`].classList.add('node--finish');
    start(false);
    finish(false);
  };

  const runAlgorithm = () => {
    start(true);
    DijkstraAlgorithm(
      grid,
      gridParams.finishNode,
      finish,
      visualizeStepsOnGrid,
    );
  };

  const step = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const visualizeStepsOnGrid = async (source, type) => {
    for (let i = 0; i < source.length; i++) {
      const currentNode = source[i];
      nodesRef.current[`node-x${currentNode.x}-y${currentNode.y}`].classList.add('node--active');
      await step(algorithmParams.interval);
      nodesRef.current[`node-x${currentNode.x}-y${currentNode.y}`].classList.remove('node--active');
      nodesRef.current[`node-x${currentNode.x}-y${currentNode.y}`].classList.add(`node--${type}`);
      await step(algorithmParams.interval);
    };
  };

  return (
    <div className='moduleContainer'>
      <Toolbar
        title='Sorting Algorithms'
        box_1={
          [
            <div>
              <label>Algorithm: </label>
              <select
                value={algorithmParams.type}
                onChange={event => setAlgorithmParams({ ...algorithmParams, type: event.target.value })}
                disabled={hasStarted}
              >
                <option value='dijkstra'>Dijkstra's Algorithm</option>
              </select>
            </div>,
            !hasStarted
              ? <p onClick={runAlgorithm} className='callToAction'>Run!</p>
              : !hasFinished
              ? <p onClick={() => window.location.reload()} style={{ fontSize: '1.5em' }}>Break</p>
              : <p onClick={reset} style={{ fontSize: '1.5em' }}>Reset</p>,
            <div>
              <label>Speed: </label>
              <select
                value={algorithmParams.interval}
                onChange={event => setAlgorithmParams({ ...algorithmParams, interval: event.target.value })}
                disabled={hasStarted}
              >
                <option value={200}>Slow</option>
                <option value={25}>Average</option>
                <option value={5}>Fast</option>
              </select>
            </div>,
          ]
        }
      />
      <div
        className='gridContainer'
        ref={gridContainerRef}
      >
        {grid && grid.length > 0 && displayGrid()}
      </div>
    </div>
  );
};

export default PathfinidingContainer;
