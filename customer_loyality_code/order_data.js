const order_data_1 = require("./data/order_1.json");
const order_data_2 = require("./data/order_2.json");
const order_data_3 = require("./data/order_3.json");
const order_data_4 = require("./data/order_4.json");
const [order_data_5] = require("./data/order_5.json");

const list_order_data = [];

list_order_data.push(order_data_1, order_data_2, order_data_3, order_data_4, order_data_5);

// console.log(list_order_data);

module.exports = list_order_data;