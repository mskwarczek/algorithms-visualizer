const PrimsAlgorithmMaze = async (
  grid,
  startPosition,
  finishPosition,
  visualizeStepsOnGrid,
) => {

  const primsAlgorithm = async (grid, startPosition, visualizeStepsOnGrid) => {
    let allNodes = getAllNodes(grid);
    await visualizeStepsOnGrid(allNodes, 'wall', 100, true);
    await visualizeStepsOnGrid(allNodes, 'wall', 100);
    let possibleCells = []
    let walls = [];
    let cells = [];
    walls = addNewCell(grid[startPosition.y][startPosition.x], false, possibleCells, cells, walls);
    while (walls.length > 0) {
      const wallIdx = Math.floor(Math.random() * walls.length);
      const wall = walls[wallIdx];
      if (wall.x <= 0 || wall.x >= grid[0].length - 1 || wall.y <= 0 || wall.y >= grid.length - 1) {
        walls = walls.filter(elem => !(elem.x === wall.x && elem.y === wall.y));
        continue;
      };
      if (
        possibleCells.some(cell => cell.x === wall.x && cell.y === wall.y + 1) &&
        !possibleCells.some(cell => cell.x === wall.x && cell.y === wall.y - 1)
      ) walls = addNewCell(grid[wall.y - 1][wall.x], wall, possibleCells, cells, walls);
      else if (
        possibleCells.some(cell => cell.x === wall.x && cell.y === wall.y -1) &&
        !possibleCells.some(cell => cell.x === wall.x && cell.y === wall.y + 1)
      ) walls = addNewCell(grid[wall.y + 1][wall.x], wall, possibleCells, cells, walls);
      else if (
        possibleCells.some(cell => cell.x === wall.x + 1 && cell.y === wall.y) &&
        !possibleCells.some(cell => cell.x === wall.x - 1 && cell.y === wall.y)
      ) walls = addNewCell(grid[wall.y][wall.x - 1], wall, possibleCells, cells, walls);
      else if (
        possibleCells.some(cell => cell.x === wall.x - 1 && cell.y === wall.y) &&
        !possibleCells.some(cell => cell.x === wall.x + 1 && cell.y === wall.y)
      ) walls = addNewCell(grid[wall.y][wall.x + 1], wall, possibleCells, cells, walls);
      else {
        walls = walls.filter(elem => !(elem.x === wall.x && elem.y === wall.y));
      }
    };
    if (!cells.some(cell => cell.x === finishPosition.x && cell.y === finishPosition.y))
      walls = addNewCell(grid[finishPosition.y][finishPosition.x], false, possibleCells, cells, walls);
    await visualizeStepsOnGrid(cells, 'wall', 2, true);
    return allNodes.filter(elem => !cells.some(cell => elem.x === cell.x && elem.y === cell.y));
  };

  const getAllNodes = grid => {
    const nodes = [];
    grid.forEach(axisY => 
      axisY.forEach(node => nodes.push(node))
    );
    return nodes;
  };

  const addNewCell = (cell, wall, possibleCells, cells, walls) => {
    if (wall) cells.push(wall);
    cells.push(cell);
    possibleCells.push(cell);
    if (grid[cell.y - 1] && grid[cell.y - 1][cell.x]) walls.push(grid[cell.y - 1][cell.x]);
    if (grid[cell.y][cell.x - 1]) walls.push(grid[cell.y][cell.x - 1]);
    if (grid[cell.y + 1] && grid[cell.y + 1][cell.x]) walls.push(grid[cell.y + 1][cell.x]);
    if (grid[cell.y][cell.x + 1]) walls.push(grid[cell.y][cell.x + 1]);
    if (wall) return walls.filter(elem => !(elem.x === wall.x && elem.y === wall.y));
    return walls;
  };

  const wallsArray = await primsAlgorithm(grid, startPosition, visualizeStepsOnGrid);
  return wallsArray;
};

export default PrimsAlgorithmMaze;
