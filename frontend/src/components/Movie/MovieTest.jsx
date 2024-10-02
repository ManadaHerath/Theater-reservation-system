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
        console.log("API response: ", response.data);
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
    <div style={{
      backgroundImage: `
    linear-gradient(rgba(43, 58, 110, 0.7), rgba(40, 40, 50, 0.7)),
    url('https://firebasestorage.googleapis.com/v0/b/medilink-5688e.appspot.com/o/images%2Ffetchpik.com-pNEtHoVwlU.jpg?alt=media&token=ef2ae0db-3178-4744-8a23-56c35b7d843d')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#433B7C", 
    }}>
      <MovieSlideshow movies={data} />
    </div>
  );
};

export default MovieTest;
