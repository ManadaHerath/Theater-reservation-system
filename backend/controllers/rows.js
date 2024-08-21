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


export const addRows = async (req,res,next) =>{
  try{
    const {rows,theatreId} = req.body;
    console.log(rows,theatreId)
    const insertPromises = rows.map(async (row) => {
      const {row_label, price_category_id,number} =row;
      const [result] = await connection.query('INSERT INTO rovs (theatre_id,row_label,price_category_id,number) VALUES (?,?,?,?)',[theatreId,row_label,price_category_id,number]);
    });

    await Promise.all(insertPromises);
    res.send('Rows added successfully').status(200);
    }catch(error){
      next(error)
    }




  
}