import { connection } from "../index.js";

export const getUserbyID = async (req, res,next) => {
    const dbquery =
      "SELECT full_name,avatar from users where id = ?";
    try {

      const id = req.user.id; 
      const [userDetails] = await connection.query(dbquery, [id]);
      console.log("userDetails", userDetails);
      res.json(userDetails);
    } catch (error) {
      console.log("Error fetching user details from user.js:", error);
    }
  };
  
export const getAllUsers = async (req, res, next) => {
  const dbquery = 
    "SELECT full_name, email, role from users";
  try {
    const [users] = await connection.query(dbquery);
    console.log("All Users:", users);
    res.json(users);
  } catch (error){
    console.log("Error fetching all users from user.js:", error);
    res.status(500).json({ message: "Error fetching all users" });
  }
}