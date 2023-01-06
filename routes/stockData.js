const express = require("express");
const stockDataRoutes = express.Router();
// Models
const ChartStock = require("../models/ChartStockModel");
// APIs
const StockDataAPI = require("../apis/StockDataAPI");

//----- Retrieve weekly data for all chart-stocks
stockDataRoutes.get("/api/stockData/stocks", (req, res) => {
  // Get all chart-stocks
  ChartStock.find({})
  .then(allDocs => {
    let promises = [];
    let delay = 1000; // delay to minimize requests/min

    for(let chartStock of allDocs) {
      let promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(StockDataAPI.search(chartStock.ticker));
        }, delay);
        delay += 1000;
      });

      promises.push(promise);
    }

    // Retrieve data for all chart-stocks
    return Promise.all(promises);
  })
  .then(results => {
    let chartData = [];
    for(let result of results) {
      chartData.push(result.data["Weekly Time Series"]);
    }
    res.json({
      success: true,
      chartData
    })
  })
  .catch(err => {
    console.log("-----")
    console.log(err)
  });
});

module.exports = stockDataRoutes;