const RecursiveDivisionMaze = async (
  grid,
  startPosition,
  finishPosition,
  visualizeStepsOnGrid,
) => {

  let gates = [];

  const divideChamber = async (grid, wallsArray) => {
    if (grid.length <= 2 || grid[0].length <= 2) return [];
    if (grid.length > grid[0].length) {
      let { lineX, pivotY } = generateHozirontalLine(grid);
      let { newLine, gateIdx } = openGate(lineX);
      lineX = newLine;
      gates.push(grid[pivotY - 1][gateIdx]);
      gates.push(grid[pivotY + 1][gateIdx]);
      const topChamber = grid.filter((array, idx) => idx < pivotY);
      const bottomChamber = grid.filter((array, idx) => idx > pivotY);
      const newArray1 = await divideChamber(topChamber, wallsArray);
      const newArray2 = await divideChamber(bottomChamber, wallsArray);
      wallsArray = wallsArray.concat(lineX, newArray1, newArray2);
      return wallsArray;
    } else {
      let { lineY, pivotX } = generateVerticallLine(grid);
      let { newLine, gateIdx } = openGate(lineY);
      lineY = newLine;
      gates.push(grid[gateIdx][pivotX - 1]);
      gates.push(grid[gateIdx][pivotX + 1]);
      const leftChamber = grid.map(array => array.filter((node, idx) => idx < pivotX));
      const rightChamber = grid.map(array => array.filter((node, idx) => idx > pivotX));
      const newArray1 = await divideChamber(leftChamber, wallsArray);
      const newArray2 = await divideChamber(rightChamber, wallsArray);
      wallsArray = wallsArray.concat(lineY, newArray1, newArray2);
      return wallsArray;
    };
  };

  const generateHozirontalLine = grid => {
    const pivotY = Math.floor(Math.random() * ((grid.length - 1) - 1) + 1);
    const lineX = [];
    grid[pivotY].forEach((node, idx) => {
      if (!(
        (node.x === startPosition.x && node.y === startPosition.y) ||
        (node.x === finishPosition.x && node.y === finishPosition.y) ||
        (gates.some(gate => gate.x === node.x && gate.y === node.y))
      )) lineX.push(node);
    });
    return { lineX, pivotY };
  };

  const generateVerticallLine = grid => {
    const pivotX = Math.floor(Math.random() * ((grid[0].length - 1) - 1) + 1);
    const lineY = [];
    grid.forEach((array, idx) => {
      const node = array[pivotX];
      if (!(
        (node.x === startPosition.x && node.y === startPosition.y) ||
        (node.x === finishPosition.x && node.y === finishPosition.y) ||
        (gates.some(gate => gate.x === node.x && gate.y === node.y))
      )) lineY.push(node);
    });
    return { lineY, pivotX };
  };

  const openGate = line => {
    const gateIdx = Math.floor(Math.random() * (line.length));
    const newGate = line.filter((node, idx) => idx === gateIdx)[0];
    const newLine = line.filter((node, idx) => idx !== gateIdx);
    gates.push(newGate);
    return { gateIdx, newLine };
  };

  const wallsArray = await divideChamber(grid, [])
  await visualizeStepsOnGrid(wallsArray, 'wall', 2)
  return wallsArray;
};

export default RecursiveDivisionMaze;
