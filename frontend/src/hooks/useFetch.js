import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import Cookies from "js-cookie";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access_token");
        const res = await axiosPrivate.get(
          url,
          {
            withCredentials: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(url, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
