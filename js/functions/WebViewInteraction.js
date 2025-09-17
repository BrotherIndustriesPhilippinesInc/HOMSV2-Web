export function receiveFromWebView(actionName, callback) {
    return new Promise((resolve, reject) => {
        window.chrome.webview.addEventListener('message', function (event) {
            console.log("Received message from C#: ", event.data);
            let data = JSON.parse(event.data);

            if (data["actionName"] === "error") {
                errorTracker(data["actionName"], data.data.message);
            } else {
                // Execute the provided callback function with the received data
                if (typeof callback === 'function') {
                    callback(data);
                }
            }

            if (data["actionName"] === actionName) {
                resolve(data);
            }
        });
    });
}

export function sendToWebView(actionName,data) {
    if (window.chrome && window.chrome.webview) {
        let payload = {
            actionName: actionName,
            data
        }
        let payloadString = JSON.stringify(payload);
        window.chrome.webview.postMessage(payloadString);
    } else {
        console.warn("WebView2 not available. Ensure you're running in a WebView2 environment.");
    }
}

function errorTracker(actionName, message) {
    Swal.fire({
        icon: "error",
        title: actionName + "...",
        text: message,
    });
}
