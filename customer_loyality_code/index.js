const list_order_data = require("./order_data");
const list_transaksi_data = require("./transaction_data");

const calculatePoints = (dataTransaction, dataOrders) => {
    let result = {};
    dataOrders.forEach(dataOrder => {
        const user = dataOrder.user;
        const currentTransaction = dataTransaction.filter(transaction => transaction.user === user);
        let totalAmountTransaction = 0;
        let totalPoints = 0;
        let totalItems = 0;

        currentTransaction.forEach(transaction => {
            totalAmountTransaction += transaction.total_amount_transaction;
        });

        dataOrder.products.forEach(product => {
            totalItems += product.qty;
        });

        if (totalAmountTransaction < 1000000) {
            totalPoints = totalAmountTransaction / 10000;
        } else if (totalAmountTransaction >= 1000000 && totalAmountTransaction < 10000000) {
            totalPoints = (totalAmountTransaction / 10000) * 1.05;
        } else if (totalAmountTransaction >= 10000000 && totalAmountTransaction < 20000000) {
            totalPoints = (totalAmountTransaction / 10000) * 1.1;
        } else if (totalAmountTransaction >= 20000000 && totalAmountTransaction < 30000000) {
            totalPoints = (totalAmountTransaction / 10000) * 1.2;
        } else if (totalAmountTransaction >= 30000000 && totalAmountTransaction < 40000000) {
            totalPoints = (totalAmountTransaction / 10000) * 1.3;
        } else if (totalAmountTransaction >= 40000000) {
            totalPoints = (totalAmountTransaction / 10000) * 1.4;
        }
        result[user] = { totalAmountTransaction, totalPoints, totalItems };
    });
    return result;
};


console.log(calculatePoints(list_transaksi_data, list_order_data));