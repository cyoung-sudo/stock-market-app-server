//----- Imports
const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const app = new express();
require("dotenv").config({ path: "./config.env" });

//----- Middleware
app.use(express.json()); // needed to test POST requests

//----- Routes
app.use(require("../chartStock"));

describe("----- ChartStock Routes -----", () => {
  beforeEach(done => {
    mongoose.connect(process.env.ATLAS_TESTING_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => {
      // Clear initial data
      const ChartStock = mongoose.model("ChartStock");
      return ChartStock.deleteMany({})
    })
    .then(() => done());
  }, 20000); // Increased timeout to handle slow connection
  
  afterEach(done => {
    // Clear test data
    const ChartStock = mongoose.model("ChartStock");
    ChartStock.deleteMany({})
    .then(() => mongoose.connection.close())
    .then(() => done());
  }, 20000);

  describe("/api/chartStock", () => {
    //----- Test 1 -----
    it("(POST) successfully creates new chart-stock", done => {
      request(app)
      .post("/api/chartStock")
      .send({
        ticker: "AAPL"
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBe(true);
        done();
      });
    });

    //----- Test 2 -----
    it("(DELETE) successfully deletes a chart-stock", done => {
      // Create chart-stock
      request(app)
      .post("/api/chartStock")
      .send({
        ticker: "AAPL"
      })
      .end(err => {
        if(err) return done(err);
        // Delete chart-stock
        request(app)
        .delete("/api/chartStock")
        .send({
          ticker: "AAPL"
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.statusCode).toBe(200);
          expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
          expect(res.body.success).toBeDefined();
          expect(res.body.success).toBe(true);
          done();
        });
      });
    });
  });

  describe("/api/chartStock/all", () => {
    //----- Test 3 -----
    it("(GET) successfully retrieve all chart-stocks", done => {
      // Create chart-stock
      request(app)
      .post("/api/chartStock")
      .send({
        ticker: "AAPL"
      })
      .end(err => {
        if(err) return done(err);
        // Create another chart-stock
        request(app)
        .post("/api/chartStock")
        .send({
          ticker: "GOOG"
        })
        .end(err => {
          if(err) return done(err);
          // Retrieve all chart-stocks
          request(app)
          .get("/api/chartStock/all")
          .end((err, res) => {
            if(err) return done(err);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.chartStocks).toBeDefined();
            // expect(Array.isArray(res.body.chartStocks)).toBe(true);
            // expect(res.body.chartStocks).toHaveLength(1);
            done();
          });
        });
      });
    });

    //----- Test 4 -----
    it("(DELETE) successfully deletes all chart-stocks", done => {
      // Create chart-stock
      request(app)
      .post("/api/chartStock")
      .send({
        ticker: "AAPL"
      })
      .end(err => {
        if(err) return done(err);
        // Create another chart-stock
        request(app)
        .post("/api/chartStock")
        .send({
          ticker: "GOOG"
        })
        .end(err => {
          if(err) return done(err);
          // Delete all chart-stocks
          request(app)
          .delete("/api/chartStock/all")
          .end((err, res) => {
            if(err) return done(err);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBe(true);
            done();
          });
        });
      });
    });
  });
});