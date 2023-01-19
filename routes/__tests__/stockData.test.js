//----- Imports
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });
// APIs
const StockDataAPI = require("../../apis/StockDataAPI");

//----- Middleware
app.use(express.json()); // needed to test POST requests

//----- Routes
app.use(require("../stockData"));

// Mocks
jest.mock("../../apis/StockDataAPI");

describe("----- StockData Routes -----", () => {  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("/api/stockData/stocks", () => {
    //----- Test 1 -----
    it("(POST) successfully creates new chart-stock", done => {
      // Mock API functions
      StockDataAPI.search.mockResolvedValue({
        data: {
          "Weekly Time Series": {
            "2023-01-12": {
                "1. open": "144.0800",
                "2. high": "146.6600",
                "3. low": "142.9000",
                "4. close": "145.5500",
                "5. volume": "12124628"
            },
            "2023-01-06": {
                "1. open": "141.1000",
                "2. high": "144.2500",
                "3. low": "140.0100",
                "4. close": "143.7000",
                "5. volume": "13648755"
            }
          }
        }
      });

      request(app)
      .post("/api/stockData/stocks")
      .send({
        chartStocks: [
          { ticker: "AAPL" },
          { ticker: "GOOG" }
        ]
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.chartStocks).toBeDefined();
        expect(Array.isArray(res.body.chartStocks)).toBe(true);
        expect(res.body.chartData).toBeDefined();
        expect(Array.isArray(res.body.chartData)).toBe(true);
        done();
      });
    });
  });
});