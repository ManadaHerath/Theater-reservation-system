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

export const createPurchase = async (req, res, next) => {
    try{
        const {theatre_id, show_time_id, seats} = req.body;
        const [purchase] = await connection.query('INSERT INTO purchases (theatre_id, show_time_id, seats) VALUES (?, ?, ?)', [theatre_id, show_time_id, seats]);
        res.json(purchase)
    }catch(error){
        next(error)
    }
}

export const createPurchaseFromSession = async (purchaseData,res) => {
  try{
      const {theatre_id, show_time_id, seats} = purchaseData.body;
      const [purchase] = await connection.query('INSERT INTO purchases (theatre_id, show_time_id, seats) VALUES (?, ?, ?)', [theatre_id, show_time_id, seats]);
      console.log('purchase:', purchase);
  }catch(error){
    console.error('Error creating purchase:', error);
  }
}