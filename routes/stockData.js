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
  .then(chartStocks => {
    let promises = [];
    let delay = 5000; // delay to minimize requests/min

    for(let chartStock of chartStocks) {
      let promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(StockDataAPI.search(chartStock.ticker));
        }, delay);
        delay += 5000;
      });

      promises.push(promise);
    }

    // Retrieve data for all chart-stocks
    Promise.all(promises)
    .then(results => {
      let chartData = [];
      let limitReached = false;
      let invalidTicker = false;
      for(let result of results) {
        if(result.data["Weekly Time Series"]) {
          chartData.push(result.data["Weekly Time Series"]);
        } else if(result.data["Note"]) {
          // API request limit reached (5 requests/min)
          limitReached = true;
          break;
        } else {
          // Invalid ticker
          invalidTicker = true;
          break;
        }
      }

      if(limitReached) {
        res.json({
          success: false,
          error: "limit",
          message: "API limit has been reached (5 req/min)"
        })
      } else if(invalidTicker) {
        res.json({
          success: false,
          error: "invalid",
          message: "Invalid ticker (chart reset)"
        })
      } else {
        res.json({
          success: true,
          chartStocks,
          chartData
        })
      }
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
});

module.exports = stockDataRoutes;