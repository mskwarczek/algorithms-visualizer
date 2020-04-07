import {
  sortNodesByKey,
  getUnvisitedNeighbours,
  getNodesInPathOrder,
} from './common'

const dijkstraAlgorithm = async (
  grid,
  finishPosition,
  finish,
  visualizeStepsOnGrid,
) => {

  const finishNode = grid[finishPosition.y][finishPosition.x];

  const dijkstra = () => {
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes();
    while (!!unvisitedNodes.length) {
      sortNodesByKey(unvisitedNodes, 'distance');
      const currentNode = unvisitedNodes.shift();
      if (currentNode.type === 'wall') continue;
      if (currentNode.distance === Infinity) return visitedNodesInOrder;
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighbours(currentNode);
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

  const updateUnvisitedNeighbours = node => {
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, node);
    unvisitedNeighbours.forEach(neighbour => {
      neighbour.distance = node.distance + 1;
      neighbour.previousNode = node;
    });
  };

  const visualizeAlgorithm = async () => {
    const visitedNodesInOrder = dijkstra();
    const nodesInShortestPathOrder = getNodesInPathOrder(finishNode);
    await visualizeStepsOnGrid(visitedNodesInOrder, 'visited');
    await visualizeStepsOnGrid(nodesInShortestPathOrder, 'shortestPath', .5);
  };

  await visualizeAlgorithm();
  finish(true);
};

export default dijkstraAlgorithm;
