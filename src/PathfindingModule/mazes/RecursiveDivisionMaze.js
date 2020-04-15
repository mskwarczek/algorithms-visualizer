const RecursiveDivisionMaze = async (
  grid,
  startPosition,
  finishPosition,
  visualizeStepsOnGrid,
) => {

  const divideChamber = async (grid, walls) => {
    if (grid.length <= 2 || grid[0].length <= 2) return [];
    let line, chamber1, chamber2, newArray1, newArray2 = [];
    let pivot, gateIdx = null;
    if (grid.length > grid[0].length) {
      pivot = Math.floor(Math.random() * ((grid.length - 1) - 1) + 1);
      line = generateLine(grid, pivot, 'horizontal');
      gateIdx = openGate(line);
      gates.push(grid[pivot - 1][gateIdx]);
      gates.push(grid[pivot + 1][gateIdx]);
      chamber1 = grid.filter((_, idx) => idx < pivot);
      chamber2 = grid.filter((_, idx) => idx > pivot);
    } else {
      pivot = Math.floor(Math.random() * ((grid[0].length - 1) - 1) + 1);
      line = generateLine(grid, pivot, 'vertical');
      gateIdx = openGate(line);
      gates.push(grid[gateIdx][pivot - 1]);
      gates.push(grid[gateIdx][pivot + 1]);
      chamber1 = grid.map(array => array.filter((_, idx) => idx < pivot));
      chamber2 = grid.map(array => array.filter((_, idx) => idx > pivot));
    };
    line = line.filter((_, idx) => idx !== gateIdx);
    newArray1 = await divideChamber(chamber1, walls);
    newArray2 = await divideChamber(chamber2, walls);
    walls = walls.concat(line, newArray1, newArray2);
    return walls;
  };

  const generateLine = (grid, pivot, orientation) => {
    const line = [];
    const initialLine = orientation === 'vertical' ? grid : grid[pivot];
    initialLine.forEach(element => {
      const node = orientation === 'vertical' ? element[pivot] : element;
      if (!(
        (node.x === startPosition.x && node.y === startPosition.y) ||
        (node.x === finishPosition.x && node.y === finishPosition.y) ||
        (gates.some(gate => gate.x === node.x && gate.y === node.y))
      )) line.push(node);
    });
    return line;
  };

  const openGate = line => {
    const gateIdx = Math.floor(Math.random() * (line.length));
    const newGate = line.filter((_, idx) => idx === gateIdx)[0];
    gates.push(newGate);
    return gateIdx;
  };

  let gates = [];
  const walls = await divideChamber(grid, []);
  await visualizeStepsOnGrid(walls, 'wall', 2);
  return walls;
};

export default RecursiveDivisionMaze;
