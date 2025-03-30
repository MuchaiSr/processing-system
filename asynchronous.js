(() => { // This part deals with a simple fetch without implementing anything else.
    function fetchUserData() { 
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve(`success`);
                } else {
                    reject(`Could not fetch data`);
                }
            }, Math.random() * 3000);
        });
    }

    async function fetchSystem() {
        try {
            const result = await fetchUserData();
            console.log(result);
        } catch (error) {
            console.error("An error ocurred: ", error);
        }
    }
    fetchSystem();
})();

(() => { // Here, the idea was to understand how to implement a retry operation because there might be issues when it comes to fetching, and so instead of having one attempt, we can have multiple attempts.
    function simulateFetch() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() >  0.2) {
                    resolve("Fetch Succeded");
                } else {
                    reject("Fetch Failed");
                }
            }, 1000);
        });
    }

    async function retry(retries, delay) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const fetchAttempt = await simulateFetch();
                console.log(fetchAttempt);
                return fetchAttempt;
            } catch(error) {
                if (attempt < retries) {
                    console.log(`Attempting again in ${delay / 1000} seconds`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                } else {
                    console.log(`Failed. Number of retries exceeded`);
                }
            }
        }
    }
    retry(3, 1000);
})();

(() => { // Here, the idea is similar to the one above, but here, I implement an operation that causes the delay to be doubled in each attempt the operation has to go through.
    function simulateFetch() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.2) {
                    resolve("User data fetched");
                } else {
                    reject("Failed to fetch user data");
                }
            }, 1000);
        });
    }

    async function retry(retries, delay) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const result = await simulateFetch();
                console.log(result);
                return result;
            } catch(error) {
                if (attempt < retries) {
                    console.log(`${attempt}: Failed to fetch user data. Retrying in ${delay / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    console.log("All attempts failed");
                }
            }
        }
    }
    retry(5, 1000);
})();

(() => { // This part deals with simulating a fetch but this time the data is not connected like how it would be connected in an order processing system. 
// This time, the fetch occurs concurrently i.e each operation takes place on it's own and does not depend upon the completion of another process, meaning that we dont have to build a chain.
// Thus we simply go directly to using Promise.all() but before we can do that, we have to store our calling functions in an array because the nature of the method Promise.all() is that it deals with a lot of things.

    function simulateFetchUser() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.7) {
                    resolve("User Data Fetched");
                } else {
                    reject("Failed to fetch user data");
                }
            }, Math.random() * 1000);
        });
    }

    function simulateFetchPosts() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.7) {
                    resolve("Posts data fetched");
                } else {
                    reject("Failed to fetch posts data");
                }
            }, Math.random() * 1000);
        });
    }
    
    function simulateFetchComments() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.7) {
                    resolve("Comments data fetched");
                } else {
                    reject("Failed to fetch comments data");
                }
            }, Math.random() * 1000);
        });
    }

    async function fetchSystem() {
        try {
            const result = await Promise.all([
                simulateFetchUser(), 
                simulateFetchPosts(), 
                simulateFetchComments()
            ]);
            console.log("All data fetched successfully: ", result);
        } catch (error) {
            console.log("Error: ", error)
        }
    }
    fetchSystem();
})();

(() => { // This part was meant to go through Promise.race() which is another Promise method.
    // The method basically picks the operation that resolves first.
    //  In this case, that would be the second operation because the time it takes is 1 second, compared to the others.
    function simulateFetch1() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Fetch 1 succeeded");
            }, 2000);
        });
    }
    
    function simulateFetch2() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Fetch 2 succeeded");
            }, 1000);
        });
    }
    
    function simulateFetch3() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("Fetch 3 failed");
            }, 1500);
        });
    }

    async function raceFunctions() {
        try {
            const results = await Promise.race([
                simulateFetch1(), 
                simulateFetch2(), 
                simulateFetch3()
            ]);
            console.log("The first resolved promise: ", results)
        } catch(error) {
            console.log("Error: ", error);
        }
    }
    raceFunctions();
})();

(() => { // This is meant to simulate a fetch and after fetching the data, the data should be stored using localStorage(), 
    // while implementing a retry operation incase the fetch fails due to some error.
    async function fetchData(retries, delay) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users");
                const responseData = await response.json();
                console.log(responseData);
        
                const stringifyResponseData = JSON.stringify(responseData);
                localStorage.setItem("users", stringifyResponseData);
                const displayData = JSON.parse(localStorage.getItem("users"));
                console.log(displayData);
                return displayData;
            } catch (error) {
                if (attempt < retries) {
                    console.log(`Failed. Attempting again in ${delay / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout((resolve), delay));
                } else {
                    console.error(error);
                }
            }
        }
    }
fetchData(3, 1000);
})();

(() => { // This is meant to implement an expiry date to the saved data. 
    // Notice how you access the expiryDate within the object.
    // Remember if you want to access anything in an object, you need to use the key/property-value method.
    async function fetchDataWithExpiry(url, ttl) {
        try {
            const storageTime = Date.now();
            const value = {value: "userNames", expiryDate: storageTime + ttl};

            const currentTime = Date.now();

            if (currentTime >= value.expiryDate) {
                const response = await fetch(url);
                const objectData = await response.json();
                localStorage.setItem("users", JSON.stringify(objectData));
                const displayData = localStorage.getItem("users");
                return (console.log(JSON.parse(displayData)));
            } else {
                const displayData = JSON.parse(localStorage.getItem("users"));
                return (console.log(displayData));
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchDataWithExpiry("https://jsonplaceholder.typicode.com/users", 5000);
})();

(() => { // This operation implements a more complex operation compared to what I have been doing before.
    // Here, we are implementing an expiry date and attaching that expiry date to a value.
    // The operation is a time based operation. 
    //If the current time is greater than the value's expiry date/time, we fetch new data and before we can save that data in either localStorage() or sessionStorage(), we remove the old data by removing the key, then we save the new data.
    async function fetchDataWithExpiry(url, ttl, retries, delay,storageType) {
        const storage = storageType === "local" ? localStorage : sessionStorage;
        const key = `fetchedData`;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const storedData = storage.getItem(key); // Notice that the operation begins by getting the stored data from the storage medium.

                if (storedData) { // The reason we begin by checking whether the storage medium has any data is because of how the logic works.
                    const displayData = JSON.parse(storedData);

                    if (Date.now() >= displayData.expiryDate) {
                        console.log(`Attempting clear and refetch`);

                        const storageTime = Date.now();
                        const expiryDate = storageTime + ttl;
    
                        const newResponse = await fetch(url);
                        const newObjectData = await newResponse.json();
                        const newUsers = {value: newObjectData, expiry: expiryDate};
                        const newStringData = JSON.stringify(newUsers);
                        
                        storage.removeItem(key); // Notice how the key is removed.

                        storage.setItem(key, newStringData);
    
                        return console.log(newUsers);
                    } else {
                        console.log(`Fetching stored data`);
                        return console.log(displayData);
                    }
                } else {
                    console.log(`Fetching new data`);
                    const response = await fetch(url);
                    const objectData = await response.json();
                    const storageTime = Date.now();
                    const expiryDate = storageTime + ttl;
                    const newUsers = { value: objectData, expiryDate };

                    storage.setItem(key, JSON.stringify(newUsers));  // Store new data

                    return console.log(newUsers);  // Display new data
                }
            } catch (error) {
                console.error(`An error occurred.`, error);

                if (attempt < retries) {
                    console.log(`Retrying in ${delay / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout((resolve), delay));
                } else {
                    console.error(`All attempts failed`);
                }
            }
        }
    }
    fetchDataWithExpiry("https://jsonplaceholder.typicode.com/users", 5000, 3, 1000, "local");
})();

(() => {
    async function fetchUserSettingsWithExpiry(url, ttl, retries, delay, storageType) {
        const storage = storageType === "local" ? localStorage: sessionStorage;
        const key = "fetchedData";

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const retrievedData = storage.getItem(key); // Notice that you need to first get the data without even parsing this data.

                if (retrievedData) {
                    const parsedData = JSON.parse(retrievedData);

                    if (Date.now() >= parsedData.expiryDate) {
                        const newResponse = await fetch(url); // If you refetch, I think it is best to define your variables as new, because you are conducting a refetch
                        const newObjectData = await newResponse.json();

                        const newStorageTime = Date.now();
                        const expiryDate = newStorageTime + ttl;
                        const newUsers = {users: newObjectData, expiryDate};

                        storage.removeItem(key);

                        storage.setItem(key, JSON.stringify(newUsers)); // localStorage() and sessionStorage() does not return anything
                        console.log(newUsers);
                        return newUsers;
                    } else {
                        console.log("Displaying stored data", parsedData);
                    }
                } else {
                    const response = await fetch(url);
                    const objectData = await response.json();
                    
                    const storageTime = Date.now();
                    const expiryDate = storageTime + ttl;
                    const users = {value: objectData, expiryDate};

                    storage.setItem(key, JSON.stringify(users));
                    console.log(users);
                    return users;
                }
            } catch (error) {
                console.error("An error occured", error);

                if (attempt < retries) {
                    console.log(`Attempting again in ${delay / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout((resolve), delay)); 
                } else {
                    console.log("All attempts failed");
                }
            }
        }
    }
    fetchUserSettingsWithExpiry("https://jsonplaceholder.typicode.com/users", 600000, 3, 2000, "local");
})();