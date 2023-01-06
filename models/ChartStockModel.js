const mongoose = require("mongoose");

const ChartStockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("ChartStock", ChartStockSchema);