import * as timestampFunctions from "./../timestampFunctions.js";
import { search } from "../helperFunctions.js";

$(function () {
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    generateWorkcenters(section);
    getLastUpdate(section);

    $(document).on("click", ".wc-button", function (e) {
        let wcValue = $(this).data("wc-value"); // Get the wc value from the button's data attribute

        let url = new URL(window.location.origin + "/homs/production/details");

        // Preserve existing query parameters
        let params = new URLSearchParams(window.location.search);
        params.set("wc", wcValue); // Set the new wc parameter
        params.set("section", section); // Set the section parameter
        
        url.search = params.toString(); // Apply parameters to the URL

        window.location.href = url.toString(); // Navigate to the new URL

        localStorage.setItem('wc', wcValue);
    });

    $("#searchPO").on("input", function () {
        search(document.getElementById("work_center_container"), this, "wc-button");
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

async function generateWorkcenters(section) {
    const container = document.getElementById('work_center_container');

    let work_centers;
    await fetch(`/homs/API/uploading/getWorkCenters.php?section=${encodeURIComponent(section)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        work_centers = data.data.work_centers
    })

    await fetch('/homs/helpers/componentAPI/wcButtons.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_centers: work_centers })
    })
    .then(res => res.json())
    .then(data => container.innerHTML = data.html);
}

async function getLastUpdate(section){
    let time;
    let creator;

    await fetch(`/homs/API/uploading/getPOLLastUpdate.php?section=${encodeURIComponent(section)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        time = data.data.last_update;
        creator = data.data.last_update_by.FullName;

        /* SPLIT DATE AND TIME  */
        let formattedDate = timestampFunctions.dateConvert(time);
        let formattedTime = timestampFunctions.twelveHourTimeFormat(time);

        $("#last_update_date").text(`${formattedDate}`);
        $("#last_update_time").text(`${formattedTime}`);
        $("#last_update_by").text(`${creator}`);
    });
}