$(function () {

    generateWorkcenters();

    $(document).on("click", ".wc-button", function (e) {
        let wcValue = $(this).data("wc-value"); // Get the wc value from the button's data attribute

        let url = new URL(window.location.origin + "/homs/production/details");

        // Preserve existing query parameters
        let params = new URLSearchParams(window.location.search);
        params.set("wc", wcValue); // Set the new wc parameter

        url.search = params.toString(); // Apply parameters to the URL

        window.location.href = url.toString(); // Navigate to the new URL
    });

    flatpickr(".flatpickr-calendar-input", {
        disableMobile: true,
        allowInput: true,
        onChange: function (selectedDates, dateStr, instance) {
            let url = new URL(window.location.href);
            url.searchParams.set("date", dateStr);
            history.replaceState(null, "", url.toString()); // Update URL without reload
        }
    });
});

function generateWorkcenters() {
    const workCenters = JSON.parse(localStorage.getItem('work_centers'));
    const container = document.getElementById('work_center_container');

    fetch('/homs/helpers/componentAPI/wcButtons.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_centers: workCenters })
    })
    .then(res => res.json())
    .then(data => container.innerHTML = data.html);
}
