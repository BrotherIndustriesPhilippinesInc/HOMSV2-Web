$(function () {
    $(".wc-button").on("click", function (e) {
        let wcId = $(this).data("wc-id");

        let url = new URL(window.location.origin + "/production/details");

        // Preserve existing query parameters
        let params = new URLSearchParams(window.location.search);
        params.set("wc", wcId); // Set the new wc parameter

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
