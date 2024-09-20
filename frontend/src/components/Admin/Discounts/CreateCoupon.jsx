import React, { useState } from 'react';
import axios from 'axios';

const CreateCoupon = () => {
  const [duration, setDuration] = useState('once');
  const [couponId, setCouponId] = useState('free-period');
  const [percentOff, setPercentOff] = useState(100);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/coupons/create-coupon', {
        duration,
        id: couponId,
        percent_off: percentOff,
      });
      setMessage(`Coupon created successfully: ${response.data.coupon.id}`);
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2>Create a Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Coupon ID:</label>
          <input
            type="text"
            value={couponId}
            onChange={(e) => setCouponId(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Duration:</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="once">Once</option>
            <option value="forever">Forever</option>
            <option value="repeating">Repeating</option>
          </select>
        </div>
        <div>
          <label className="block">Percent Off:</label>
          <input
            type="number"
            value={percentOff}
            onChange={(e) => setPercentOff(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Coupon
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default CreateCoupon;
