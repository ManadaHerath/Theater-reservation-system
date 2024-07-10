"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AddTheatreForm() {
  const inputStyles =
    "sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500";

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [noOfSeats, setNoOfSeats] = useState("");
  const [noOfRows, setNoOfRows] = useState("");
  const [noOfColumns, setNoOfColumns] = useState("");
  const [imageUrl, setImageUrl] = useState("");




  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation({
      ...location,
      [name]: value,
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/theatres", {
        name,
        address,
        location,
        mobile_number: mobileNumber,
        email,
        details,
        is_active: isActive,
        no_of_seats: noOfSeats,
        no_of_rows: noOfRows,
        no_of_columns: noOfColumns,
        image_url: imageUrl,
      });
      console.log("Theatre added successfully:", response.data);
      // Reset form fields after successful submission
      setName("");
      setAddress("");
      setLocation({ lat: "", lng: "" });
      setMobileNumber("");
      setEmail("");
      setDetails("");
      setIsActive(true);
      setNoOfSeats("");
      setNoOfRows("");
      setNoOfColumns("");
      setImageUrl("");
    } catch (error) {
      console.error("Error adding theatre:", error);
      // Handle error states as needed
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-gray-900 px-5">
      <div className="xl:max-w-3xl bg-gray-800 border-gray-700 w-full py-3 sm:p-10 rounded-md sm:max-w-md my-6">
        <h1 className="flex justify-center text-xl sm:text-3xl font-semibold text-white">
          Add a New Theatre
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="w-full mt-8">
            <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
              <input
                className={inputStyles}
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Theatre Name"
                required
              />
              <input
                className={inputStyles}
                name="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                required
              />
              <div className="flex gap-3">
                <input
                  className={inputStyles}
                  name="lat"
                  type="text"
                  value={location.lat}
                  onChange={handleLocationChange}
                  placeholder="Latitude"
                  required
                />
                <input
                  className={inputStyles}
                  name="lng"
                  type="text"
                  value={location.lng}
                  onChange={handleLocationChange}
                  placeholder="Longitude"
                  required
                />
              </div>
              <input
                className={inputStyles}
                name="mobileNumber"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile Number"
                required
              />
              <input
                className={inputStyles}
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <textarea
                className={inputStyles}
                name="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Details"
                required
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="ml-2 text-gray-400">Active</span>
              </label>
              <input
                className={inputStyles}
                name="noOfSeats"
                type="number"
                value={noOfSeats}
                onChange={(e) => setNoOfSeats(e.target.value)}
                placeholder="Number of Seats"
                required
              />
              <input
                className={inputStyles}
                name="noOfRows"
                type="number"
                value={noOfRows}
                onChange={(e) => setNoOfRows(e.target.value)}
                placeholder="Number of Rows"
                required
              />
              <input
                className={inputStyles}
                name="noOfColumns"
                type="number"
                value={noOfColumns}
                onChange={(e) => setNoOfColumns(e.target.value)}
                placeholder="Number of Columns"
                required
              />
              <input
                className={inputStyles}
                name="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
              />
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <span className="ml-3">Add Theatre</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}