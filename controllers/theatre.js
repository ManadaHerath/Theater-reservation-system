import {connection} from '../index.js';

export const getTheatres = async(req,res) =>{
    try{
        const [movies] = await connection.query('SELECT * FROM theatres');

        res.json(movies)

    }catch(error){
        next(error)
    }
}