import React, { useState, useRef, useLayoutEffect } from 'react';

import Toolbar from '../common/Toolbar';
import Node from './components/Node';
import DijkstraAlgorithm from './algorithms/DijkstraAlgorithm';
import HeuristicAlgorithms from './algorithms/HeuristicAlgorithms';

const PathfinidingContainer = () => {

  const NODE_SIZE_DIVIDER = 50;

  const initialAlgorithmParams = {
    type: 'dijkstra',
    interval: 5,
  };

  const initialGridParams = {
    paintMode: 'wall',
  };

  const [ grid, updateGrid ] = useState([]);
  const [ gridParams, setGridParams ] = useState(initialGridParams);
  const [ algorithmParams, setAlgorithmParams ] = useState(initialAlgorithmParams);
  const [ hasStarted, start ] = useState(false);
  const [ hasFinished, finish ] = useState(false);

  const gridContainerRef = useRef();
  const nodesRef = useRef([]);
  const wallsArray = useRef([]);

  let tempWallsArray = [];
  let isMousePressed = false;

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
        ...gridParams,
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
          heuristicDistance: Infinity,
          isVisited: false,
          previousNode: null,
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
            position={{ x: node.x, y: node.y }}
            type={node.type}
            mouseDown={handleMouseDown}
            mouseEnter={handleMouseEnter}
            mouseUp={handleMouseUp}
        />)}
      </div>
    );
  };

  const copyGrid = () => {
    const gridCopy = [];
    grid.forEach(axisY => {
      const axisYCopy = []
      axisY.forEach(node => 
        axisYCopy.push({ ...node })
      );
      gridCopy.push(axisYCopy);
    });
    return gridCopy;
  };

  const paintFromSource = (source, type) => {
    source.forEach(node => {
      nodesRef.current[`node-x${node.x}-y${node.y}`].classList.toggle(`node--${type}`);
    });
  };

  const paintWithMouse = node => {
    if (!(node.x === gridParams.startNode.x && node.y === gridParams.startNode.y) &&
      !(node.x === gridParams.finishNode.x && node.y === gridParams.finishNode.y)) {
      nodesRef.current[`node-x${node.x}-y${node.y}`].classList.toggle(`node--${gridParams.paintMode}`);
      if (tempWallsArray.some(wall => wall.x === node.x && wall.y === node.y)) {
        const filteredWalls = tempWallsArray.filter(wall => !(wall.x === node.x && wall.y === node.y));
        tempWallsArray = filteredWalls;
      } else {
        tempWallsArray.push(node);
      };
    };
  };

  const handleMouseDown = node => {
    if (!hasStarted) {
      isMousePressed = true;
      paintWithMouse(node);
    };
  };

  const handleMouseEnter = node => {
    if (isMousePressed && !hasStarted) paintWithMouse(node);
  };

  const handleMouseUp = () => {
    if (tempWallsArray.length > 0 && !hasStarted) {
      addWallsToGrid(tempWallsArray);
      tempWallsArray = [];
    };
    isMousePressed = false;
  };

  const addWallsToGrid = (newWalls, type) => {
    const paintType = type
      ? type
      : gridParams.paintMode;
    const newGrid = copyGrid();
    newWalls.forEach(wall => {
      const targetNode = grid[wall.y][wall.x];
      const newWall = {
        ...targetNode,
        type: 
          !targetNode.type
            ? paintType
            : targetNode.type === paintType
            ? null
            : targetNode.type
          };
      newGrid[wall.y][wall.x] = newWall;
    });
    updateGrid(newGrid);
  };

  const reset = type => {
    if (type === 'path') {
      wallsArray.current = [];
      grid.forEach(axisY => {
        axisY.forEach(node => {
          if (node.type === 'wall') wallsArray.current.push({ x: node.x, y: node.y });
        });
      });
    };
    const { axisX, axisY, startNode, finishNode } = gridParams;
    generateGrid(axisX, axisY, startNode, finishNode);
    for (const node in nodesRef.current) {
      nodesRef.current[node].className = 'node';
    };
    nodesRef.current[`node-x${startNode.x}-y${startNode.y}`].classList.add('node--start');
    nodesRef.current[`node-x${finishNode.x}-y${finishNode.y}`].classList.add('node--finish');
    start(false);
    finish(false);
    if (type === 'path' && wallsArray.current.length > 0) {
      addWallsToGrid(wallsArray.current, type);
      paintFromSource(wallsArray.current, 'wall');
    };
  };

  const runAlgorithm = () => {
    start(true);
    switch(algorithmParams.type) {
      case 'dijkstra':
        DijkstraAlgorithm(
          copyGrid(),
          gridParams.finishNode,
          finish,
          visualizeStepsOnGrid,
        );
      break;
      case 'astar':
      case 'greedyBestFirst':
        HeuristicAlgorithms(
          copyGrid(),
          algorithmParams.type,
          gridParams.startNode,
          gridParams.finishNode,
          finish,
          visualizeStepsOnGrid,
        );
      break;
      default: break;
    };
  };

  const visualizeStepsOnGrid = async (source, type, speedMod = 1) => {
    for (let i = 0; i < source.length; i++) {
      const currentNode = source[i];
      nodesRef.current[`node-x${currentNode.x}-y${currentNode.y}`].classList.add('node--active');
      await new Promise(resolve => setTimeout(resolve, algorithmParams.interval / speedMod));
      nodesRef.current[`node-x${currentNode.x}-y${currentNode.y}`].classList.remove('node--active');
      nodesRef.current[`node-x${currentNode.x}-y${currentNode.y}`].classList.add(`node--${type}`);
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
                <option value='astar'>A* Algorithm</option>
                <option value='greedyBestFirst'>Greedy Best-First Search</option>
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
        box_2={
          [
            <div>
              <label>Paint mode: </label>
              <select
                value={gridParams.paintMode}
                onChange={event => setGridParams({ ...gridParams, paintMode: event.target.value })}
                disabled={hasStarted}
              >
                <option value='wall'>Walls</option>
              </select>
            </div>,
            hasFinished && <p onClick={() => reset('path')}>Reset path</p>,
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
