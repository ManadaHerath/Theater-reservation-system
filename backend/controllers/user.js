import { connection } from "../index.js";
import bcrypt from "bcrypt";

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

export const changePassword = async (req, res) => {
  const updateDbquery = "UPDATE users SET password = ? WHERE id = ?";
  const getPasswordDbquery = "SELECT password from users where id = ?";
  const id = req.user.id;
  const { previous_Password, new_password, confirm_password } = req.body;

  try {
    const [user] = await connection.query(getPasswordDbquery, [id]);
    const isPasswordCorrect = await bcrypt.compare(
      previous_Password,
      user[0].password
    );
    if (!isPasswordCorrect) {
      return res.status(200).send("Invalid password");
    }

    if (new_password !== confirm_password) {
      return res.status(200).send("Passwords do not match");
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await connection.query(updateDbquery, [hashedPassword, id]);
    res.status(201).send("Password updated successfully");
  } catch (error) {
    res.status(500).send("Error updating password");
    console.log("Error updating password", error);
  }
};
