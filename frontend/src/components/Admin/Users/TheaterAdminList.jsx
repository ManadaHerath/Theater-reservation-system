import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"; 
import { useNavigate } from "react-router-dom";

const TheaterAdminList = () => {
  const axiosPrivate = useAxiosPrivate(); 
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  

  useEffect(()=>{
    const fetchTheaterAdmins = async ()=>{
      try {
        const response = await axiosPrivate.get('/users/allusers');
        setUsers(response.data.filter(user=>user.role === 'theatreAdmin'));
      } catch (error){
        console.error('Failed to fetch users:', error);
      }
    }
    fetchTheaterAdmins();
  }, [axiosPrivate]);
  

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="mb-4 text-2xl font-bold">All Admins</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-4 text-center">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={()=>navigate(`/admin/users/${user.id}`)}
                  >
                <td className="px-4 py-2 border-b">{user.full_name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.phone_number}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TheaterAdminList;
