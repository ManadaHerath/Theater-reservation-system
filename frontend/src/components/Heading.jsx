import React from "react";
import { Link } from "react-router-dom";

const Heading = () => {
  return (

    <div className="py-4 bg-indigo-600 shadow-md ">
      <h1 className="text-4xl font-bold text-center text-white">Book Your Seats Now!</h1>
      <p className="mt-2 text-lg text-center text-gray-200">Reserve tickets for your favorite shows</p>

//     <div className="bg-indigo-600 py-6 shadow-md mb-8">
//       <h1 className="text-4xl font-bold text-center text-white">Book Your Seats Now!</h1>
//       <p className="text-lg text-center text-gray-200 mt-2">Reserve tickets for your favorite shows</p>
//       <nav className="flex justify-center mt-4 space-x-4">
//         <Link to="/">
//           <button className="btn bg-white text-indigo-600 font-bold py-2 px-4 rounded hover:bg-gray-200 hover:text-indigo-800 transition duration-300">Home</button>
//         </Link>
//         <Link to="/movies">
//           <button className="btn bg-white text-indigo-600 font-bold py-2 px-4 rounded hover:bg-gray-200 hover:text-indigo-800 transition duration-300">Movies</button>
//         </Link>
//         <Link to="/theatres">
//           <button className="btn bg-white text-indigo-600 font-bold py-2 px-4 rounded hover:bg-gray-200 hover:text-indigo-800 transition duration-300">Theatres</button>
//         </Link>
//         <Link to="/schedule">
//           <button className="btn bg-white text-indigo-600 font-bold py-2 px-4 rounded hover:bg-gray-200 hover:text-indigo-800 transition duration-300">Schedule</button>
//         </Link>
//       </nav>

    </div>
  );
}

export default Heading;
