const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const products = require("../fixtures/products.json");

router.get("/load-products", async (request, res) => {
  try {
    await Product.insertMany(products);
    res.json({ success: true, message: "Fixture data loaded successfully" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
