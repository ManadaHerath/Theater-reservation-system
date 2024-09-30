import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';

const SeatGridUser = () => {
  const { showId, theatreId } = useParams();
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [purchasedSeats, setPurchasedSeats] = useState([]); // To track seats already purchased
  const [seatTypes, setSeatTypes] = useState([]);
  const [screenPosition, setScreenPosition] = useState('');
  const [clicked, setClicked] = useState(false);

  // Fetch grid data
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

  // Fetch purchased seats
  useEffect(() => {
    const fetchPurchasedSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/purchased_seats/${theatreId}/${showId}`
        );
        const purchasedSeats = response.data
          .map((purchase) => purchase.seats.split(","))
          .flat();
        setPurchasedSeats(purchasedSeats);
      } catch (err) {
        console.error("Error fetching purchased seats:", err);
      }
    };

    fetchPurchasedSeats();
  }, [theatreId, showId]);

  // Handle seat click
  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat.name)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.name));
    } else {
      setSelectedSeats([...selectedSeats, seat.name]);
    }
  };

  useEffect(() => {
    const postSelectedSeats = async () => {
      try {
        const temp = await axios.post("http://localhost:5001/temp_purchase", {
          theatre_id: theatreId,
          show_time_id: showId,
          seats: selectedSeats.join(","),
        });
      } catch (error) {
        console.error("Error saving temp purchase:", error);
      }
    };

    if (clicked) {
      postSelectedSeats();
    }
  });

  // Calculate total price of selected seats
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatName) => {
      const seatIndex = gridData.grid.findIndex(row => 
        row.some(seat => seat.name === seatName)
      );
      if (seatIndex !== -1) {
        const seatType = seatTypes[seatIndex]; // Get the seat type based on row index
        return total + parseFloat(seatType.price); // Add the price of the seat
      }
      return total; // If seat not found, return total
    }, 0).toFixed(2); // Return total price fixed to 2 decimal places
  };

  // Handle buy click
  const handleBuyClick = async () => {
    setClicked(true);

    const purchaseDetails = {
      selectedSeats: selectedSeats.map((seatName) => {
        return {
          seat_label: seatName,
        };
      }),
      theatreId,
      showId,
    };
    console.log('purchaseDetails:', purchaseDetails);

    const stripe = await loadStripe('pk_test_51PTpvf09I3fN7mCT7vXxyWe679a3SVfurihlsN1HlkS3WPffQW9uKyvmRnXv5xyyikN9TFMkFsYUyUjDYKOAzclw003rvNg99T');

    try {
      const response = await axios.post('http://localhost:5001/stripe/create-checkout-session', {
        ...purchaseDetails,
        metadata: {
          seats: selectedSeats.join(', '), // Join seat names as a string to show in Stripe
        },
      });

      const { id: sessionId } = response.data;

      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        console.error('Error redirecting to checkout:', result.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
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
            <div className="relative group flex items-center">
              <div className="absolute -left-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-bold">{seatTypes[rowIndex]?.type}</div>
                <div className="text-xs font-bold mt-1">${seatTypes[rowIndex]?.price}</div>
              </div>

              {row.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className={`w-10 h-10 flex items-center justify-center 
                    ${seat.selected ? (purchasedSeats.includes(seat.name) ? 'bg-red-300 text-gray-600' : (selectedSeats.includes(seat.name) ? 'bg-green-500 text-white' : 'bg-gray-500 text-white')) : 'bg-transparent'}
                    ${purchasedSeats.includes(seat.name) ? 'cursor-not-allowed' : (seat.selected ? 'cursor-pointer' : 'cursor-default')}
                    ${seat.selected ? 'border border-black' : 'border-0'}
                    m-1`}
                  onClick={() => seat.selected && !purchasedSeats.includes(seat.name) && handleSeatClick(seat)}
                >
                  {seat.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total Price Display */}
      <div className="mt-4 text-xl font-bold">
        Total Price: ${calculateTotalPrice()}
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
