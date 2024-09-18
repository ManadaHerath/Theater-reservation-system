import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
const SeatGrid = () => {
  const { theatreId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [grid, setGrid] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ start: null, end: null });
  const [editMode, setEditMode] = useState({ row: null, col: null });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDeselecting, setIsDeselecting] = useState(false);
  const [screenPosition, setScreenPosition] = useState("top");
  const [dragging, setDragging] = useState(null); // Track dragging
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/grid/gettheatregrid/${theatreId}`);
        if (response.data) {
          setRows(response.data.grid.length);
          setColumns(response.data.grid[0]?.length || 0);
          createGrid();
          setGrid(response.data.grid);
          setSeatTypes(response.data.seat_types);
          setScreenPosition(response.data.screen_position || "top");

          saveToHistory(grid); // Save fetched grid to history
        }
      } catch (error) {
        console.error("Error fetching grid data:", error);
      }
    };
  
    fetchGridData();
  }, [theatreId]);


  


  const createGrid = () => {
    const newGrid = [];
    const newSeatTypes = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      newSeatTypes.push({ type: "", price: "" });
      for (let j = 0; j < columns; j++) {
        row.push({ name: "", selected: false, editable: false });
      }
      newGrid.push(row);
    }
    console.log("Created Grid:", newGrid); // Debugging
    saveToHistory(newGrid);
    setGrid(newGrid);
    setSeatTypes(newSeatTypes);
  };

  const saveToHistory = (newGrid) => {
    setHistory([...history, JSON.parse(JSON.stringify(newGrid))]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length > 1) {
      const previousHistory = [...history];
      const lastGrid = previousHistory.pop();
      setRedoStack([grid, ...redoStack]);
      setGrid(previousHistory[previousHistory.length - 1]);
      setHistory(previousHistory);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextGrid = newRedoStack.shift();
      setHistory([...history, grid]);
      setGrid(nextGrid);
      setRedoStack(newRedoStack);
    }
  };

  const resetGrid = () => {
    const newGrid = grid.map(row =>
      row.map(seat => ({ ...seat, selected: true }))
    );
    updateSeatNames(newGrid);
    saveToHistory(newGrid);
    setGrid(newGrid);
  };

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

  const handleMouseDown = (e, rowIdx, colIdx) => {
    e.preventDefault();
    const seat = grid[rowIdx][colIdx];
    setIsSelecting(true);
    setSelection({ start: { rowIdx, colIdx }, end: { rowIdx, colIdx } });
    setIsDeselecting(seat.selected);
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

  const handleDoubleClick = (rowIdx, colIdx) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIdx][colIdx].editable = true;
    setGrid(updatedGrid);
    setEditMode({ row: rowIdx, col: colIdx });
  };

  const handleNameChange = (e, rowIdx, colIdx) => {
    const updatedGrid = [...grid];
    updatedGrid[rowIdx][colIdx].name = e.target.value;
    setGrid(updatedGrid);
  };

  const handleBlur = () => {
    if (editMode.row !== null && editMode.col !== null) {
      const updatedGrid = [...grid];
      updatedGrid[editMode.row][editMode.col].editable = false;
      setGrid(updatedGrid);
      setEditMode({ row: null, col: null });
    }
  };

  const handleSeatTypeChange = (e, rowIdx, field) => {
    const updatedSeatTypes = [...seatTypes];
    updatedSeatTypes[rowIdx][field] = e.target.value;
    setSeatTypes(updatedSeatTypes);
  };

  const handleDragStart = (rowIdx, field) => {
    setDragging({ rowIdx, field, value: seatTypes[rowIdx][field] });
  };

  const handleDragOver = (e, rowIdx) => {
    e.preventDefault();
    if (dragging) {
      const updatedSeatTypes = [...seatTypes];
      updatedSeatTypes[rowIdx][dragging.field] = dragging.value;
      setSeatTypes(updatedSeatTypes);
    }
  };

  const handleDrop = (e, rowIdx) => {
    e.preventDefault();
    if (dragging) {
      const updatedSeatTypes = [...seatTypes];
      updatedSeatTypes[rowIdx][dragging.field] = dragging.value;
      setSeatTypes(updatedSeatTypes);
      setDragging(null); // Clear the dragging state
    }
  };

  const saveGrid = async () => {
    const gridData = {
      grid,
      seatTypes,
      screenPosition,
      theatre_id: theatreId
    };
    console.log("Grid Data:", JSON.stringify(gridData, null, 2));
    try {
      const response = await axios.post('http://localhost:5001/grid/addtheatregrid', gridData);
      navigate(`/admin`);

    } catch (error) {
      console.error('Error saving grid data:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label>Screen Position: </label>
        <select
          value={screenPosition}
          onChange={(e) => setScreenPosition(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
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

      {/*  */}

      <div className="flex">
        <div>
          {grid.length > 0 && (
            <>
              {/* <div
                className={`screen-indicator ${screenPosition === "top" ? "mb-2" : "mt-2"}`}
                style={{
                  textAlign: screenPosition === "left" ? "left" : "center",
                }}
              >
                Screen
              </div> */}

              <div
                className="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 30px)`,
                  gap: '0px'
                }}
                ref={gridRef}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsSelecting(false)}
              >
                {grid.map((row, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    {row.map((seat, colIdx) => (
                      <div
                        key={colIdx}
                        onMouseDown={(e) => handleMouseDown(e, rowIdx, colIdx)}
                        onMouseMove={(e) => handleMouseMove(e, rowIdx, colIdx)}
                        onDoubleClick={() => handleDoubleClick(rowIdx, colIdx)}
                        className={`flex items-center justify-center border rounded-lg cursor-pointer transition duration-300
                          ${seat.selected ? "bg-green-400" : "bg-gray-200"}
                          hover:bg-blue-200`}
                        style={{ width: '30px', height: '30px', fontSize: '10px' }}
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
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="ml-4">
          {grid.length > 0 && (
            <div>
              {grid.length > 0 && (
  <div className="ml-4">
    <div className="grid grid-cols-[repeat(columns, 1fr)] gap-0">
      {seatTypes.map((seatType, rowIdx) => (
        <div key={rowIdx} className="flex space-x-2 mb-1">
          <input
            type="text"
            placeholder="Seat Type"
            value={seatType.type}
            onChange={(e) => handleSeatTypeChange(e, rowIdx, "type")}
            className="border border-gray-300 p-1 rounded-md"
            style={{ height: "26.14px" }}
            draggable
            onDragStart={() => handleDragStart(rowIdx, "type")}
            onDragOver={(e) => handleDragOver(e, rowIdx)}
            onDrop={(e) => handleDrop(e, rowIdx)}
          />
          <input
            type="text"
            placeholder="Price"
            value={seatType.price}
            onChange={(e) => handleSeatTypeChange(e, rowIdx, "price")}
            className="border border-gray-300 p-1 rounded-md"
            style={{ height: "26.14px" }}
            draggable
            onDragStart={() => handleDragStart(rowIdx, "price")}
            onDragOver={(e) => handleDragOver(e, rowIdx)}
            onDrop={(e) => handleDrop(e, rowIdx)}
          />
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={undo}
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-300 mr-2"
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-300 mr-2"
        >
          Redo
        </button>
        <button
          onClick={resetGrid}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Reset Grid
        </button>
        <button
          onClick={saveGrid}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300 ml-2"
        >
          Save Grid
        </button>
      </div>
    </div>
  );
};

export default SeatGrid;
