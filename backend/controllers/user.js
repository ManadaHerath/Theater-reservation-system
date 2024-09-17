import { connection } from "../index.js";

export const getUserbyID = async (req, res,next) => {
    const dbquery =
      "SELECT full_name,avatar from users where id = ?";
    try {

      const id = req.user.id; 
      const [userDetails] = await connection.query(dbquery, [id]);
      res.json(userDetails);
    } catch (error) {
      console.log("Error fetching user details from user.js:", error);
    }
  };
  