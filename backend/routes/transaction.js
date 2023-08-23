const express = require("express");
const app = express.Router();
const mongoose = require("mongoose");
const foodModels = require("../models/food.model");
const rateLimit = require("../middleware/rate_limit");
const fs = require("fs");
const bodyParser = require("body-parser");
const foodModels = require("../models/food.model");
const transactionModels = require("../models/transaction.model");
const { json } = require("body-parser");
const XLSX = require("xlsx");

app.post("/api/create-transaction", async (req, res) => {
  const apiKey = req.get("apiKEY");
  if (apiKey != process.env.apiKEY) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const payment = req.body.payment;
  const charge = req.body.charge;
  const food = req.body.food;

  try {
    const transact = new transactionModels({
      payment: payment,
      charge: charge,
      food,
    });
    const result = await transact.save();

    return res.status(200).json({
      message: "Transaction Successful",
      data: result,
    });
  } catch (err) {
    console.log({
      message: "Internal Server Error",
      data: result,
    });
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.toString(),
    });
  }
});

app.get("/api/transaction", async (req, res) => {
  const apiKey = req.get("apiKEY");
  if (apiKey != process.env.apiKEY) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const data = await transactionModels.find().populate("food");
    const totalData = await transactionModels.countDocuments(filter);
    return res.status(200).json({
      totalData: totalData,
      data: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "internal server error", error: error.toString() });
  }
});

app.get("/api/debug", async (req, res) => {
  try {
    return res.status(200).json({
      message: "success",
      result: "tes",
      // data: currentDate,
    });
  } catch (error) {
    return res.status(400).json({
      message: "error",
      result: error.toString(),
      // data: currentDate,
    });
  }
});

module.exports = app;
