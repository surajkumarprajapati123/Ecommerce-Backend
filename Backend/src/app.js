const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routes = require("./routes/index");
const MiddelWareError = require("./middlewares/error");
const cookiePasrser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.use(cookiePasrser());
app.use(cors());
app.use(routes);

app.use(MiddelWareError);

module.exports = app;
