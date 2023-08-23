const express = require("express");
const app = express.Router();
const foodModels = require("../models/food.model");
const rateLimit = require("../middleware/rate_limit");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { query, body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post(
  "/api/create-food",
  upload.single("imageUrl"),
  rateLimit,
  body("name").notEmpty().withMessage("name can't empty!"),
  body("price").notEmpty().withMessage("price can't empty!"),
  async (req, res) => {
    const apiKey = req.get("apiKEY");
    if (apiKey != process.env.apiKEY) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const name = req.body.name;
    const price = req.body.price;
    let imageUrl;
    if (!req.file) {
      imageUrl = "public/1.jpg";
    } else {
      imageUrl = path
        .join("public/", Date.now() + path.extname(req.file.path))
        .replace("\\", "/");
      await sharp(req.file.path)
        .resize()
        .jpeg({ quality: 50 })
        .toFile(imageUrl);
      fs.unlinkSync(req.file.path.replace("\\", "/"));
    }
    try {
      const food = new foodModels({
        name: name,
        photo: imageUrl,
        price: price,
      });
      const result = await food.save();

      return res.status(200).json({ message: "food created!", data: result });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "internal server error", error: err.toString() });
    }
  }
);

app.get("/api/foods", rateLimit, async (req, res) => {
  try {
    const get_all_foods = await foodModels.find();
    return res
      .status(200)
      .json({ message: "success fetch foods", data: get_all_foods });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

app.delete(
  "/api/food",
  rateLimit,
  query("id").notEmpty().withMessage("id can't empty!"),
  async (req, res) => {
    try {
      const del = await foodModels.findByIdAndRemove(req.query.id);
      return res.status(200).json({ message: "success delete food" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "internal server error" });
    }
  }
);

module.exports = app;
