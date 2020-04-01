import React, { useState, useEffect } from 'react';

import Node from '../components/Node';

const DijkstraAlgorithm = ({
  lengthX,
  lengthY,
  start,
  finish,
}) => {

  const [ grid, updateGrid ] = useState([]);

  useEffect(() => {
    generateGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateGrid = () => {
    let newGrid = [];
    for (let y = 0; y < lengthY; y++) {
      newGrid.push([]);
      for (let x = 0; x < lengthX; x++) {
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
    const startNode = { ...newGrid[start.y][start.x], type: 'start', distance: 0, isVisited: true };
    const finishNode = { ...newGrid[finish.y][finish.x], type: 'finish' };
    newGrid[start.y][start.x] = startNode;
    newGrid[finish.y][finish.x] = finishNode;
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
            type={node.type}
            distance={node.distance}
            isVisited={node.isVisited}
            previousNode={node.previousNode}
            isWall={node.isWall}
        />)}
      </div>
    );
  };

  const dijkstra = () => {
    const finishNode = grid[finish.y][finish.x];
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes();
    while (!!unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighbours(closestNode);
    };
  };

  const getAllNodes = () => {
    const nodes = [];
    grid.forEach(axisY => 
      axisY.forEach(node => 
        nodes.push(node)
      )
    );
    return nodes;
  };

  const sortNodesByDistance = unvisitedNodes => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };

  const updateUnvisitedNeighbours = node => {
    const unvisitedNeighbours = getUnvisitedNeighbours(node);
    unvisitedNeighbours.forEach(neighbour => {
      neighbour.distance = node.distance + 1;
      neighbour.previousNode = node;
    });
  };

  function getUnvisitedNeighbours(node) {
    const neighbours = [];
    const { x, y } = node;
    if (y > 0) neighbours.push(grid[y - 1][x]);
    if (y < grid.length - 1) neighbours.push(grid[y + 1][x]);
    if (x > 0) neighbours.push(grid[y][x - 1]);
    if (x < grid[0].length - 1) neighbours.push(grid[y][x + 1]);
    return neighbours.filter(neighbour => !neighbour.isVisited);
  };

  const getNodesInShortestPathOrder = () => {
    const nodesInShortestPathOrder = [];
    let currentNode = grid[finish.y][finish.x];
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    };
    return nodesInShortestPathOrder;
  };

  const step = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const visualizeStepsOnGrid = async (source, type) => {
    for (let i = 0; i < source.length; i++) {
      const currentNode = source[i];
      updateGrid(grid => {
        return grid.map((axisY, idxY) => {
          return axisY.map((node, idxX) => {
            return (idxY === currentNode.y && idxX === currentNode.x && currentNode.type !== 'start' && currentNode.type !== 'finish')
              ? { ...node, type }
              : node;
          });
        });
      });
      await step(10);
    };
  };

  const visualizeDijkstra = async () => {
    const visitedNodesInOrder = dijkstra();
    const nodesInShortestPathOrder = getNodesInShortestPathOrder();
    await visualizeStepsOnGrid(visitedNodesInOrder, 'visited');
    await visualizeStepsOnGrid(nodesInShortestPathOrder, 'shortestPath');
  };

  return (
    <div style={{ borderTop: '1px solid black', borderLeft: '1px solid black'}}>
      {grid && grid.length > 0 && displayGrid()}
      <button style={{ width: '100px', height: '50px', color: 'black' }} onClick={visualizeDijkstra}>TEST</button>
    </div>
  );
};

export default DijkstraAlgorithm;
