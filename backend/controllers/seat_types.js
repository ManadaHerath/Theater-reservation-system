import {connection} from "../index.js";



export const getSeatTypes = async (req, res, next) => {
    try{
        const [seat_types] = await connection.query('SELECT * FROM seat_types');

        if (seat_types.length){
            res.json(seat_types);
        }else{
            res.status(404).json({message: 'Seat types not found'})
        }

    }catch(error){
        next(error)
    }
}

export const getSeatPrices = async (req, res, next) => {
    try{
        const [seat_types] = await connection.query('SELECT * FROM price_categories');

        if (seat_types.length){
            res.json(seat_types);
        }else{
            res.status(404).json({message: 'Seat types not found'})
        }

    }catch(error){
        next(error)
    }
}