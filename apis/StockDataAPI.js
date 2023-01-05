const api = require("./configs/axiosConfig");

//----- Retrieve weekly data for stock
const search = async ticker => {
  const endpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
  const res = await api.request({
    method: "GET",
    url: endpoint
  });

  return res;
};

module.exports = { search };