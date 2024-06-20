import {connection} from "../index.js";


export const getPurchasedSeats = async (req, res, next) => {
    try{
        const {theatreId, showId} = req.params;
        const [purchasedSeats] = await connection.query('SELECT * FROM purchases WHERE theatre_id = ? AND show_time_id = ?' , [theatreId, showId]);
        if(purchasedSeats.length){
          res.json(purchasedSeats)
        }else{
          res.status(404).json({message: 'Purchased seats not found'})
        }
      }catch(error){
        next(error)
      }
}