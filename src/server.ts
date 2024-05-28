import config from "./app/config/index";
import app from "./app";
import mongoose from "mongoose";

async function main() {
  try {
    await mongoose.connect(config.databaseURl as string);
    app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
