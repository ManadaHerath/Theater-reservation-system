import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import TheatreAdminLayout from "../TheatreAdminLayout";

export default function ManageTheatre() {
  const axiosPrivate = useAxiosPrivate();
  const [theatre, setTheatre] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheatre = async () => {
      try {
        const response = await axiosPrivate.get("theatre-admin/theatre");
        setTheatre(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching theatre:", error);
      }
    };
    fetchTheatre();
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTheatre({
      ...theatre,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`/theatres/${theatre.id}`, theatre);
      navigate(0);
    } catch (error) {
      console.error("Failed to update theatre:", error);
    }
  };

  return (
    <TheatreAdminLayout>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto mt-8 p-6 bg-[#09081d] rounded-lg shadow-lg"
      >
        <div className="mb-6">
          <img
            src={theatre.image_url}
            alt="theatre"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={theatre.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={theatre.address}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Location
          </label>
          <input
            type="text"
            name="lat"
            value={theatre.location}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile_number"
            value={theatre.mobile_number}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={theatre.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Details
          </label>
          <textarea
            name="details"
            value={theatre.details}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Image URL
          </label>
          <input
            type="text"
            name="image_url"
            value={theatre.image_url}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6 flex items-center">
          <label className="block text-gray-300 text-sm font-bold mr-2">
            Active
          </label>
          <input
            type="checkbox"
            name="is_active"
            checked={theatre.is_active}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Number of Seats
          </label>
          <input
            type="number"
            name="no_of_seats"
            value={theatre.no_of_seats}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Number of Rows
          </label>
          <input
            type="number"
            name="no_of_rows"
            value={theatre.no_of_rows}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Number of Columns
          </label>
          <input
            type="number"
            name="no_of_columns"
            value={theatre.no_of_columns}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Update Theatre
        </button>
      </form>
    </TheatreAdminLayout>
  );
}
