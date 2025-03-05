import jwt from "jsonwebtoken";

export const generateToken = async (_id) => {
  try {
    const token = await jwt.sign({ _id: _id }, process.env.JWT_KEY);
    return token;
  } catch (error) {
    console.log(error);
  }
};
