const axios = require("axios");

// Initialize axios instance with custom configs
const api = axios.create({
   withCredentials: true,
  headers: { "Custom-Language": "en" }
});

module.exports = api;