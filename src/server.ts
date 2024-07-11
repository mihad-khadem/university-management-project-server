import config from "./app/config/index";
import app from "./app";
import mongoose from "mongoose";
import { Server } from "http";

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.databaseURL as string);
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
// handling unhandled rejection (async)
process.on("unhandledRejection", () => {
  console.log("Unhandled rejection. Shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// handling uncaught exception (sync)
process.on("uncaughtException", () => {
  console.log("Uncaught exception. Shutting down...");
  process.exit(1);
});
