const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const food = new Schema({
  id_food: {
    type: mongoose.Types.ObjectId,
    ref: "food",
  },
  qty: {
    type: Number,
    required: true,
    default: 1,
  },
  total: {
    type: Number,
    required: true,
    default: 1,
  },
});

const transaction = new Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      default: "",
    },
    payment: {
      type: Number,
      required: true,
      default: 1,
    },
    charge: {
      type: String,
      required: true,
      default: "",
    },
    food: [food],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transaction", transaction);
