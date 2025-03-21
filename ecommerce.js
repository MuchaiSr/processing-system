(() => {
    function placeOrder(orderId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Order ${orderId} placed`);
                resolve(orderId);
            }, 1000);
        });
    }

    function processPayment(orderId) {
        return new Promise((resolve, reject) => {
            setTimeout (() => {
                console.log(`Processing Payment for order ${orderId}`);
                if (Math.random() > 0.2) {
                    console.log(`Payment succsessful for order ${orderId}`);
                    resolve(orderId);
                } else {
                    reject(`Payment failed for order ${orderId}. Transaction declined.`);
                }                    
            }, 1500);
        });
    }

    function packOrder(orderId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Order ${orderId} packed`);
                resolve(orderId);
            }, 1000);
        })
    }

    function shipOrder(orderId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Order ${orderId} shipped`);
                resolve(orderId);
            }, 1000);
        });
    }

    function deliverOrder(orderId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Order ${orderId} delivered`);
                resolve(orderId);
            }, 1000);
        });
    }

    placeOrder(98765)
    .then((placedOrder) => {
        return processPayment(placedOrder);
    })
    .then((processedPaymentOrder) => {
        return packOrder(processedPaymentOrder);
    })
    .then ((packedOrder) => {
        return shipOrder(packedOrder);
    })
    .then((shippedOrder) => {
        return deliverOrder(shippedOrder);
    })
    .then(() => {
        console.log("Order completed successfully!")
    })
    .catch((error) => {
        console.error("An error ocurred:", error);
    });
})();