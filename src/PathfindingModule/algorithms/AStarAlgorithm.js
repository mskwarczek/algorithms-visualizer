import {
  getManhattanDistance,
  sortNodesByCombinedDistance,
  getUnvisitedNeighbours,
  getNodesInPathOrder
} from './common';

const AStarAlgorithm = async (
  grid,
  startPosition,
  finishPosition,
  finish,
  visualizeStepsOnGrid,
) => {

  const finishNode = grid[finishPosition.y][finishPosition.x];
  const startNode = grid[startPosition.y][startPosition.x];

  const aStar = () => {
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
    startNode.heuristicDistance = getManhattanDistance(startNode, finishNode);
    unvisitedNodes.push(startNode);
    while (!!unvisitedNodes.length) {
      sortNodesByCombinedDistance(unvisitedNodes);
      const currentNode = unvisitedNodes.shift();
      currentNode.isVisited = true;
      if (currentNode.type === 'wall') continue;
      if (currentNode.distance === Infinity) return visitedNodesInOrder;
      if (!(visitedNodesInOrder.includes(currentNode))) visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) return visitedNodesInOrder;
      const unvisitedNeighbours = updateUnvisitedNeighbours(currentNode);
      if (!(unvisitedNodes.includes(currentNode))) unvisitedNeighbours.forEach(neighbour => unvisitedNodes.unshift(neighbour));
    };
  };

  const updateUnvisitedNeighbours = node => {
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, node);
    unvisitedNeighbours.forEach(neighbour => {
      neighbour.heuristicDistance = getManhattanDistance(neighbour, finishNode);
      if (node.previousNode !== null) {
        if (node.distance + 1 < neighbour.distance) {
          neighbour.distance = node.distance + 1;
          neighbour.previousNode = node;
        };
      } else {
        neighbour.distance = node.distance + 1;
        neighbour.previousNode = node;
      };
    });
    return unvisitedNeighbours;
  };

  const visualizeAStar = async () => {
    const visitedNodesInOrder = aStar();
    const nodesInShortestPathOrder = getNodesInPathOrder(finishNode);
    await visualizeStepsOnGrid(visitedNodesInOrder, 'visited');
    await visualizeStepsOnGrid(nodesInShortestPathOrder, 'shortestPath', .5);
  };

  await visualizeAStar();
  finish(true);
};

export default AStarAlgorithm;
