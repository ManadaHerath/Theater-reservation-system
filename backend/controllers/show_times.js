import {connection} from '../index.js';
export const getAllShowTimes = async (req, res) => {
  try {

    const [show_times] = await connection.query('SELECT show_times.id,theatre_id,start_time,end_time,m.title,m.poster_url,t.name FROM show_times inner join movies m on show_times.movie_id = m.id inner join theatres t on show_times.theatre_id = t.id');

    console.log(show_times);
    res.json(show_times);
  } catch (error) {
    console.error('Error fetching show times:', error);
    res.status(500).json({message: 'Error fetching show times'});
  }
}

