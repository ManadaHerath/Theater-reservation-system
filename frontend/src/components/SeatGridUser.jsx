import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatGridUser = ({ theatreId }) => {
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [screenPosition, setScreenPosition] = useState('');

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/grid/gettheatregrid/${theatreId}`);
        
        if (response.data) {
          setGridData(response.data);
          setLoading(false);
          setSeatTypes(response.data.seat_types);
          setScreenPosition(response.data.screen_position);
        }
      } catch (error) {
        console.error('Error fetching grid data:', error);
      }
    };

    fetchGridData();
  }, [theatreId]);

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat.name)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.name));
    } else {
      setSelectedSeats([...selectedSeats, seat.name]);
    }
  };

  const handleBuyClick = () => {
    const seatPrices = selectedSeats.map((seatName,rowIndex) => {
      return {
        name: seatName,
        price: seatTypes[rowIndex].price
      };
    });

    console.log('Selected seats with prices:', seatPrices);
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* Screen Position Label */}
      <div className={`text-xl font-bold mb-4 ${screenPosition === 'top' ? 'mt-4' : 'mb-4'}`}>
        Screen {screenPosition}
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center">
        {gridData.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center">
            {/* Row Information */}
            <div className="relative group flex items-center">
              <div className="absolute -left-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-bold">{seatTypes[rowIndex]?.type}</div>
                <div className="text-xs font-bold mt-1">${seatTypes[rowIndex]?.price}</div>
              </div>

              {row.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className={`w-10 h-10 flex items-center justify-center 
                    ${seat.selected ? (selectedSeats.includes(seat.name,rowIndex) ? 'bg-green-500 text-white' : 'bg-gray-500 text-white') : 'bg-transparent'}
                    ${seat.selected ? 'cursor-pointer' : 'cursor-default'}
                    ${seat.selected ? 'border border-black' : 'border-0'}
                    m-1`}
                  onClick={() => seat.selected && handleSeatClick(seat)}
                >
                  {seat.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuyClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
      >
        Buy
      </button>
    </div>
  );
};

export default SeatGridUser;
