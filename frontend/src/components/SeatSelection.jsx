import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useFetch from '../hooks/useFetch';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';


const stripePromise = loadStripe('pk_test_51PTpvf09I3fN7mCT7vXxyWe679a3SVfurihlsN1HlkS3WPffQW9uKyvmRnXv5xyyikN9TFMkFsYUyUjDYKOAzclw003rvNg99T');


const SeatSelection = () => {
  const { showId, theatreId } = useParams();
  const { data: theatreData, loading: theatreLoading, error: theatreError } = useFetch(`http://localhost:5001/theatres/${theatreId}`);
  const { data: rowsData, loading: rowsLoading, error: rowsError } = useFetch(`http://localhost:5001/rows/getrows/${theatreId}`);
  const { data: seatTypesData, loading: seatTypesLoading, error: seatTypesError } = useFetch(`http://localhost:5001/seat_types`);
  const [seatsData, setSeatsData] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [seatsError, setSeatsError] = useState(null);
  const [purchasedSeats, setPurchasedSeats] = useState([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchSeatsData = async () => {
      if (rowsData) {
        try {
          const seatsPromises = rowsData.map(row => axios.get(`http://localhost:5001/rows/getseats/${row.id}`));
          const seatsResults = await Promise.all(seatsPromises);
          const seats = seatsResults.reduce((acc, result, index) => {
            acc[rowsData[index].id] = result.data;
            return acc;
          }, {});
          setSeatsData(seats);
        } catch (err) {
          setSeatsError(err);
        } finally {
          setSeatsLoading(false);
        }
      }
    };

    fetchSeatsData();
  }, [rowsData]);

  useEffect(() => {
    const fetchPurchasedSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/purchased_seats/${theatreId}/${showId}`);
        const purchasedSeats = response.data.map(purchase => purchase.seats.split(',')).flat();
        setPurchasedSeats(purchasedSeats);
      } catch (err) {
        console.error('Error fetching purchased seats:', err);
      }
    };

  console.log(purchasedSeats)  

    fetchPurchasedSeats();
  }, [theatreId, showId]);

  const handleSeatClick = (seat) => {
    if (purchasedSeats.includes(seat)) {
      alert('This seat is already purchased. Please select another seat.');
      return;
    }

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
      setPaymentModalOpen(true);
    } catch (err) {
      console.error('Error purchasing seats:', err);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const bookingResponse = await axios.post('http://localhost:5001/purchased_seats', {
        theatre_id: theatreId,
        show_time_id: showId,
        seats: selectedSeats.join(','),
      });

      if (bookingResponse.data.success) {
        alert('Payment successful and seats booked!');
        // Additional logic after successful booking
      }
    } catch (err) {
      console.error('Error finalizing booking:', err);
    }
  };

  if (theatreLoading || rowsLoading || seatsLoading || seatTypesLoading) return <p>Loading...</p>;
  // if (theatreError) return <p>Error loading theatre data: {theatreError.message}</p>;
  // if (rowsError) return <p>Error loading rows data: {rowsError.message}</p>;
  // if (seatsError) return <p>Error loading seats data: {seatsError.message}</p>;
  // if (seatTypesError) return <p>Error loading seat types data: {seatTypesError.message}</p>;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="container mx-auto p-6 flex-grow">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-600">Select Your Seats</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="grid grid-cols-1 gap-2">
            {seatTypesData.map(seatType => (
              <div key={seatType.id}>
                <h3 className="text-xl font-bold mb-2">{seatType.type_name}</h3>
                {rowsData
                  .filter(row => seatsData[row.id] && seatsData[row.id][0]?.seat_type_id === seatType.id)
                  .map(row => (
                    <div key={row.id} className="flex flex-row justify-center space-x-2">
                      {(seatsData[row.id] || []).map((seat, index) => {
                        const seatLabel = `${row.row_label}${seat.seat_number}`;
                        const isSelected = selectedSeats.includes(seatLabel);
                        const isPurchased = purchasedSeats.includes(seatLabel);

                        return (
                          <React.Fragment key={seat.id}>
                            {index === Math.floor(seatsData[row.id].length / 2) && (
                              <div className="w-4"></div> // Road space divider
                            )}
                            <div
                              className={`border p-3 rounded-md shadow-lg cursor-pointer transform transition-transform duration-200 ${
                                isPurchased ? 'bg-gray-300 cursor-not-allowed' : isSelected ? 'bg-green-500' : 'bg-white'
                              }`}
                              style={{ width: '3rem', height: '3rem', minWidth: '3rem', minHeight: '3rem' }} // Fixed size for all seat boxes
                              onClick={() => !isPurchased && handleSeatClick(seatLabel)} // Disable click if purchased
                            >
                              {seatLabel}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                <div className="mt-4 w-full h-px bg-gray-400"></div> {/* Row type divider */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-100">
        <button
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors duration-200"
          onClick={handleBuyClick}
        >
          Buy Selected Seats
        </button>
      </div>
      </div>
  );
};

export default SeatSelection;