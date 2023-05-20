const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connection = async function databaseConnection() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URL_LOCAL, {
      useNewUrlParser: true,
    })
    .then(() => console.log(`Connected to mongoDB Successfully on port`))
    .catch((err) => console.log("mongoDB connection failed", err));
};
module.exports = connection;
