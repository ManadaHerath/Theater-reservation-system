import React from "react";
import useFetch from "../hooks/useFetch";

const TheatreCard = (theatre ) => {
    const handleClick = () => {
        window.location.href = theatre.image_url;
    }

    return (
        <div className={`theatre-card ${theatre.is_active ? "" : "inactive"}`} onClick={handleClick}>
            <img 
                src={theatre.image_url} 
                alt={theatre.name} 
                onError={(e) => e.target.src = "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg"} 
            />
            <div className="theatre-details">
                <h3>{theatre.name}</h3>
                <p>{theatre.details}</p>
            </div>
        </div>
    );
}

const TheatreList = () => {
    const { data, loading, error } = useFetch("http://127.0.0.1:5001/theatres");

    if (loading) {
        return <p>Loading...</p>
    }

    // if (error) {
    //     console.error(error);
    //     return <p>Error loading theatres.</p>
    // }

    return (
        <div className="theatre-list">
            {data.map(theatre => (
                <TheatreCard
                    key={theatre.id}
                    name={theatre.name}
                    details={theatre.details}
                    image_url={theatre.image_url}
                    is_active={theatre.is_active}

                />
            ))}
        </div>
    );
}

export default TheatreList;
