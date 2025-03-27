(() => {
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

(() => {
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

(() => {
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

(() => { // This part deals with simulating a fetch but this time the data is not conneceted like how it would be connected in an order processing system. 
// This time, the fetch occurs concurrently meaning that we dont have to build a chain.
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

(() => {
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

(() => {
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