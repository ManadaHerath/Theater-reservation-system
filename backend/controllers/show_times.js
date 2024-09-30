import { connection } from "../index.js";

export const getAllShowTimes = async (req, res) => {
  const { id } = req.params; // Get the id from request parameters

  try {
    let query = `
      SELECT 
        show_times.id,
        show_times.theatre_id,
        show_times.start_time,
        show_times.end_time,
        m.title,
        m.poster_url,
        t.name,
        t.district 
      FROM show_times 
      INNER JOIN movies m ON show_times.movie_id = m.id 
      INNER JOIN theatres t ON show_times.theatre_id = t.id
    `;

    const [show_times] = await connection.query(
      "SELECT show_times.id,theatre_id,start_time,end_time,movie_id,m.title,m.poster_url,t.name,t.district FROM show_times inner join movies m on show_times.movie_id = m.id inner join theatres t on show_times.theatre_id = t.id"
    );
    // If id is provided, check if it's a valid movie_id or theatre_id
    if (id) {
      const [movieCheck] = await connection.query(
        "SELECT id FROM movies WHERE id = ?",
        [id]
      );

      const [theatreCheck] = await connection.query(
        "SELECT id FROM theatres WHERE id = ?",
        [id]
      );

      // Modify the query based on the validation results
      if (movieCheck.length > 0) {
        query += ` WHERE show_times.movie_id = ?`;
      } else if (theatreCheck.length > 0) {
        query += ` WHERE show_times.theatre_id = ?`;
      }
    }

    // Execute the query (passing id if it exists, otherwise it will fetch all)
    res.json(show_times);
  } catch (error) {
    console.error("Error fetching show times:", error);
    res.status(500).json({ message: "Error fetching show times" });
  }
};

export const getShowTimesByTheatre = async (req, res) => {
  const { theatreId } = req.params; // Assuming you pass the theatreId as a URL param

  try {
    const [show_times] = await connection.query(
      `SELECT show_times.id, theatre_id, start_time, end_time, m.title, m.poster_url, t.name 
      FROM show_times 
      INNER JOIN movies m ON show_times.movie_id = m.id 
      INNER JOIN theatres t ON show_times.theatre_id = t.id 
      WHERE t.id = ?`,
      [theatreId]
    );

    res.json(show_times);
  } catch (error) {
    console.error("Error fetching show times:", error);
    res.status(500).json({ message: "Error fetching show times" });
  }
};

export const deleteShowTime = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await connection.query(
      "DELETE FROM show_times WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    console.error("Error deleting showtime:", error);
    res.status(500).json({ message: "Error deleting showtime" });
  }
};

export const addShowTime = async (req, res) => {
  const { showTimes } = req.body; // Expect an array of showtimes

  if (!Array.isArray(showTimes) || showTimes.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // Use a transaction to ensure all showtimes are added atomically
  const promises = showTimes.map(async (showtime) => {
    const { theatre_id, movie_id, start_time, end_time } = showtime;

    try {
      const [result] = await connection.query(
        `INSERT INTO show_times (theatre_id, movie_id, start_time, end_time) 
         VALUES (?, ?, ?, ?)`,
        [theatre_id, movie_id, start_time, end_time]
      );

      return { id: result.insertId }; // Return the inserted ID
    } catch (error) {
      console.error("Error adding showtime:", error);
      throw new Error("Database error");
    }
  });

  try {
    const results = await Promise.all(promises); // Wait for all insertions to complete
    res.status(200).json({ message: "Showtimes added successfully", results });
  } catch (error) {
    res.status(500).json({ message: "Error adding showtimes" });
  }
};
