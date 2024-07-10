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
    details: "",
    image_url: "",
    is_active: false,
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
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Update Theatre
      </button>
    </form>
  );
};

export default UpdateTheatreForm;
