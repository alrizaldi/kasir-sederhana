const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const actuator = require("express-actuator");
const morgan = require("morgan");
const serveIndex = require("serve-index");
const foodRoutes = require("./routes/food");
// const importData = require("./config/import_data");
// const onHandRoutes = require("./routes/itu_invent_onhand");
// const warehouseRoutes = require("./routes/warehouse");
const { morganOptions, actuatorOptions } = require("./config/index");
require("dotenv").config();
require("./config/db");
require("./config/index");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan(morganOptions));
app.use(actuator(actuatorOptions));
app.use("/api/public", serveIndex(__dirname + "/public"));
app.use("/api/public", express.static(path.join(__dirname, "public")));
app.use(foodRoutes);
app.use((req, res, next) => {
  const url = req.originalUrl;
  res.status(404).json({ message: `API ${url} Not Found` });
});
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kasir Sederhana API" });
});

app.listen(3000, () => {
  console.log("HTTP Server are created and started at port 3000");
});
