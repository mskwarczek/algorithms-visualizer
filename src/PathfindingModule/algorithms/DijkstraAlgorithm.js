const DijkstraAlgorithm = async (
  grid,
  finishPosition,
  finish,
  visualizeStepsOnGrid,
) => {

  const dijkstra = () => {
    const finishNode = grid[finishPosition.y][finishPosition.x];
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
    let currentNode = grid[finishPosition.y][finishPosition.x];
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    };
    return nodesInShortestPathOrder;
  };

  const visualizeDijkstra = async () => {
    const visitedNodesInOrder = dijkstra();
    const nodesInShortestPathOrder = getNodesInShortestPathOrder();
    await visualizeStepsOnGrid(visitedNodesInOrder, 'visited');
    await visualizeStepsOnGrid(nodesInShortestPathOrder, 'shortestPath');
  };

  await visualizeDijkstra();
  finish(true);
};

export default DijkstraAlgorithm;
