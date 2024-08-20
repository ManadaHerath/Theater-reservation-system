import { v4 as uuidv4 } from "uuid";

// return a new token

export const tokenGen = () => {
  const token = uuidv4();
  console.log('token:', token);
  return token;
};

