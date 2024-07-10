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
export const getPricesByTheatre = async (req, res, next) => {
  console.log(req.params)
    
    const {theatreId} = req.params

    try{
        const [price_categories] = await connection.query('SELECT * FROM price_categories where theatre_id = ? ',[theatreId]);

        if (price_categories.length){
            res.json(price_categories);
        }else{
            res.status(404).json({message: 'Seat types not found'})
        }

    }catch(error){
        next(error)
    }
}

export const addSeatType = async (req, res, next) => {
    const { type_name, theatre_id  } = req.body;
  
    try {
      const [result] = await connection.query('INSERT INTO seat_types (type_name ,theatre_id ) VALUES (?, ?)', [type_name,theatre_id]);
  
      if (result.affectedRows === 1) {
        res.status(201).json({ message: 'Seat type added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add seat type' });
      }
    } catch (error) {
      next(error);
    }
  };

  export const addPriceType = async (req, res, next) => {
    const { priceCategories, theatreId } = req.body;
  
    try {
      const insertPromises = priceCategories.map(async (category) => {
        const { category_name, price } = category;
        const [result] = await connection.query(
          'INSERT INTO price_categories (category_name, price, theatre_id) VALUES (?, ?, ?)',
          [category_name, price, theatreId]
        );
        const [result2] = await connection.query(
            'INSERT INTO seat_types (type_name ,theatre_id ) VALUES (?, ?)',
            [category_name,theatreId]
          );
        return result;
      });
  
      const results = await Promise.all(insertPromises);
  
      // Check results for successful insertions
      const affectedRows = results.reduce((total, result) => total + result.affectedRows, 0);
      if (affectedRows === priceCategories.length) {
        res.status(201).json({ message: 'Price categories added successfully' });
      } else {
        res.status(400).json({ message: 'Failed to add all price categories' });
      }
    } catch (error) {
      next(error);
    }
  };

