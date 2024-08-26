import {connection} from '../index.js';
export const getAllShowTimes = async (req, res) => {
  try {

    const [show_times] = await connection.query('SELECT s.theatre_id,s.id,s.start_time,s.end_time,m.title,m.poster_url,t.name FROM show_times s inner join movies m on s.movie_id = m.id inner join theatres t on s.theatre_id = t.id');
    console.log(show_times);
    res.json(show_times);
  } catch (error) {
    console.error('Error fetching show times:', error);
    res.status(500).json({message: 'Error fetching show times'});
  }
}

