import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


export default function AddTheatreForm() {
  const axiosPrivate = useAxiosPrivate();
  const inputStyles =
    "sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500";

  // State for theater information
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
  const [theatreId, setTheatreId] = useState(""); // State to hold theater ID

  // State for price categories
  const [priceCategories, setPriceCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPrice, setNewCategoryPrice] = useState("");

  // state for rows
  const [rows, setRows] = useState([]);
  const [newRowLabel, setNewRowLabel] = useState("");
  const [dbpriceCategories, setdbPriceCategories] = useState([]);


  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation({
      ...location,
      [name]: value,
    });
  };

  const handleSubmitTheatre = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post("http://localhost:5001/theatres", {
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
      console.log("Theatre added successfully:", response.data.id);
      setTheatreId(response.data.id); // Set theater ID after successful addition
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

  const handleAddCategory = () => {
    // Validate if category name and price are filled
    if (newCategoryName.trim() === "" || newCategoryPrice.trim() === "") {
      alert("Please fill in both category name and price.");
      return;
    }
    // Add new category to state
    setPriceCategories([
      ...priceCategories,
      { category_name: newCategoryName, price: newCategoryPrice },
    ]);
    // Clear input fields
    setNewCategoryName("");
    setNewCategoryPrice("");
  };

  const handleSubmitCategories = async (e) => {
    e.preventDefault();
    try {
      console.log({priceCategories,theatreId})
      // Send price categories to backend
      await axiosPrivate.post(`http://localhost:5001/seat_types/prices`, {priceCategories,theatreId});
      console.log("Price categories added successfully.");
      // Clear price categories state after submission
      setPriceCategories([]);
    } catch (error) {
      console.error("Error adding price categories:", error);
      // Handle error states as needed
    }
  };

  const fetchPriceCategories = async () => {
    try {
      const response = await axiosPrivate.get(`http://localhost:5001/seat_types/pricesByTheatre`,{theatreId});
      setdbPriceCategories(response.data);
    } catch (error) {
      console.error("Error fetching price categories:", error);
      // Handle error states as needed
    }
  };



  const handleAddRow = () => {
    if (newRowLabel.trim() === "") {
      alert("Please enter a row label.");
      return;
    }
    setRows([...rows, { label: newRowLabel, priceCategoryId: "" }]);
    setNewRowLabel("");
  };

  const handleRowPriceCategoryChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].priceCategoryId = value;
    setRows(updatedRows);
  };

  const handleSubmitRows = async (e) => {
    e.preventDefault();
    try {
      // Send rows data to backend
      const rowsWithCategories = rows.map(row => ({
        label: row.label,
        price_category_id: row.priceCategoryId
      }));
      await axiosPrivate.post(`http://localhost:5001/theatres/${theatreId}/rows`, {
        rows: rowsWithCategories,
      });
      console.log("Rows added successfully.");
      // Clear rows state after submission
      setRows([]);
    } catch (error) {
      console.error("Error adding rows:", error);
      // Handle error states as needed
    }
  };






  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-gray-900 px-5">
      {!theatreId && (<div className="xl:max-w-3xl bg-gray-800 border-gray-700 w-full py-3 sm:p-10 rounded-md sm:max-w-md my-6">
        <h1 className="flex justify-center text-xl sm:text-3xl font-semibold text-white">
          Add a New Theatre
        </h1>
        <form onSubmit={handleSubmitTheatre}>
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
      </div>)}

      {/* Form to add price categories */}
      {theatreId && (
        <div className="xl:max-w-3xl bg-gray-800 border-gray-700 w-full py-3 sm:p-10 rounded-md sm:max-w-md my-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
            Add Price Categories
          </h2>
          <form onSubmit={handleSubmitCategories}>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  className={inputStyles}
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  
                />
                <input
                  className={inputStyles}
                  type="number"
                  placeholder="Price"
                  value={newCategoryPrice}
                  onChange={(e) => setNewCategoryPrice(e.target.value)}
                  
                />
                <button
                  type="button"
                  className="bg-[#E9522C] text-gray-100 px-4 py-2 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </div>
              {/* Display added categories */}
              <div className="flex flex-wrap gap-2">
                {priceCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-2 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-white">{category.category_name}</span>
                    <span className="text-white">(${category.price})</span>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <span className="ml-3">Done Adding Categories</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Form to add rows */}
      {theatreId && (
        <div className="xl:max-w-3xl bg-gray-800 border-gray-700 w-full py-3 sm:p-10 rounded-md sm:max-w-md my-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
            Add Rows
          </h2>
          <form onSubmit={handleSubmitRows}>
            {rows.map((row, index) => (
              <div key={index} className="flex gap-3 items-center mb-3">
                <input
                  className={inputStyles}
                  type="text"
                  placeholder={`Row ${index + 1} Label`}
                  value={row.label}
                  onChange={(e) => {
                    const updatedRows = [...rows];
                    updatedRows[index].label = e.target.value;
                    setRows(updatedRows);
                  }}
                  required
                />
                <select
                  className={inputStyles}
                  value={row.priceCategoryId}
                  onChange={(e) => handleRowPriceCategoryChange(index, e.target.value)}
                  required
                >
                  <option value="">Select Price Category</option>
                  {priceCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.category_name} (${category.price})
                    </option>
                  ))}
                </select>
                {index === rows.length - 1 && (
                  <button
                    type="button"
                    className="bg-[#E9522C] text-gray-100 px-4 py-2 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out"
                    onClick={handleAddRow}
                  >
                    Add Row
                  </button>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              <span className="ml-3">Submit Rows</span>
            </button>
          </form>
        </div>
      )}

    </div>

    
  );
}
