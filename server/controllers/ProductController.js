const redis = require('../config/connectRedis');
const { Product } = require('../models');
const { sequelize, Sequelize } = require('../models');


class ProductController {


    static async getAllProduct(req, res, next) {
        try {
            let redisKey = 'klink_test/products';
            let exists = await redis.exists(redisKey);
            if (exists === 1) {
                let products = JSON.parse(await redis.get(redisKey));
                res.send({
                    products: products
                });
            } else {
                let products = await Product.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
                await redis.set(redisKey, JSON.stringify(products));
                res.status(200).send({
                    products: products
                });
            }
        } catch (error) {
            next(error);
        }
    }

    static async addMasterProduct(req, res, next) {
        const transaksi = await sequelize.transaction();

        try {


            const { name, price, stock } = req.body;

            if (!name || !price || !stock) {
                throw { name: `incomplete_add_master_product` };
            }

            const addedProduct = await Product.create({ name, price, stock });
            const findProduct = await Product.findOne({ where: { name } });
            // Check if exist
            if (findProduct) {
                throw { name: `product_already` };
            }

            // update the key
            let redisKey = 'klink_test/products';
            await redis.del(redisKey);
            let products = await Product.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
            await redis.set(redisKey, JSON.stringify(products));

            await transaksi.commit();

            res.status(201).send({ message: `new Product ${name} with price ${price} and stock of ${stock} created. ` });



        } catch (error) {
            await transaksi.rollback();

            next(error);
        }
    }

    static async addToCartProduct(req, res, next) {

        try {
            const { username } = req.userLogged;

            if (!req.body.name || !req.body.stock) {
                throw { name: "incomplete_add_master_product" };
            }

            let bodyName = req.body.name;
            let findProduct = await Product.findOne({ where: { name: bodyName } });
            if (!findProduct) {
                throw { name: `product_not_found` };
            }

            let redisKey = `klink_test/checkout_user:${username}`;
            let exists = await redis.exists(redisKey);
            let checkoutUser;
            if (exists === 1) {
                // update the key
                checkoutUser = JSON.parse(await redis.get(redisKey));
                checkoutUser.products.push(req.body);
            } else {
                //create the key
                checkoutUser = {
                    username: username,
                    products: [req.body]
                };
            }
            await redis.set(redisKey, JSON.stringify(checkoutUser));


            res.status(201).send({ message: `Cart user ${username} with products ${req.body.name} qty ${req.body.stock} listed` });


        } catch (error) {

            next(error);
        }

    }

    static async checkoutProduct(req, res, next) {
        const transaksi = await sequelize.transaction();

        try {

            const { username } = req.userLogged;


            let redisKey = `klink_test/checkout_user:${username}`;
            let exists = await redis.exists(redisKey);
            if (exists === 1) {
                let checkoutUser = JSON.parse(await redis.get(redisKey));
                let productPromises = checkoutUser.products.map(async (product) => {
                    let foundProduct = await Product.findOne({ where: { name: product.name } });
                    if (!foundProduct) throw { name: `product_not_found` };
                    if (foundProduct.stock < product.stock) throw { name: `stock_not_enough` };
                    await foundProduct.decrement('stock', { by: product.stock });
                    let price = foundProduct.price * product.stock;
                    return {
                        name: product.name,
                        decrementedStock: product.stock,
                        price: price
                    };
                });
                let decrementedProducts = await Promise.all(productPromises);
                let totalPrice = decrementedProducts.reduce((acc, curr) => acc + curr.price, 0);

                await redis.del(redisKey);

                // update the key
                let redisProdKey = 'klink_test/products';
                await redis.del(redisProdKey);
                let products = await Product.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
                await redis.set(redisProdKey, JSON.stringify(products));
                await transaksi.commit();

                res.status(200).send({
                    message: `Checkout completed`,
                    products: decrementedProducts,
                    totalPrice: totalPrice
                });
            } else {
                throw { name: `no_cart` };
            }



        } catch (error) {
            await transaksi.rollback();

            next(error);
        }

    }


}

module.exports = ProductController;