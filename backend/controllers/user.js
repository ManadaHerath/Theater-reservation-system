import { connection } from "../index.js";

export const getUserbyID = async (req, res, next) => {
  const dbquery = "SELECT * from users where id = ?";
  try {
    const id = req.user.id;
    const [userDetails] = await connection.query(dbquery, [id]);
    res.json(userDetails);
  } catch (error) {
    console.log("Error fetching user details from user.js:", error);
  }
};

export const updateUser = async (req, res) => {
  const dbquery =
    "UPDATE users SET full_name = ?, address = ?, birthday = ?, gender=?, phone_number=?,avatar =? WHERE id = ?";

  try {
    const { full_name, address, birthday, gender, phone_number, avatar } =
      req.body;
    const id = req.user.id;

    await connection.query(dbquery, [
      full_name,
      address,
      new Date(birthday).toISOString().substring(0, 10),
      gender,
      phone_number,
      avatar,
      id,
    ]);
    res.status(201).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user");
    console.log("Error updating user details", error);
  }
};
