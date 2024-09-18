import { connection } from "../index.js";


export const postTheatreGrid = async (req, res, next) => {
    console.log(req.body);

const { screenPosition, grid, seatTypes, theatre_id } = req.body;

  if (!screenPosition || !grid || !seatTypes || !theatre_id) {
    return res.status(400).send('Invalid data');
  }

  const query = `
    INSERT INTO theater_grids (screen_position, grid, seat_types, theatre_id)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  screen_position = VALUES(screen_position),
  grid = VALUES(grid),
  seat_types = VALUES(seat_types);

  `;


  const [result] = await connection.query(query, [screenPosition, JSON.stringify(grid), JSON.stringify(seatTypes), theatre_id]); 
    if (result.affectedRows) {
        console.log("yee theatre grid added");
        res.status(200).json({ message: "Theatre grid created" });
    } else {
        res.status(500).json({ message: "Theatre grid not created" });
    }
};

export const getTheatreGrid = async (req, res, next) => {
    const { theatre_id } = req.params;
    console.log(theatre_id);

    if (!theatre_id) {
        return res.status(400).send('Invalid data');
    }

    const query = `
        SELECT * FROM theater_grids WHERE theatre_id = ?`;


    const [theatreGrid] = await connection.query(query, [theatre_id]);

    if (theatreGrid.length) {
        res.json(theatreGrid[0]);
    } else {
        res.status(404).json({ message: "Theatre grid not found" });
    }


};