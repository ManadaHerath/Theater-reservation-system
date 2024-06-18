import {connection} from '../index.js';
export const getAllShowTimes = async (req, res) => {
  try {

    const [show_times] = await connection.query('SELECT * FROM show_times');

    res.json(show_times);
  } catch (error) {
    next(error);
  }
}

