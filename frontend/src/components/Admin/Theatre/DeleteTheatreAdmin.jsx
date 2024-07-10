import {React, useEffect , useState} from "react";
import {Link, useNavigate, useLocation  } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";




const TheatreCard = ({ theatre, onUpdate, onDelete }) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
  
    const handleScheduleClick = () => {
      navigate(`/schedule/${theatre.id}`);
    };
  
    const handleUpdateClick = () => {
      onUpdate(theatre.id);
    };
  
    const handleDeleteClick = async () => {
      try {
        await axiosPrivate.delete(`/theatres/${theatre.id}`);
        onDelete(theatre.id);
      } catch (error) {
        console.error("Failed to delete theatre:", error);
      }
    };
  
    return (
      <div>
        <div
          className={`theatre-card w-72 relative overflow-hidden transition-transform duration-300 hover:scale-105 ${
            theatre.is_active ? "" : "inactive"
          }`}
          onClick={handleScheduleClick}
        >
          <div className="relative transition-opacity duration-300 hover:opacity-75">
            <img
              src={theatre.image_url}
              alt={theatre.name}
              className="object-cover w-full h-64"
              onError={(e) =>
                (e.target.src =
                  "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg")
              }
            />
          </div>
  
          <div className="theatre-details p-4">
            <h3 className="text-xl font-bold mb-2">{theatre.name}</h3>
            <p className="text-gray-700">{theatre.details}</p>
          </div>
        </div>
        <Link
          to={`/theatre/${theatre.id}`}
          className="block mt-4 text-blue-600 hover:underline"
        >
          See More{" "}
        </Link>
        <button
          onClick={handleUpdateClick}
          className="block mt-2 text-green-600 hover:underline"
        >
          Update
        </button>
        <button
          onClick={handleDeleteClick}
          className="block mt-2 text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    );
  };

  const TheatreList = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
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
    }, [axiosPrivate, location, navigate]);
  
    const handleDelete = (id) => {
      setData(data.filter(theatre => theatre.id !== id));
    };
  
    const handleUpdate = (id) => {
      navigate(`/admin/update-theatre/${id}`);
    };
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (error.length > 0) {
      console.log(error);
    }
  
    return (
      <div className="flex flex-col sm:flex-row justify-center sm:space-x-4">
        {data.map(theatre => (
          <TheatreCard
            key={theatre.id}
            theatre={theatre}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };
  
  export default TheatreList;

