import React from "react";
import offer_1 from '../assets/offer_1.jpg'

const Offers = () => {
  return (
    <div className="w-[100vw] h-[130vh] pt-10">
      {" "}
      <h1 className="flex pb-5 pl-20 text-3xl text-white">
        {" "}
        DEALS & EXCLUSIVE
      </h1>
      <div className="w-[50vw] h-[50vh] bg-blue-950 flex items-center justify-center mx-auto mb-10 pb-10 left-20">
        <div className="flex items-center justify-center w-1/2">
        </div>
        <div className="w-2/3 px-5">
          <img 
            src={offer_1}
            alt="Placeholder Image" 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="w-[50vw] h-[50vh] bg-blue-950 flex items-center justify-center mx-auto pb-50 pt-20 right-20">
      </div>
    </div>
  );
};

export default Offers;
