import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRefundPage = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the list of refund requests when the component mounts
  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5001/refund');
        setRefundRequests(response.data);
      } catch (error) {
        console.error('Error fetching refund requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefundRequests();
  }, []);

  // Handle accepting a refund request
  const handleAccept = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5001/refund/admin/accept/${id}`);

      if (res.status === 200) {
        setRefundRequests(refundRequests.map(req => (req.refund_id === id ? { ...req, status: 'Accepted' } : req)));
      }
    } catch (error) {
      console.error('Error accepting refund request:', error);
    }
  };

  // Handle denying a refund request
  const handleDeny = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5001/refund/admin/deny/${id}`);
      if (res.status === 200) {
        setRefundRequests(refundRequests.map(req => (req.refund_id === id ? { ...req, status: 'Denied' } : req)));
      }
    } catch (error) {
      console.error('Error denying refund request:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Refund Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theatre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time since payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refundRequests.map((request) => (
              <tr key={request.refund_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.theatre_name}</td>
               {/* {Math.floor((new Date(request.created_at) - new Date(request.purchased_time)) / 600000)} */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor((new Date(request.created_at) - new Date(request.purchased_time)) / 3600000)} hours and {Math.floor(((new Date(request.created_at) - new Date(request.purchased_time)) % 3600000) / 60000)} minutes</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAccept(request.refund_id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeny(request.refund_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <span>Took Action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRefundPage;
