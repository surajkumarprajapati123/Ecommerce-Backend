const app = require("./app");
const mongoose = require("mongoose");

//  Handling Uncaugth Expection
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
});

mongoose.connect(process.env.MONGO_URL).then((d) => {
  console.log(`Databse is connected  and host is ${d.connection.host}`);
});

// console.log(youtube)
const server = app.listen(process.env.PORT);
{
  console.log(`service is runing port is ${process.env.PORT}`);
}
process.on("unhandledRejection", (err) => {
  console.log(`Error :${err.message}`);
  console.log(" due to UnhandledRejection  erro ");
  server.close();
  process.exit(1);
});
