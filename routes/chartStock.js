const express = require("express");
const chartStockRoutes = express.Router();
// Models
const ChartStock = require("../models/ChartStockModel");

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
//----- Delete an existing chart-stock
.delete((req, res) => {
  ChartStock.findOneAndDelete({
    ticker: req.body.ticker
  })
  .then(deleteDoc => {
    res.json({ success: true });
  })
  .catch(err => console.log(err));
});

module.exports = chartStockRoutes;