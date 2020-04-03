const AStarAlgorithm = async (
  grid,
  startPosition,
  finishPosition,
  finish,
  visualizeStepsOnGrid,
) => {

  const finishNode = grid[finishPosition.y][finishPosition.x];
  const startNode = grid[startPosition.y][startPosition.x];
  const visitedNodesInOrder = [];
  const unvisitedNodes = []

  const aStar = () => {
    startNode.heuristicDistance = getManhattanDistance(startNode);
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

  const getManhattanDistance = node => {
    return Math.abs(finishPosition.x - node.x) + Math.abs(finishPosition.y - node.y);
  };

  const sortNodesByCombinedDistance = array => {
      array.sort((nodeA, nodeB) => {
      const result = (nodeA.distance + nodeA.heuristicDistance) - (nodeB.distance + nodeB.heuristicDistance);
      if (result !== 0) return result;
      return nodeA.heuristicDistance > nodeB.heuristicDistance
        ? 1
        : -1;
      });
  };

  const updateUnvisitedNeighbours = node => {
    const unvisitedNeighbours = getUnvisitedNeighbours(node);
    unvisitedNeighbours.forEach(neighbour => {
      neighbour.heuristicDistance = getManhattanDistance(neighbour);
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

  function getUnvisitedNeighbours(node) {
    const neighbours = [];
    const { x, y } = node;
    if (y > 0) neighbours.push(grid[y - 1][x]);
    if (y < grid.length - 1) neighbours.push(grid[y + 1][x]);
    if (x > 0) neighbours.push(grid[y][x - 1]);
    if (x < grid[0].length - 1) neighbours.push(grid[y][x + 1]);
    return neighbours.filter(neighbour => !neighbour.isVisited);
  };

  const getNodesInPathOrder = node => {
    const nodesInPathOrder = [];
    while (node !== null) {
      nodesInPathOrder.unshift(node);
      node = node.previousNode;
    };
    return nodesInPathOrder;
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
