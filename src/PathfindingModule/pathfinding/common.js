export const getManhattanDistance = (node, targetNode) => {
  return Math.abs(targetNode.x - node.x) + Math.abs(targetNode.y - node.y);
};

export const sortNodesByKey = (array, key) => {
  array.sort((nodeA, nodeB) => nodeA[key] - nodeB[key]);
};

export const sortNodesByCombinedDistance = array => {
  array.sort((nodeA, nodeB) => {
  const result = (nodeA.distance + nodeA.heuristicDistance) - (nodeB.distance + nodeB.heuristicDistance);
  if (result !== 0) return result;
  return nodeA.heuristicDistance > nodeB.heuristicDistance
    ? 1
    : -1;
  });
};

export const getUnvisitedNeighbours = (grid, node) => {
  const neighbours = [];
  const { x, y } = node;
  if (y > 0) neighbours.push(grid[y - 1][x]);
  if (y < grid.length - 1) neighbours.push(grid[y + 1][x]);
  if (x > 0) neighbours.push(grid[y][x - 1]);
  if (x < grid[0].length - 1) neighbours.push(grid[y][x + 1]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
};

export const getNodesInPathOrder = node => {
  const nodesInPathOrder = [];
  while (node !== null) {
    nodesInPathOrder.unshift(node);
    node = node.previousNode;
  };
  return nodesInPathOrder;
};
