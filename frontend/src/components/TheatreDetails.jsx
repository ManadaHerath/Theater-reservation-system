import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Theatre() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const {
    data: details,
    loading,
    error,
  } = useFetch(`http://localhost:5001/theatres/${id}`);

  if (loading) return <p>Loading...</p>;
  if (error.length > 0) return <p>error...</p>;

  const handleonClick = () => {
    navigate(`/schedule/${id}`);
  };

  return (
    <div className="max-h-full">
      <div className="relative">
        <img src={details.image_url} className="size-full" />
        <h1 className="text-2xl lg:text-5xl  font-bold absolute text-white bottom-10 left-10 flex flex-col md:space-y-4 space-y-1">
       <span>  {details.name}</span> 
       <span>  {details.district}</span> 
        </h1>
        
      </div>
      <button
          onClick={handleonClick}
          className="bg-blue-500 hover:bg-blue-600 font-semibold p-2 text-white rounded-lg mt-5 ml-5"
        >
          Show Movie Schedule
        </button>
    </div>
  );
}
