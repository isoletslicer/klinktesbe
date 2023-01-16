const UserController = require('../controllers/UserController');

const routes = require('express').Router();
const authentification = require('../middlewares/authentification');
const producRoutes = require("./product-route");

routes.get("/", (req, res) => {
    res.status(200).json({ message: `Hello Masuk ke server` });
});

routes.post('/register', UserController.registerMethod);
routes.post('/login', UserController.loginMethod);


routes.use(authentification);

routes.use('/products', producRoutes);


module.exports = routes;