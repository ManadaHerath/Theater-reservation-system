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
    "SELECT * from users";
  try {
    const [users] = await connection.query(dbquery);
    res.json(users);
  } catch (error){
    console.log("Error fetching all users from user.js:", error);
    res.status(500).json({ message: "Error fetching all users" });
  }
}

export const getAnyUser = async (req, res,next) => {
    const dbquery =
      "SELECT * from users where id = ?";
    try {

      const {id} =req.query
      const [userDetails] = await connection.query(dbquery, [id]);
      res.json(userDetails);
    } catch (error) {
      console.log("Error fetching user details from user.js:", error);
    }
  };

  // Update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, role, email, phone_number, birthday, address, is_completed, is_active } = req.body;

  const updateQuery = `
    UPDATE users 
    SET full_name = ?, role = ?, email = ?, phone_number = ?,birthday = ?, address = ?, is_completed = ?, is_active = ?
    WHERE id = ?
  `;

  try {
    const [result] = await connection.query(updateQuery, [
      full_name, role, email, phone_number, birthday, address, is_completed, is_active, id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  try {
    const [result] = await connection.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};
