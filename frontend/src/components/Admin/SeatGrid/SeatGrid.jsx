import React, { useState, useRef } from "react";

const SeatGrid = () => {
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [grid, setGrid] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ start: null, end: null });
  const [editMode, setEditMode] = useState({ row: null, col: null });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDeselecting, setIsDeselecting] = useState(false); // New flag for deselection mode
  const gridRef = useRef(null);

  // Create a grid with all seats unselected initially
  const createGrid = () => {
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push({ name: "", selected: false, editable: false });
      }
      newGrid.push(row);
    }
    saveToHistory(newGrid); // Save initial grid to history
    setGrid(newGrid);
  };

  // Save the current state of the grid to the history stack
  const saveToHistory = (newGrid) => {
    setHistory([...history, JSON.parse(JSON.stringify(newGrid))]); // Deep copy the grid
    setRedoStack([]); // Clear redo stack on new action
  };

  // Undo the last action
  const undo = () => {
    if (history.length > 1) {
      const previousHistory = [...history];
      const lastGrid = previousHistory.pop();
      setRedoStack([grid, ...redoStack]);
      setGrid(previousHistory[previousHistory.length - 1]);
      setHistory(previousHistory);
    }
  };

  // Redo the last undone action
  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextGrid = newRedoStack.shift();
      setHistory([...history, grid]);
      setGrid(nextGrid);
      setRedoStack(newRedoStack);
    }
  };

  // Reset all seats to selected
  const resetGrid = () => {
    const newGrid = grid.map(row =>
      row.map(seat => ({ ...seat, selected: true }))
    );
    updateSeatNames(newGrid); // Update names based on selection
    saveToHistory(newGrid); // Save state before resetting
    setGrid(newGrid);
  };

  // Update seat names based on selection
  const updateSeatNames = (gridToUpdate = grid) => {
    const updatedGrid = [...gridToUpdate];
    updatedGrid.forEach((row, rowIdx) => {
      const selectedSeats = row.filter(seat => seat.selected && !seat.editable);
      selectedSeats.forEach((seat, index) => {
        seat.name = `${String.fromCharCode(65 + rowIdx)}${index + 1}`;
      });
      row.forEach((seat, index) => {
        if (!seat.selected && !seat.editable) {
          seat.name = "";
        }
      });
    });
    setGrid(updatedGrid);
  };

  // Toggle or rename seat on click
  const toggleSeat = (rowIdx, colIdx) => {
    const updatedGrid = [...grid];
    const seat = updatedGrid[rowIdx][colIdx];
    seat.selected = !seat.selected;
    if (seat.selected) {
      seat.editable = false;
    }
    updateSeatNames();
    saveToHistory(updatedGrid);
    setGrid(updatedGrid);
  };

  // Handle mouse events for multi-seat selection and deselection
  const handleMouseDown = (e, rowIdx, colIdx) => {
    e.preventDefault();
    const seat = grid[rowIdx][colIdx];
    setIsSelecting(true);
    setSelection({ start: { rowIdx, colIdx }, end: { rowIdx, colIdx } });
    setIsDeselecting(seat.selected); // If seat is already selected, enter deselection mode
  };

  const handleMouseMove = (e, rowIdx, colIdx) => {
    if (isSelecting) {
      setSelection(prev => ({ ...prev, end: { rowIdx, colIdx } }));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      const { start, end } = selection;
      const updatedGrid = [...grid];
      for (let i = Math.min(start.rowIdx, end.rowIdx); i <= Math.max(start.rowIdx, end.rowIdx); i++) {
        for (let j = Math.min(start.colIdx, end.colIdx); j <= Math.max(start.colIdx, end.colIdx); j++) {
          const seat = updatedGrid[i][j];
          seat.selected = isDeselecting ? false : true;
        }
      }
      updateSeatNames(updatedGrid);
      saveToHistory(updatedGrid);
      setGrid(updatedGrid);
      setIsSelecting(false);
    }
  };

  // Handle double click to edit seat name
  const handleDoubleClick = (rowIdx, colIdx) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIdx][colIdx].editable = true;
    setGrid(updatedGrid);
    setEditMode({ row: rowIdx, col: colIdx });
  };

  // Handle change in seat name input
  const handleNameChange = (e, rowIdx, colIdx) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIdx][colIdx].name = e.target.value;
    setGrid(updatedGrid);
  };

  // Handle blur event to save seat name and exit edit mode
  const handleBlur = () => {
    if (editMode.row !== null && editMode.col !== null) {
      const updatedGrid = [...grid];
      updatedGrid[editMode.row][editMode.col].editable = false;
      setGrid(updatedGrid);
      setEditMode({ row: null, col: null });
    }
  };

  // Log the grid data to the console
  const saveGrid = () => {
    console.log("Grid Data:", JSON.stringify(grid, null, 2));
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="number"
          placeholder="Number of Rows"
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          placeholder="Number of Columns"
          value={columns}
          onChange={(e) => setColumns(parseInt(e.target.value))}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-300"
        />
        <button
          onClick={createGrid}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Grid
        </button>
      </div>

      <div>
        {grid.length > 0 && (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, 30px)`, // Fixed column width
              gap: '0px' // No gaps between cells
            }}
            ref={gridRef}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsSelecting(false)} // Stop selection if mouse leaves the grid
          >
            {grid.map((row, rowIdx) => (
              row.map((seat, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  onMouseDown={(e) => handleMouseDown(e, rowIdx, colIdx)}
                  onMouseMove={(e) => handleMouseMove(e, rowIdx, colIdx)}
                  onDoubleClick={() => handleDoubleClick(rowIdx, colIdx)}
                  className={`flex items-center justify-center border rounded-lg cursor-pointer transition duration-300
                    ${seat.selected ? "bg-green-400" : "bg-gray-200"}
                    hover:bg-blue-200`}
                  style={{ width: '30px', height: '30px', fontSize: '10px' }} // Smaller size and font
                >
                  {seat.editable ? (
                    <input
                      type="text"
                      value={seat.name}
                      onChange={(e) => handleNameChange(e, rowIdx, colIdx)}
                      onBlur={handleBlur}
                      autoFocus
                      className="w-full h-full text-center border-none outline-none bg-transparent"
                    />
                  ) : (
                    seat.name
                  )}
                </div>
              ))
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={undo}
          disabled={history.length <= 1}
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Redo
        </button>
        <button
          onClick={resetGrid}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Reset
        </button>
        <button
          onClick={saveGrid}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          Save Grid
        </button>
      </div>
    </div>
  );
};

export default SeatGrid;
