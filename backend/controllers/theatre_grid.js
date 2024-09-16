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
  `;

  connection.query(query, [screenPosition, JSON.stringify(grid), JSON.stringify(seatTypes), theatre_id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).send('Error saving data');
    }
    res.status(200).send('Data saved successfully');
  });

};