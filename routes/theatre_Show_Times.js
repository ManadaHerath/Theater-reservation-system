
import expresss from 'express';
import {connection} from '../index.js';
import {getShowTimes} from '../controllers/theatre_show_times.js';


const router = expresss.Router();
const dbquery =
  "SELECT start_time,end_time,title FROM show_times INNER JOIN movies ON show_times.movie_id = movies.id where show_times.theatre_id = ?";


router.get("/", getShowTimes);


export default router;
