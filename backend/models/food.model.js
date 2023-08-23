const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const food = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("food", food);
