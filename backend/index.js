import { app } from "./src/app.js";
import { connect } from "./src/database/connect.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
