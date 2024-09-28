import React, { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"; // Assuming axiosPrivate is set up

const UsersList = () => {
  const axiosPrivate = useAxiosPrivate(); // Authenticated axios instance
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false); // Toggle state

  const fetchUsers = async () => {
    if (showUsers) {
      // If users are already displayed, hide them
      setShowUsers(false);
      return;
    }

    setIsLoading(true); // Set loading state to true
    try {
      const response = await axiosPrivate.get("/users/allusers"); // Fetch all users
      setUsers(response.data); // Set the user data to state
      setShowUsers(true); // Set to show users
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after request finishes
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="mb-4 text-2xl font-bold">User List</h2>
      <button
        onClick={fetchUsers}
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded"
      >
        {isLoading ? "Loading..." : showUsers ? "Hide Users" : "Show All Users"}
      </button>
      {showUsers && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 text-center">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border-b">{user.full_name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
