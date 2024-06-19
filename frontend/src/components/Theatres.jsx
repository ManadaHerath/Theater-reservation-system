import React from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const TheatreCard = ({ theatre }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/schedule/${theatre.id}`);
  };

    return (
        <div 
          className={`theatre-card w-72 relative overflow-hidden transition-transform duration-300 hover:scale-105 ${
            theatre.is_active ? "" : "inactive"
          }`} 
          onClick={handleClick}
        >
          {/* Image Container with hover effect */}
          <div className="relative transition-opacity duration-300 hover:opacity-75">
            <img
              src={theatre.image_url}
              alt={theatre.name}
              className="object-cover w-full h-64" 
              onError={(e) =>
                (e.target.src =
                  'https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg')
              }
            />
          </div>
    
          {/* Details Container */}
          <div className="theatre-details p-4">
            <h3 className="text-xl font-bold mb-2">{theatre.name}</h3>
            <p className="text-gray-700">{theatre.details}</p>
          </div>
        </div>
      );
};

const TheatreList = () => {
    const { data, loading, error } = useFetch("http://127.0.0.1:5001/theatres");

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error.length >0) {
        console.log(error);
    }

    return (
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4">
            {data.map(theatre => (
                <TheatreCard
                    key={theatre.id}
                    theatre={theatre} // Pass theatre object as prop
                />
            ))}
        </div>
    );
};

export default TheatreList;
