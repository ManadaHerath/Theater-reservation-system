import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AddUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState(""); // New role state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/users/adduser", {
        email: email,
        phone_number: phone,
        full_name: `${firstName} ${lastName}`,
        gender: gender,
        address: address,
        birthday: dateValue,
        role: role, // pass role to backend
        password: password,
      });

      if (response.status === 201) {
        setAlert("User added successfully");
      } else {
        setAlert("Error adding user");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setAlert("Email already registered");
      } else {
        console.error("Error adding user:", err);
        setAlert("Server error");
      }
    }
  };

  return (
    <div className="container max-w-4xl mx-auto mt-8">
      <h2 className="mb-4 text-2xl font-bold">Add New User</h2>
      <form className="p-4 rounded-lg shadow" onSubmit={handleSubmit}>
        <div>
            <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          placeholder="Phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label className="block text-sm font-medium">Address</label>
        <textarea
          placeholder="Address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label className="block text-sm font-medium">Birthday</label>
        <input
          type="date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          required
        />
        <label className="block text-sm font-medium">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled>
            Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Role Dropdown */}
        <label className="block text-sm font-medium">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="" disabled>
            Select Role
          </option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="theaterAdmin">Theater Admin</option>
          <option value="systemManager">System Manager</option>
        </select>

        <label className="block text-sm font-medium">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>

        <button className="px-4 py-2 text-white bg-blue-500 rounded-lg" type="submit">Add User</button>
        {alert && <p>{alert}</p>}
      </form>
    </div>
  );
}
