(() => {
    //This constitutes an implementation of a processing system that works sequentially, i.e 
    //every item is processed to completion before another item is processed in any capacity.
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
                setTimeout(() => {
                    if (Math.random() > 0.2) {
                        console.log(`Payment succsessful for order ${orderId}`);
                        resolve(orderId);
                    } else {
                        reject(`Payment failed for order ${orderId}. Transaction declined.`);
                    }     
                }, 1000);               
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

        async function orderSystem (orderId) {
            try {
                const placeOrderStep = await placeOrder(orderId);
                const processedPaymentStep = await processPayment(placeOrderStep);
                const packOrderStep = await packOrder(processedPaymentStep);
                const shipOrderStep = await shipOrder(packOrderStep);
                const deliverOrderStep = await deliverOrder(shipOrderStep);
    
                setTimeout(() => {
                    console.log("Orders completed successfully!")
                }, 1000);
            } catch (error) {
                console.error("Error: ", error);
            } 
        }

        async function moreIdsSystem (orderIds) {
            for (let id of orderIds) {
                await orderSystem(id);
            }
        }
        moreIdsSystem([1,2,3,4,5]);

        //This point on constitutes parallel processing of numerous items with some small differences to how 
        //Promise.all() and Promise.allSettled() work. Promise.all() rejects immediately if any promise fails. 
        //Promise.allSettled() never rejects. It gives you the status of every promise, whether it resolved or rejected.


        async function moreSystems (otherIds) {
            try {
                const promiseArrays = otherIds.map((id) => {
                    orderSystem(id);
                });
                await Promise.all(promiseArrays);
                console.log("All orders completed successfully.");
            } catch (error) {
                console.error(error);
            }
        }
        moreSystems([6,7,8,9,0]);

        function fetchUserData(value) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (value % 2 === 0) {
                        resolve(`${value} fetched successfully`);
                    } else {
                        reject(`${value} failed to fetch`);
                    }
                }, 1000);
            });
        }

        async function baseSystem(userIds) {
            try {
                const results = await Promise.allSettled(userIds.map((id) => {
                    return fetchUserData(id);
                }));
                console.log(results);
            } catch (error) {
                console.error(error);
            }
        }
        baseSystem([1,2,3,4,5]);
})();