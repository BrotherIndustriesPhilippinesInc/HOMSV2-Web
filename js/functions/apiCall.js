export default async function apiCall(url, method = "GET", body = null, isDebug = false) {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${data.error || response.statusText}`);
        }

        if (isDebug) {
            console.log("API Response:", data);
        }

        return data;
    } catch (error) {
        console.error("API Call Failed:", error.message);
        throw error; // Return null to indicate failure
    }
}