import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const HandleChildrenPrices = () => {
  const { theatreId } = useParams();
  const navigate = useNavigate();
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
            childrenprice: seat.childrenprice || "", // Initialize childrenprice if not present
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

  // Handle the submission of updated seat types to the backend
  const handleUpdateSeatTypes = async () => {
    try {
      await axiosPrivate.put(
        `http://localhost:5001/grid/updateseattypes/${theatreId}`,
        { seat_types: seatTypes }
      );
      alert("Seat types updated successfully!");
      navigate("/admin"); // Redirect or update UI as needed
    } catch (error) {
      console.error("Error updating seat types:", error);
      alert("Failed to update seat types");
    }
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
        onClick={handleUpdateSeatTypes}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
      >
        Update Prices
      </button>
    </div>
  );
};

export default HandleChildrenPrices;
