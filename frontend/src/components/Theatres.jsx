import { React, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const TheatreCard = (props) => {
  return (
    <div>
      <div
        className={`theatre-card w-80 h-auto relative overflow-hidden transition-transform duration-300 hover:scale-105 ${
          props.is_active ? "" : "inactive"
        }`}
      >
        <div className="relative transition-opacity duration-300 hover:opacity-75 rounded-xl mt-4 w-80 h-96">
          <Link to={`/theatre/${props.id}`}>
            <img
              src={props.image_url}
              alt={props.name}
              className="object-cover w-full h-full rounded-xl"
              onError={(e) =>
                (e.target.src =
                  "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg")
              }
            />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-gray-900 to-transparent cursor-pointer group-hover:opacity-50">
          <h3 className="text-xl font-bold mb-2 text-white">{props.name}</h3>
          <p className="text-white font-thin">{props.details}</p>
        </div>
      </div>
    </div>
  );
};

const TheatreList = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false); // State to control how many cards to show

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/theatres");
        setData(response.data);
      } catch (error) {
        setError(error.message);
        navigate("/login", { state: { from: location }, replace: true });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error.length > 0) {
    console.log(error);
  }

  // Determine the number of cards to show
  const theatresToShow = showAll ? data : data.slice(0, 8);

  return (
    <div className="py-16 mb-10">
      <h1 className="text-white text-3xl pl-6 pb-5 font-bold">Theaters</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mx-auto">
        {theatresToShow.map((theatre) => (
          <TheatreCard
            key={theatre.id}
            id={theatre.id}
            name={theatre.name}
            details={theatre.details}
            image_url={theatre.image_url}
            is_active={theatre.is_active}
          />
        ))}
      </div>

      {!showAll && data.length > 8 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-10"
          >
            Explore More
          </button>
        </div>
      )}
    </div>
  );
};

export default TheatreList;
