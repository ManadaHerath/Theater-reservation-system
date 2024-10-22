import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom';

const UserRequests = () => {
    const axiosPrivate = useAxiosPrivate();
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
    const fetchRequests = async ()=>{
      try {
        const response = await axiosPrivate.get('/users/userRequest');
        setRequests(response.data);
      } catch (error){
        console.error('Failed to fetch Reqests:', error);
      }
    }
    fetchRequests();
  }, [axiosPrivate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosPrivate.put(`/users/userRequest/updateStatus/${id}`, { status: newStatus });
      // Update the status locally after the request is successful
      setRequests((prevRequests) => prevRequests.map((request) => 
        request.id === id ? { ...request, status: newStatus } : request
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="mb-4 text-2xl font-bold">All Requests</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Date</th>
            
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center">No requests found</td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr 
                >
                <td key={request.id}
                  className="px-4 py-2 border-b cursor-pointer hover:bg-gray-100"
                   onClick={()=>navigate(`/admin/users/${request.id}`)} >{request.full_name}</td>
                <td className="px-4 py-2 border-b">{request.description}</td>
                <td className="px-4 py-2 border-b">{new Date(request.requested_date).toISOString().split("T")[0]}</td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserRequests
