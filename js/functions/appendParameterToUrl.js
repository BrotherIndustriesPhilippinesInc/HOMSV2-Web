export default function appendParameterToURL(param, value) {
    let url = new URL(window.location.href);
    url.searchParams.set(param, value); // Adds or updates the parameter
    window.history.replaceState({}, '', url); // Updates the URL without reloading
}