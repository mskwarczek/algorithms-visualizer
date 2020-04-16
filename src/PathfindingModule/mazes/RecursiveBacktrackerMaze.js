const RecursiveBacktrackerMaze = async (
  grid,
  startPosition,
  finishPosition,
  visualizeStepsOnGrid,
) => {

  const recursiveBacktracker = async (grid, startPosition, visualizeStepsOnGrid) => {
    let allNodes = getAllNodes(grid);
    await visualizeStepsOnGrid(allNodes, 'wall', 100, true);
    await visualizeStepsOnGrid(allNodes, 'wall', 100);
    let visitedCells = []
    let cells = [];
    const idxY = Math.floor(Math.random() * (grid.length));
    const idxX = Math.floor(Math.random() * (grid[0].length));
    addNewCell(grid[idxY][idxX], false, false, visitedCells, cells);
    while (cells.length > 0) {
      const currentCell = cells.pop();
      let possibleTargets = [];
      const neighbourPositiveY = checkNeighbourCells(grid, visitedCells, currentCell, 1, 0, 1);
      if (neighbourPositiveY) possibleTargets.push(neighbourPositiveY);
      const neighbourNegativeY = checkNeighbourCells(grid, visitedCells, currentCell, 1, 0, -1);
      if (neighbourNegativeY) possibleTargets.push(neighbourNegativeY);
      const neighbourPositiveX = checkNeighbourCells(grid, visitedCells, currentCell, 0, 1, 1);
      if (neighbourPositiveX) possibleTargets.push(neighbourPositiveX);
      const neighbourNegativeX = checkNeighbourCells(grid, visitedCells, currentCell, 0, 1, -1);
      if (neighbourNegativeX) possibleTargets.push(neighbourNegativeX);
      if (possibleTargets.length > 0) {
        const idx = Math.floor(Math.random() * (possibleTargets.length));
        const { wall, targetCell } = possibleTargets[idx];
        addNewCell(currentCell, wall, targetCell, visitedCells, cells);
      };
    };
    if (!visitedCells.some(cell => cell.x === startPosition.x && cell.y === startPosition.y))
      addNewCell(grid[startPosition.y][startPosition.x], false, false, visitedCells, cells);
    if (!visitedCells.some(cell => cell.x === finishPosition.x && cell.y === finishPosition.y))
      addNewCell(grid[finishPosition.y][finishPosition.x], false, false, visitedCells, cells);
    await visualizeStepsOnGrid(visitedCells, 'wall', 2, true);
    return allNodes.filter(elem => !visitedCells.some(cell => elem.x === cell.x && elem.y === cell.y));
  };

  const getAllNodes = grid => {
    const nodes = [];
    grid.forEach(axisY => 
      axisY.forEach(node => nodes.push(node))
    );
    return nodes;
  };

  const addNewCell = (cell, wall, targetCell, visitedCells, cells) => {
    if (wall) visitedCells.push(wall);
    visitedCells.push(cell);
    if (targetCell) visitedCells.push(targetCell);
    cells.push(cell);
    if (targetCell) cells.push(targetCell);
  };

  const checkNeighbourCells = (grid, visitedCells, currentCell, valY, valX, sign) => {
    if (
      grid[currentCell.y + (1 * sign * valY)] &&
      grid[currentCell.y + (2 * sign * valY)] &&
      grid[currentCell.y + (1 * sign * valY)][currentCell.x + (1 * sign * valX)] &&
      grid[currentCell.y + (2 * sign * valY)][currentCell.x + (2 * sign * valX)] &&
      !visitedCells.some(cell => cell.x === currentCell.x + (2 * sign * valX) && cell.y === currentCell.y + (2 * sign * valY))
    ) {
      return {
        wall: grid[currentCell.y + (1 * sign * valY)][currentCell.x + (1 * sign * valX)],
        targetCell: grid[currentCell.y + (2 * sign * valY)][currentCell.x + (2 * sign * valX)],
      };
    };
  };

  const wallsArray = await recursiveBacktracker(grid, startPosition, visualizeStepsOnGrid);
  return wallsArray;
};

export default RecursiveBacktrackerMaze;
