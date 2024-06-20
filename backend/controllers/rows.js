import {connection} from '../index.js';


export const getRows = async (req, res, next) => {
    try{
        const { id } = req.params;
        const [rows] = await connection.query('SELECT * FROM rovs WHERE theatre_id = ?', [id]);
        if(rows.length){
          res.json(rows)
        }else{
          res.status(404).json({message: 'Rows not found'})
        }
      }catch(error){
        next(error)
      }
}


export const getSeats = async (req, res, next) => {
  try{
      const {id} = req.params;
      const [seats] = await connection.query('SELECT * FROM seats WHERE row_id = ?', [id]);
      if(seats.length){
        res.json(seats)
      }else{
        res.status(404).json({message: 'Seats not found'})
      }

  }catch(error){
    next(error)
  }
}