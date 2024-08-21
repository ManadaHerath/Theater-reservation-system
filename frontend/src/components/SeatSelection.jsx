import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFetch from '../hooks/useFetch';
import { loadStripe } from '@stripe/stripe-js';
import useAuth from "../hooks/useAuth";





const SeatSelection = () => {
  const navigate =  useNavigate();
  const { user } = useAuth();
  console.log("UserYO",user);


  const { showId, theatreId } = useParams();
  const { data: theatreData, loading: theatreLoading, error: theatreError } = useFetch(`http://localhost:5001/theatres/${theatreId}`);
  const { data: rowsData, loading: rowsLoading, error: rowsError } = useFetch(`http://localhost:5001/rows/getrows/${theatreId}`);
  const { data: seatTypesData, loading: seatTypesLoading, error: seatTypesError } = useFetch(`http://localhost:5001/seat_types/types/${theatreId}`);
  const { data: priceCategoriesData, loading: priceCategoriesLoading, error: priceCategoriesError } = useFetch('http://localhost:5001/seat_types/prices');


  const [seatsData, setSeatsData] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [seatsError, setSeatsError] = useState(null);
  const [purchasedSeats, setPurchasedSeats] = useState([]);
  const [clicked, setClicked] = useState(false);
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

  useEffect(()=>{
    const postSelectedSeats = async () => {
        try {
          const temp = await axios.post('http://localhost:5001/temp_purchase', {
            theatre_id: theatreId,
            show_time_id: showId,
            seats: selectedSeats.join(',')
          });
      }catch(error){
          console.error('Error saving temp purchase:', error);
          // Handle the error (e.g., offer a retry, notify the user)
        }
    }
    postSelectedSeats();
    
  },[clicked])


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

      setClicked(true);
      const seatTypeCounts = selectedSeats.reduce((acc, seatLabel) => {
        const row = rowsData.find((row) => seatLabel.startsWith(row.row_label));
        if (!row) {
          console.error(`Row not found for seat label: ${seatLabel}`);
          return acc;
        }
        const seat = seatsData[row.id].find((s) => `${row.row_label}${s.seat_number}` === seatLabel);
        if (!seat) {
          console.error(`Seat not found for seat label: ${seatLabel}`);
          return acc;
        }
        const seatType = seatTypesData.find((type) => type.id === seat.seat_type_id);
        if (!seatType) {
          console.error(`Seat type not found for seat: ${seat}`);
          return acc;
        }
  
        acc[seatType.type_name] = (acc[seatType.type_name] || 0) + 1;
        return acc;
      }, {});
  
      const seatTypePrices = priceCategoriesData.reduce((acc, category) => {
        acc[category.category_name] = parseFloat(category.price); // Ensure price is a number
        return acc;
      }, {});
  
      const totalPrice = selectedSeats.reduce((total, seatLabel) => {
        const row = rowsData.find((row) => seatLabel.startsWith(row.row_label));
        if (!row) {
          console.error(`Row not found for seat label: ${seatLabel}`);
          return total;
        }
        const seat = seatsData[row.id].find((s) => `${row.row_label}${s.seat_number}` === seatLabel);
        if (!seat) {
          console.error(`Seat not found for seat label: ${seatLabel}`);
          return total;
        }
        const seatType = seatTypesData.find((type) => type.id === seat.seat_type_id);
        if (!seatType) {
          console.error(`Seat type not found for seat: ${seat}`);
          return total;
        }
        const category = priceCategoriesData.find(pc => pc.id === seatType.id); 
        if (!category) {
          console.error(`Price category not found for seat type: ${seatType.type_name}`);
          return total;
        }
        return total + (seatTypePrices[category.category_name] || 0);
      }, 0);
  
      if (isNaN(totalPrice)) {
        throw new Error('Total price calculation resulted in NaN');
      }
  
      const purchaseDetails = {
        selectedSeats: selectedSeats.map(seatLabel => {
          const row = rowsData.find((row) => seatLabel.startsWith(row.row_label));
          const seat = seatsData[row.id].find((s) => `${row.row_label}${s.seat_number}` === seatLabel);
          const seatType = seatTypesData.find((type) => type.id === seat.seat_type_id);
          const category = priceCategoriesData.find(pc => pc.id === seatType.id);
          
          return {
            seat_label: seatLabel,
            seat_type: seatType.type_name,
            price: seatTypePrices[category.category_name]
          };
        }),
        seatTypeCounts,
        totalPrice: totalPrice.toFixed(2),
        theatreId, // Add theatreId
        showId // Format totalPrice to two decimal places
      };

      const stripe = await loadStripe('pk_test_51PTpvf09I3fN7mCT7vXxyWe679a3SVfurihlsN1HlkS3WPffQW9uKyvmRnXv5xyyikN9TFMkFsYUyUjDYKOAzclw003rvNg99T');
      
      const response = await axios.post('http://localhost:5001/stripe/create-checkout-session', purchaseDetails);
  
      const { id: sessionId } = response.data;
  
      const result = await stripe.redirectToCheckout({
        sessionId,
      });
      if (!result.error) {
        // Payment Successful
        console.log("nice")
      } else {
        console.error('Error redirecting to checkout:', result.error);
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
        <div className="p-6 bg-gray-100">
        <button
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors duration-200"
          onClick={handleBuyClick}
        >
          Buy Selected Seats
        </button>
      </div>
      </div>
      
      </div>
  );
};

export default SeatSelection;
