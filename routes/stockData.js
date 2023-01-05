const express = require("express");
const stockDataRoutes = express.Router();
// APIs
const StockDataAPI = require("../apis/StockDataAPI");

//----- Retrieve weekly data for stock
stockDataRoutes.post("/api/stockData", (req, res) => {
  StockDataAPI.search(req.body.ticker)
  .then(weeklyData => {
    res.json({
      success: true,
      weeklyData: weeklyData.data["Weekly Time Series"]
    })
  })
  .catch(err => console.log(err));
});

module.exports = stockDataRoutes;