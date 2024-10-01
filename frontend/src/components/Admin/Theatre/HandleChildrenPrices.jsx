import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";
import { useParams } from "react-router-dom";

const HandleChildrenPrices = () => {
  const { theatreId } = useParams();
  const [seatTypes, setSeatTypes] = useState([]);
  const [distinctSeatTypes, setDistinctSeatTypes] = useState([]);

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5001/grid/gettheatregrid/${theatreId}`
        );
        if (response.data) {
          const seatTypes = response.data.seat_types.map((seat) => ({
            ...seat,
            childrenprice: seat.childrenprice || "", // Ensure childrenprice is initialized
          }));

          // Filter distinct seat types
          const uniqueSeatTypes = [];
          const seatTypeMap = new Map();

          seatTypes.forEach((seat) => {
            if (!seatTypeMap.has(seat.type)) {
              seatTypeMap.set(seat.type, true);
              uniqueSeatTypes.push(seat);
            }
          });

          setSeatTypes(seatTypes);
          setDistinctSeatTypes(uniqueSeatTypes);
        }
      } catch (error) {
        console.error("Error fetching grid data:", error);
      }
    };
    fetchGridData();
  }, [theatreId]);

  // Handle children price input change for all seats of the same type
  const handleChildrenPriceChange = (type, value) => {
    const updatedSeatTypes = seatTypes.map((seat) => {
      if (seat.type === type) {
        return { ...seat, childrenprice: value };
      }
      return seat;
    });

    setSeatTypes(updatedSeatTypes);
    setDistinctSeatTypes(
      distinctSeatTypes.map((seat) =>
        seat.type === type ? { ...seat, childrenprice: value } : seat
      )
    );
  };

  // Handle console log of the updated seat types
  const handleLogSeatTypes = () => {
    console.log(seatTypes);
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Handle Children Prices</h1>

      <table className="table-auto w-full text-white">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Children Price</th>
          </tr>
        </thead>
        <tbody>
          {distinctSeatTypes.map((seat, index) => (
            <tr key={index} className="bg-blue-800">
              <td className="border px-4 py-2">{seat.type}</td>
              <td className="border px-4 py-2">{seat.price}</td>
              <td className="border px-4 py-2">
                <input
                  className="bg-gray-600 text-white px-2 py-1 rounded"
                  type="number"
                  placeholder="Children Price"
                  value={seat.childrenprice || ""}
                  onChange={(e) =>
                    handleChildrenPriceChange(seat.type, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleLogSeatTypes}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
      >
        Log Updated Prices
      </button>
    </div>
  );
};

export default HandleChildrenPrices;
