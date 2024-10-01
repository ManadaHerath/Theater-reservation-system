import React, { useState } from "react";

const TicketPopup = ({ onSubmit }) => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);

  const handleSubmit = () => {
    if (adults + children > 0) {
      onSubmit(adults, children); // Pass adult and children ticket counts to parent
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
        <div className="mb-4">
          <label className="block font-bold mb-2">Adults:</label>
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Children:</label>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default TicketPopup;
