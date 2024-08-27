import React, { useEffect, useState } from "react";

import MovieSlideshow from "./MovieSlideshow";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const MovieTest = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/movies");
        console.log('API response: ', response.data);
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error.length > 0) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <MovieSlideshow movies={data} />
    </div>
  );
};

export default MovieTest;
