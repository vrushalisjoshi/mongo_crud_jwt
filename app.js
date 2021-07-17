require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const dbConfig = require("./config/database");
const userRoutes = require("./api/users/user.router");

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to the database!");
  })
  .catch((err) => {
    console.log("Could not connect to the database..", err);
    process.exit();
  });

const port = process.env.port || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("Running on port", port);
});

app.get("/", (req, res, next) => {
  res.json({ message: "Hello World" });
});
