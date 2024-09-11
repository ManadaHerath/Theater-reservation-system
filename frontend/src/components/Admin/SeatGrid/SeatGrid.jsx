import React, { useState, useRef } from "react";

const SeatGrid = () => {
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [grid, setGrid] = useState([]);
  const [edit, setEdit] = useState({ rowIdx: null, colIdx: null, type: null });
  const [inputValue, setInputValue] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ start: null, end: null });
  const gridRef = useRef(null);

  // Create a grid with default seat names
  const createGrid = () => {
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push({ name: `${String.fromCharCode(65 + i)}${j + 1}`, selected: false });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  // Toggle seat selection
  const toggleSeat = (rowIdx, colIdx) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIdx][colIdx].selected = !updatedGrid[rowIdx][colIdx].selected;
    setGrid(updatedGrid);
  };

  // Start editing a seat name on double-click
  const handleDoubleClick = (rowIdx, colIdx) => {
    setEdit({ rowIdx, colIdx, type: 'seat' });
    setInputValue(grid[rowIdx][colIdx].name);
  };

  // Handle input change for seat names, row names, and column names
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Save the edited seat name, row name, or column name and exit editing mode
  const handleInputBlur = () => {
    const { rowIdx, colIdx, type } = edit;
    const updatedGrid = [...grid];

    if (type === 'seat') {
      updatedGrid[rowIdx][colIdx].name = inputValue;
    } else if (type === 'row') {
      updatedGrid[rowIdx] = updatedGrid[rowIdx].map(seat => ({
        ...seat,
        name: seat.name.replace(/^[A-Z]/, inputValue.charAt(0))
      }));
    } else if (type === 'column') {
      updatedGrid.forEach(row => {
        row[colIdx].name = inputValue;
      });
    }

    setGrid(updatedGrid);
    setEdit({ rowIdx: null, colIdx: null, type: null });
  };

  // Handle mouse events for multi-seat selection
  const handleMouseDown = (e, rowIdx, colIdx) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelection({ start: { rowIdx, colIdx }, end: { rowIdx, colIdx } });
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
          updatedGrid[i][j].selected = true;
        }
      }
      setGrid(updatedGrid);
      setIsSelecting(false);
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
                  onClick={() => toggleSeat(rowIdx, colIdx)}
                  style={{ width: '30px', height: '30px', fontSize: '10px' }} // Smaller size and font
                >
                  {edit.rowIdx === rowIdx && edit.colIdx === colIdx ? (
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className="w-full h-full text-center border-none"
                      autoFocus
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

      <div className="mt-4">
        {grid.length > 0 && (
          <button
            onClick={saveGrid}
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Save Grid
          </button>
        )}
      </div>
    </div>
  );
};

export default SeatGrid;
