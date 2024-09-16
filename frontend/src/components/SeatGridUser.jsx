import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatGridUser = ({ theatreId }) => {
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/grid/gettheatregrid/${theatreId}`);
        
        if(response.data) {
          setGridData(response.data);
          setLoading(false);
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
    console.log('Selected seats:', selectedSeats);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {gridData.grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((seat, seatIndex) => (
            <div
              key={seatIndex}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: seat.selected ? (selectedSeats.includes(seat.name) ? 'green' : 'grey') : 'transparent',
                border: '1px solid black',
                cursor: seat.selected ? 'pointer' : 'default',
                margin: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: seat.selected ? 'white' : 'transparent',
              }}
              onClick={() => seat.selected && handleSeatClick(seat)}
            >
              {seat.name}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleBuyClick}>Buy</button>
    </div>
  );
};

export default SeatGridUser;
