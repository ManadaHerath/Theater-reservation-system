import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";



export default function AddTheatreForm() {
  const navigate = useNavigate();
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
  const [priceCategoryAdded, setPriceCategoryAdded] = useState(false);

  // state for rows
  const [rows, setRows] = useState([]);
  const [newRowLabel, setNewRowLabel] = useState("");
  const [newSeatNumber, setNewSeatNumber] = useState(0);
  const [newPriceCategory, setNewPriceCategory] = useState(0);
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
      // Send price categories to backend
      await axiosPrivate.post(`http://localhost:5001/seat_types/prices`, {priceCategories,theatreId});
      console.log("Price categories added successfully.");
      setPriceCategoryAdded(true);


      fetchPriceCategories();

      // Clear price categories state after submission
      setPriceCategories([]);
    } catch (error) {
      console.error("Error adding price categories:", error);
      // Handle error states as needed
    }
  };
  useEffect(()=>{
    fetchPriceCategories();
  },[newRowLabel])


  const fetchPriceCategories = async () => {
    try {
      console.log({theatreId})
      const response = await axiosPrivate.get(`http://localhost:5001/seat_types/pricesByTheatre/${theatreId}`);
      setdbPriceCategories(response.data);
      console.log({dbpriceCategories})
    } catch (error) {
      console.error("Error fetching price categories:", error);
      // Handle error states as needed
    }
  };
  const handleAddRow = () => {
    // Validate if all fields are filled
    if (newRowLabel.trim() === "" || newPriceCategory === "" || newSeatNumber <= 0) {
      console.log(newRowLabel,newPriceCategory,newSeatNumber)
      console.log("Please fill in the row label, select a price category, and specify a valid number of seats.");
      return;
    }

    console.log(dbpriceCategories)
  
    // Ensure newSeatNumber is an integer
    const seatNumber = parseInt(newSeatNumber, 10);
  
    // Add new row to state
    setRows([
      ...rows,
      { row_label: newRowLabel.trim(), price_category_id: newPriceCategory, number: seatNumber },
    ]);
    console.log(newRowLabel,newPriceCategory,seatNumber)
  
    // Clear input fields
    setNewRowLabel("");
    setNewSeatNumber(0);
    
  };
  



  const handleSubmitRows = async (e) => {
    e.preventDefault();
    try {
      console.log({rows,theatreId})
      const response = await axiosPrivate.post('http://localhost:5001/rows/addRows', {rows,theatreId});

      // navigate('/admin');
      if (response.status === 200) {
        setRows([]);
        navigate('/admin');

      }


      else{
        console.log("Error adding rows");
      }
    } catch (error) {
      console.error("Error adding price categories:", error);

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
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  className={inputStyles}
                  type="text"
                  placeholder="Row Label"
                  value={newRowLabel}
                  onChange={(e) => setNewRowLabel(e.target.value)}
                  
                />
                <input
                  className={inputStyles}
                  type="number"
                  placeholder="Number of Seats"
                  onChange={(e) => setNewSeatNumber(parseInt(e.target.value, 10) || 0)}
                />
                <select
                  className={inputStyles}
                  defaultValue = "Price Category"
                  onChange={(e) => setNewPriceCategory(e.target.value)}>
                  
                    {dbpriceCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>))}
                </select>    
                <button
                  type="button"
                  className="bg-[#E9522C] text-gray-100 px-4 py-2 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out"
                  onClick={handleAddRow}
                >
                  Add
                </button>
              </div>
              {/* Display added categories */}
              <div className="flex flex-wrap gap-2">
                {rows.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-2 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-white">{category.row_label}</span>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <span className="ml-3">Done Adding Rows</span>
              </button>
            </div>
          </form>
        </div>
      )}

      

    </div>

    
  );
}
