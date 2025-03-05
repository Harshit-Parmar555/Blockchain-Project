import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection successfull with database");
  } catch (error) {
    console.log("Error in connecting with database");
  }
};
