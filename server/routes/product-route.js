const ProductController = require('../controllers/ProductController');

const routes = require('express').Router();
routes.get("/", ProductController.getAllProduct);
routes.post("/", ProductController.addMasterProduct);
routes.post("/add-to-carts", ProductController.addToCartProduct);
routes.patch("/checkouts", ProductController.checkoutProduct);

module.exports = routes;