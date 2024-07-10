import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const UpdateTheatreForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  console.log(id);
  const [theatre, setTheatre] = useState({
    name: "",
    address: "",
    location: { lat: "", lng: "" },
    mobile_number: "",
    email: "",
    details: "",
    is_active: false,
    no_of_seats: 0,
    no_of_rows: 0,
    no_of_columns: 0,
    image_url: "",
  });

  useEffect(() => {
    const fetchTheatre = async () => {
      try {
        const response = await axiosPrivate.get(`/theatres/${id}`);
        setTheatre(response.data);
      } catch (error) {
        console.error("Failed to fetch theatre:", error);
      }
    };
    fetchTheatre();
  }, [id, axiosPrivate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTheatre({
      ...theatre,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setTheatre({
      ...theatre,
      location: {
        ...theatre.location,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`/theatres/${id}`, theatre);
      navigate("/theatres");
    } catch (error) {
      console.error("Failed to update theatre:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={theatre.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={theatre.address}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Latitude</label>
        <input
          type="text"
          name="lat"
          value={theatre.location.lat}
          onChange={handleLocationChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Longitude</label>
        <input
          type="text"
          name="lng"
          value={theatre.location.lng}
          onChange={handleLocationChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Mobile Number</label>
        <input
          type="text"
          name="mobile_number"
          value={theatre.mobile_number}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={theatre.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Details</label>
        <textarea
          name="details"
          value={theatre.details}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Image URL</label>
        <input
          type="text"
          name="image_url"
          value={theatre.image_url}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Active</label>
        <input
          type="checkbox"
          name="is_active"
          checked={theatre.is_active}
          onChange={handleChange}
          className="mr-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Number of Seats</label>
        <input
          type="number"
          name="no_of_seats"
          value={theatre.no_of_seats}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Number of Rows</label>
        <input
          type="number"
          name="no_of_rows"
          value={theatre.no_of_rows}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Number of Columns</label>
        <input
          type="number"
          name="no_of_columns"
          value={theatre.no_of_columns}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Update Theatre
      </button>
    </form>
  );
};

export default UpdateTheatreForm;
