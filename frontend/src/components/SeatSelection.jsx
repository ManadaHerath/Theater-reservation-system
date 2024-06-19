import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useFetch from '../hooks/useFetch'; // Import your custom hook

const SeatSelection = () => {
  const { showId, theatreId } = useParams();
  const { data: theatreData, loading, error } = useFetch(`http://localhost:5001/theatres/${theatreId}`);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // This useEffect will run when theatreData is fetched
  useEffect(() => {
    if (theatreData) {
      console.log(theatreData); // For debugging: Remove this line if not needed
    }
  }, [theatreData]);

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBuyClick = async () => {
    try {
      await axios.post('http://localhost:5001/temp_purchase', {
        theatre_id: theatreId,
        show_time_id: showId,
        seats: selectedSeats.join(',')
      });
      alert('Seats selected successfully. Proceeding to payment...');
    } catch (err) {
      console.error('Error purchasing seats:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error.length>0) return <p>Error loading theatre data: {error.message}</p>;

  const { no_of_rows, no_of_columns } = theatreData;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-600">Select Your Seats</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: no_of_rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex flex-row justify-center space-x-2">
              {Array.from({ length: no_of_columns }).map((_, colIndex) => {
                const seat = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                const isSelected = selectedSeats.includes(seat);

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`border p-3 rounded-md shadow-lg cursor-pointer transform transition-transform duration-200 ${
                      isSelected ? 'bg-green-500' : 'bg-white'
                    }`}
                    style={{ width: '3rem', height: '3rem', minWidth: '3rem', minHeight: '3rem' }} // Fixed size for all seat boxes
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 w-full h-px bg-gray-400"></div> {/* Screen line */}
      </div>
      <button
        className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors duration-200"
        onClick={handleBuyClick}
      >
        Buy Selected Seats
      </button>
    </div>
  );
};

export default SeatSelection;
