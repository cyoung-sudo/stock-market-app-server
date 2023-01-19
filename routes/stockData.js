const express = require("express");
const stockDataRoutes = express.Router();
// APIs
const StockDataAPI = require("../apis/StockDataAPI");

//----- Retrieve weekly data for all chart-stocks
stockDataRoutes.post("/api/stockData/stocks", (req, res) => {
  let promises = [];
  let delay = 1000; // delay to minimize requests/min

  for(let chartStock of req.body.chartStocks) {
    let promise = new Promise(resolve => {
      setTimeout(() => {
        resolve(StockDataAPI.search(chartStock.ticker));
      }, delay);
      delay += 1000;
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
        chartStocks: req.body.chartStocks,
        chartData
      })
    }
  })
  .catch(err => console.log(err));
});

module.exports = stockDataRoutes;