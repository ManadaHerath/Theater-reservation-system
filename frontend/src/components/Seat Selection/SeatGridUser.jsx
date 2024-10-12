import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import TicketPopup from "./TicketPopup"; // Import the TicketPopup component

const SeatGridUser = () => {
  const { showId, theatreId } = useParams();
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [purchasedSeats, setPurchasedSeats] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [screenPosition, setScreenPosition] = useState("");
  const [clicked, setClicked] = useState(false);
  const [popupOpen, setPopupOpen] = useState(true); // Popup control
  const [ticketDetails, setTicketDetails] = useState({ adults: 0, children: 0 }); // Track number of tickets
  const [totalTickets, setTotalTickets] = useState(0); // Total number of allowed tickets
  
  

  // Fetch grid data
  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await axios.get(
          `/grid/gettheatregrid/${theatreId}`
        );
        if (response.data) {
          setGridData(response.data);
          setLoading(false);
          setSeatTypes(response.data.seat_types);
          setScreenPosition(response.data.screen_position);
        }
      } catch (error) {
        console.error("Error fetching grid data:", error);
      }
    };

    fetchGridData();
  }, [theatreId]);

  // Fetch purchased seats
  useEffect(() => {
    const fetchPurchasedSeats = async () => {
      try {
        const response = await axios.get(
          `/purchased_seats/${theatreId}/${showId}`
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
    if (selectedSeats.length < totalTickets || selectedSeats.some((s) => s.name === seat.name)) {
      if (selectedSeats.some((s) => s.name === seat.name)) {
        // Remove seat if clicked again
        setSelectedSeats(selectedSeats.filter((s) => s.name !== seat.name));
      } else {
        // Add seat if not selected already and within limit
        const remainingAdults = ticketDetails.adults - selectedSeats.filter((s) => s.type === "adult").length;
        const remainingChildren = ticketDetails.children - selectedSeats.filter((s) => s.type === "child").length;

        if (remainingAdults > 0) {
          setSelectedSeats([...selectedSeats, { name: seat.name, type: "adult" }]);
        } else if (remainingChildren > 0) {
          setSelectedSeats([...selectedSeats, { name: seat.name, type: "child" }]);
        }
      }
    }
  };

  // Group rows by seat type
  const groupRowsBySeatType = () => {
    const grouped = [];
    let currentSeatType = null;
    let currentGroup = [];

    gridData.grid.forEach((row, index) => {
      const seatType = seatTypes[index]; // Assuming row index maps to seat type index
      if (seatType.type !== currentSeatType) {
        if (currentGroup.length) {
          grouped.push({ seatType: currentSeatType, rows: currentGroup });
        }
        currentSeatType = seatType.type;
        currentGroup = [row];
      } else {
        currentGroup.push(row);
      }
    });

    if (currentGroup.length) {
      grouped.push({ seatType: currentSeatType, rows: currentGroup });
    }

    return grouped;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedSeats
      .reduce((total, seat) => {
        const seatIndex = gridData.grid.findIndex((row) =>
          row.some((s) => s.name === seat.name)
        );
        if (seatIndex !== -1) {
          const seatType = seatTypes[seatIndex];
          const seatPrice =
            seat.type === "child" && seatType.childrenprice
              ? seatType.childrenprice
              : seatType.price;
          return total + parseFloat(seatPrice);
        }
        return total;
      }, 0)
      .toFixed(2);
  };
  useEffect(() => {
    const postSelectedSeats = async () => {
      try {
        const temp = await axios.post("/temp_purchase", {
          theatre_id: theatreId,
          show_time_id: showId,
          seats: selectedSeats.map(seat => seat.name).join(","),
        });
      } catch (error) {
        console.error("Error saving temp purchase:", error);
      }
    };

    if (clicked) {
      postSelectedSeats();
    }
  });
  // Handle buy click
  const handleBuyClick = async () => {
    setClicked(true);

    const purchaseDetails = {
      selectedSeats: selectedSeats.map((seat) => {
        return {
          seat_label: seat.name,
          price_type: seat.type, // Adult or Child ticket
        };
      }),
      theatreId,
      showId,
    };

    const stripe = await loadStripe('pk_test_51PTpvf09I3fN7mCT7vXxyWe679a3SVfurihlsN1HlkS3WPffQW9uKyvmRnXv5xyyikN9TFMkFsYUyUjDYKOAzclw003rvNg99T');

    try {
      const response = await axios.post(
        "/stripe/create-checkout-session",
        {
          ...purchaseDetails,
          metadata: {
            seats: selectedSeats.map((s) => s.name).join(", "), // Pass seat names to Stripe
          },
        }
      );

      const { id: sessionId } = response.data;

      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Handle ticket selection from popup
  const handleTicketSelection = (adults, children) => {
    setTicketDetails({ adults, children });
    setTotalTickets(adults + children); // Total tickets = adults + children
    setPopupOpen(false); // Close the popup
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  const groupedRows = groupRowsBySeatType();
  const groupedTickets = seatTypes.reduce((acc, current) => {
    const found = acc.find(item => item.type === current.type);
    if (!found) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <div>
      <NavBar />

      <div className="flex flex-col items-center p-4 lg:my-16 my-8">
        <div className="flex flex-col items-center w-full max-w-3xl">
          {/* Ticket Popup */}
          {popupOpen && (
          <div className="absolute top-0 left-0 right-0 z-50 flex justify-center">
            <TicketPopup onSubmit={handleTicketSelection} />
          </div>
        )}

          {/* Conditionally render the rest of the UI after popup is confirmed */}
          {!popupOpen && (
            <>
              {/* Screen Indicator */}
              {screenPosition === "top" && (
                <div className="flex items-center w-full my-4">
                  <div className="flex-grow border-t-4 border-blue-500"></div>
                  <div className="mx-4 text-white font-bold">Screen</div>
                  <div className="flex-grow border-t-4 border-blue-500"></div>
                </div>
              )}

              {/* Seat Grid */}
              {groupedRows.map((group, groupIndex) => (
                <div key={groupIndex} className="w-full mb-4">
                  {/* Seat Type Header */}
                  <div className="bg-blue-500 text-white text-md lg:text-lg font-bold p-1 rounded-md text-center">
                    {group.seatType} - ${groupedTickets[groupIndex]?.price}
                    {groupedTickets[groupIndex]?.childrenprice && (
                      <span className="text-sm ml-2">
                        (Children Price: ${groupedTickets[groupIndex].childrenprice})
                      </span>
                    )}
                  </div>

                  {/* Seat Rows */}
                  {group.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-center">
                      {row.map((seat, seatIndex) => (
                        <div key={seatIndex} className="relative">
                          <div
                            className={`w-7 h-7 lg:w-10 lg:h-10 text-xs lg:text-base flex items-center justify-center
                            ${seat.selected ? purchasedSeats.includes(seat.name)
                              ? "bg-red-500 text-gray-200 font-bold"
                              : selectedSeats.some((s) => s.name === seat.name)
                              ? "bg-green-500 text-white border-2 border-white"
                              : "bg-black text-white font-bold border-2 border-blue-600 cursor-pointer"
                              : "bg-transparent"}
                            ${purchasedSeats.includes(seat.name) ? "cursor-not-allowed" : "cursor-pointer"}
                            m-1`}
                            onClick={() =>
                              seat.selected &&
                              !purchasedSeats.includes(seat.name) &&
                              handleSeatClick(seat)
                            }
                          >
                            {seat.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}

              {screenPosition === "bottom" && (
                <div className="flex items-center w-full my-4">
                  <div className="flex-grow border-t-4 border-blue-500"></div>
                  <div className="mx-4 text-white font-bold">Screen</div>
                  <div className="flex-grow border-t-4 border-blue-500"></div>
                </div>
              )}

              {/* Total Price Display */}
              <div className="mt-4 text-base lg:text-xl font-bold text-white">
                Total Price: ${calculateTotalPrice()}
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyClick}
                className="mt-5 px-4 lg:px-10 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300"
                disabled={clicked}
              >
                Buy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatGridUser;
