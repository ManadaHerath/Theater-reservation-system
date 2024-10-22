import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useParams to get the user ID from the URL
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

const UserDetails = () => {
  const { id } = useParams(); // Get the user ID from the route parameters
  const navigate = useNavigate(); // To navigate back to the list
  const [user, setUser] = useState({
    full_name: '',
    role: '',
    email: '',
    phone_number: '',
    birthday: '',
    address: '',
    is_completed: '',
    is_active: ''
  });
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosPrivate.get(`/users/getAnyUser?id=${id}`);
        setUser(...response.data);
       // console.log("user:"+response.data);
        
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    fetchUser();
  }, [id, axiosPrivate]);

  if (!user) {
    return <div>Loading user details...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`/users/updateUser/${id}`, user);
      alert('User updated successfully');
      navigate(-1); // Go back to the previous page after updating
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/users/deleteUser/${id}`);
      alert('User deleted successfully');
      navigate(-1); // Go back to the previous page after deleting
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };


  return (
    <div className='bg-white'>
    <button onClick={() => navigate(-1)} className="px-4 py-2 mb-4 bg-gray-300 rounded">
      Back to List
    </button>
    <h2 className="mb-4 text-2xl font-bold">User Details Form</h2>
    <form className="p-4 rounded-lg shadow" onSubmit={handleUpdate}>
      <div className="mb-4">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.full_name}
          onChange={handleInputChange}
          placeholder="Enter Full Name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Role</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.role}
          onChange={handleInputChange}
          placeholder="Enter role"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.email}
          onChange={handleInputChange}
          placeholder="Enter Email"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.phone_number}
          onChange={handleInputChange}
          placeholder="Enter Phone Number"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Birthday</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.birthday}
          placeholder="Enter Birthday"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.address}
          onChange={handleInputChange}
          placeholder="Enter adress"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Is completed</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.is_completed}
          onChange={handleInputChange}
          placeholder=""
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Is active</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={user.is_active}
          onChange={handleInputChange}
          placeholder=""
        />
      </div>
      
      {/* Add more fields as needed */}
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-lg">
        Update
      </button>
      <button type="button" onClick={handleDelete} className="px-4 py-2 text-white bg-blue-500 rounded-lg">
        Delete
      </button>
    </form>
  </div>

  );
};

export default UserDetails;
