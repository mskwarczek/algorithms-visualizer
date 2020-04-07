import React, { useState, useRef, useLayoutEffect } from 'react';

import Toolbar from '../common/Toolbar';
import Node from './components/Node';
import DijkstraAlgorithm from './pathfinding/DijkstraAlgorithm';
import HeuristicAlgorithms from './pathfinding/HeuristicAlgorithms';
import RecursiveDivisionMaze from './mazes/RecursiveDivisionMaze';

const PathfinidingContainer = () => {

  // Initial state

  const initialAlgorithmParams = {
    type: 'Dijkstra\'s Algorithm',
    interval: 5,
    speed: 'fast',
  };

  const initialGridParams = {
    paintMode: 'wall',
  };

  // State

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
  let draggedNode = false;

  // Grid layout setup

  const NODE_SIZE_DIVIDER = 50;

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
        initialStartNode: startNode,
        initialFinishNode: finishNode,
      });
      generateGrid(axisX, axisY, startNode, finishNode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Grid operations

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
    wallsArray.current.forEach(node => {
      const newWall = { ...newGrid[node.y][node.x], type: 'wall' }
      newGrid[node.y][node.x] = newWall;
    });
    updateGrid(newGrid);
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

  const determineNewType = (currentType, newType) => {
    if (newType === 'wall') {
      if (currentType === 'start' || currentType === 'finish') return currentType;
      if (currentType === newType) return null;
    };
    if (newType === 'null') return null; 
    return newType;
  };

  const updateNodes = (newNodes, params) => {
    const newType = params && params.type
      ? params.type
      : gridParams.paintMode;
    const newGrid = copyGrid();
    newNodes.forEach(node => {
      const currentNode = grid[node.y][node.x];
      const newNode = {
        ...currentNode,
        ...params,
        type: determineNewType(currentNode.type, newType),
      };
      newGrid[node.y][node.x] = newNode;
    });
    updateGrid(newGrid);
  };

  // Paint operations

  const paintWithMouse = node => {
    if (!(node.type === 'start') && !(node.type === 'finish')) {
      nodesRef.current[`node-x${node.x}-y${node.y}`].classList.toggle(`node--${gridParams.paintMode}`);
      if (tempWallsArray.some(wall => wall.x === node.x && wall.y === node.y)) {
        const filteredWalls = tempWallsArray.filter(wall => !(wall.x === node.x && wall.y === node.y));
        tempWallsArray = filteredWalls;
      } else tempWallsArray.push({ x: node.x, y: node.y});
    };
  };

  // Drag & drop operations

  const shiftNodes = (nodeA, nodeB) => {
    const newGrid = copyGrid();
    const newA = { ...newGrid[nodeB.y][nodeB.x], x: nodeA.x, y: nodeA.y, type: null };
    const newB = { ...newGrid[nodeA.y][nodeA.x], x: nodeB.x, y: nodeB.y};
    newGrid[nodeA.y][nodeA.x] = newA;
    newGrid[nodeB.y][nodeB.x] = newB;
    updateGrid(newGrid);
  };

  const nodeDragStart = node => {
    draggedNode = node;
  };

  const nodeDragEnd = destinationNode => {
    if (destinationNode !== draggedNode &&
      !(destinationNode.type === 'start' && draggedNode.type === 'finish') &&
      !(destinationNode.type === 'finish' && draggedNode.type === 'start')) {
      const targetNodePosition = { x: destinationNode.x, y: destinationNode.y };
      shiftNodes(draggedNode, destinationNode);
      if (draggedNode.type === 'start') setGridParams({ ...gridParams, startNode: targetNodePosition });
      if (draggedNode.type === 'finish') setGridParams({ ...gridParams, finishNode: targetNodePosition });
    };
    draggedNode = false;
  };

  // Mouse events

  const handleMouseDown = node => {
    if (!hasStarted) {
      isMousePressed = true;
      node.type === 'start' || node.type === 'finish'
        ? nodeDragStart(node)
        : paintWithMouse(node);
    };
  };

  const handleMouseEnter = node => {
    if (!hasStarted && isMousePressed) {
      if (!draggedNode) paintWithMouse(node);
      else nodesRef.current[`node-x${node.x}-y${node.y}`].classList.add('node--drag');
    };
  };

  const handleMouseOut = node => {
    if (!hasStarted && isMousePressed && draggedNode) nodesRef.current[`node-x${node.x}-y${node.y}`].classList.remove('node--drag');
  };

  const handleMouseUp = node => {
    if (!hasStarted) {
      if (draggedNode) nodeDragEnd(node);
      else if (tempWallsArray.length > 0) {
        updateNodes(tempWallsArray);
        tempWallsArray = [];
      };
    };
    isMousePressed = false;
  };

  // Reset

  const fillRefWithData= type => {
    const newArray = [];
    grid.forEach(axisY => {
      axisY.forEach(node => {
        if (node.type === type) newArray.push({ x: node.x, y: node.y });
      });
    });
    return newArray;
  };

  const reset = type => {
    const { axisX, axisY, startNode, finishNode, initialStartNode, initialFinishNode } = gridParams;
    if (type === 'path') {
      for (const node in nodesRef.current) {
        const nodeId = node.split(/node-x|-y/);
        const nodeType = grid[nodeId[2]][nodeId[1]].type;
        if (nodeType === null) nodesRef.current[node].className = 'node';
        if (nodeType === 'start' || nodeType === 'finish') nodesRef.current[node].className = `node node--${nodeType}`;
        wallsArray.current = fillRefWithData('wall');
      };
      generateGrid(axisX, axisY, startNode, finishNode);
    } else {
      for (const node in nodesRef.current) {
        const nodeId = node.split(/node-x|-y/);
        const nodeType = grid[nodeId[2]][nodeId[1]].type;
        if (nodeType === null || nodeType === 'wall') nodesRef.current[node].className = 'node';
        if (nodeType === 'start' || nodeType === 'finish') nodesRef.current[node].className = `node node--${nodeType}`;
      };
      setGridParams({
        ...gridParams,
        startNode: initialStartNode,
        finishNode: initialFinishNode
      });
      generateGrid(axisX, axisY, initialStartNode, initialFinishNode);
    };
    start(false);
    finish(false);
    wallsArray.current = [];
  };

  // Algorithm visualization

  const runAlgorithm = () => {
    start(true);
    switch(algorithmParams.type) {
      case 'Dijkstra\'s Algorithm':
        DijkstraAlgorithm(
          copyGrid(),
          gridParams.finishNode,
          finish,
          visualizeStepsOnGrid,
        );
      break;
      case 'A* Algorithm':
      case 'Greedy Best-First Search':
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

  const generateMaze = async () => {
    const newMaze = await RecursiveDivisionMaze(
      copyGrid(),
      gridParams.startNode,
      gridParams.finishNode,
      // finish,
      visualizeStepsOnGrid,
    );
    updateNodes(newMaze, { type: 'wall' });
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

  // Render

  const displayGrid = () => {
    return grid.map((axisY, idx) => 
      <div
        key={idx}
        className='grid'>
        {axisY.map(node => 
          <Node
            key={`${node.x}-${node.y}`}
            id={`node-x${node.x}-y${node.y}`}
            forwardRef={el => nodesRef.current[`node-x${node.x}-y${node.y}`] = el}
            size={gridParams.nodeSize}
            node={node}
            mouseDown={handleMouseDown}
            mouseEnter={handleMouseEnter}
            mouseOut={handleMouseOut}
            mouseUp={handleMouseUp}
        />)}
      </div>
    );
  };

  return (
    <div className='moduleContainer'>
      <Toolbar>
        <div
          id='pathfinding__algorithm'
          type='select'
          button={<p>Algorithm:</p>}
          active={algorithmParams.type}
          disabled={hasStarted}>
          <div
            className={algorithmParams.type === 'Dijkstra\'s Algorithm' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setAlgorithmParams({ ...algorithmParams, type: 'Dijkstra\'s Algorithm'}) : null}>
            <p>Dijkstra's Algorithm</p>
          </div>
          <div
            className={algorithmParams.type === 'A* Algorithm' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setAlgorithmParams({ ...algorithmParams, type: 'A* Algorithm'}) : null}>
            <p>A* Algorithm</p>
          </div>
          <div
            className={algorithmParams.type === 'Greedy Best-First Search' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setAlgorithmParams({ ...algorithmParams, type: 'Greedy Best-First Search'}) : null}>
            <p>Greedy Best-First Search</p>
          </div>
        </div>
        <div
          id='pathfinding__speed'
          type='select'
          button={<p>Speed:</p>}
          active={algorithmParams.speed}
          disabled={hasStarted}>
          <div
            className={algorithmParams.interval === 200 ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setAlgorithmParams({ ...algorithmParams, interval: 200, speed:'slow'}) : null}>
            <p>Slow</p>
          </div>
          <div
            className={algorithmParams.interval === 25 ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setAlgorithmParams({ ...algorithmParams, interval: 25, speed: 'average'}) : null}>
            <p>Average</p>
          </div>
          <div
            className={algorithmParams.interval === 5 ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setAlgorithmParams({ ...algorithmParams, interval: 5, speed: 'fast'}) : null}>
            <p>Fast</p>
          </div>
        </div>
        <div
          id='pathfinding__start'
          type='button'
          button={
            !hasStarted
              ? <p onClick={runAlgorithm}>Run!</p>
              : !hasFinished
              ? <p onClick={() => window.location.reload()}>Break</p>
              : <p onClick={reset}>Reset</p>}
          buttonclass={!hasStarted || hasFinished ? 'callToAction' : undefined}
        />
        <div
          id='pathfinding__paint'
          type='select'
          button={<p>Paint mode:</p>}
          active={`${gridParams.paintMode}s`}
          disabled={hasStarted}>
          <div
            className={gridParams.paintMode === 'wall' ? 'button button--active' : 'button'}
            onClick={!hasStarted ? () => setGridParams({ ...gridParams, paintMode: 'wall'}) : null}>
            <p>Walls</p>
          </div>
        </div>
        <div
          id='pathfinding__resetPath'
          type='button'
          button={<p onClick={hasFinished ? () => reset('path') : null}>Reset path</p>}
          buttonclass={hasFinished ? 'callToAction' : undefined}
          disabled={!hasFinished}
        />
        <div
          id='pathfinding__generateMaze'
          type='button'
          button={<p onClick={!hasStarted ? generateMaze : null}>Draw maze</p>}
          disabled={hasStarted}
        />
      </Toolbar>
      <div
        className='workspace gridContainer'
        ref={gridContainerRef}>
        {grid && grid.length > 0 && displayGrid()}
      </div>
    </div>
  );
};

export default PathfinidingContainer;
