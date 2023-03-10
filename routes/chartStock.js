const express = require("express");
const chartStockRoutes = express.Router();
// Models
const ChartStock = require("../models/chartStockModel");

chartStockRoutes.route("/api/chartStock")
//----- Create new chart-stock
.post((req, res) => {
  ChartStock.find({})
  .then(allDocs => {
    // Check limit (max = 2)
    if(allDocs.length >= 2) {
      return { error: "Limit reached (2 stocks)" };
    } else {
      // Create
      let newChartStock = new ChartStock({
        ticker: req.body.ticker
      });
      // Save
      return newChartStock.save();
    }
  })
  .then(result => {
    if(result.error) {
      res.json({
        success: false,
        message: result.error
      })
    } else {
      res.json({ success: true })
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      success: false,
      message: "Duplicate stock"
    })
  });
})
//----- Delete a chart-stock
.delete((req, res) => {
  ChartStock.findOneAndDelete({
    ticker: req.body.ticker
  })
  .then(deleteDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

chartStockRoutes.route("/api/chartStock/all")
//----- Retrieve all chart-stocks
.get((req, res) => {
  ChartStock.find({})
  .then(chartStocks => {
  res.json({
      success: true,
      chartStocks
    })
  })
  .catch(err => console.log(err));
})
//----- Delete all chart-stocks
.delete((req, res) => {
  ChartStock.deleteMany({})
  .then(delCount => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

module.exports = chartStockRoutes;