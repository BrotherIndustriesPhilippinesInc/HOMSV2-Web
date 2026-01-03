import apiCall from "./../apiCall.js";
import { sendToWebView } from "./../WebViewInteraction.js";
import dataTablesInitialization from "./../dataTablesInitialization.js";

/* Initialization */
const user = JSON.parse(localStorage.getItem("user"));
const section = user.Section;
let table;

$(function () {
    /* Initialize database */
    const params = {
        ajax: {
            url: "/homs/api/production/getLinestops.php?section=" + section, // your endpoint
            method: "GET",
            dataSrc: function (json) {
                return json.data; // extract the data array from your JSON
            }
        },
        layout: {
            topStart: {
                buttons: ['colvis']
            },
            topEnd: ['search', 'pageLength'],
        },
        columns: [
            { data: "work_center" },
            { data: "po", visible: true},
            { data: "isresolved", render: function (data, type, row) {
                return data ? '<img src="/homs/resources/icons/thumbs-up-solid-full.svg" style="width: 24px; height: 24px;">' : '<img src="/homs/resources/icons/thumbs-down-solid-full.svg" style="width: 24px; height: 24px;">';
            }},
            { data: "resolution_details"},
            { data: "creator", visible: false },
            { data: "time_created", visible: true},
            { data: "updated_by", visible: false },
            { data: "time_updated", visible: false },
            {
                data: null,
                title: "",
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary edit-linestop" data-linestop_id="${row.linestop_id}" data-bs-toggle="modal" data-bs-target="#linestopEditModal">Edit</button>
                    `;
                }
            }
        ],
        createdRow: function(row, data, dataIndex) {
            $(row).addClass('linestop-row');
            $(row).attr('data-linestop-id', data["linestop_id"]);
        }
    }

    if (window.location.href === "http://apbiphbpswb02/homs/production/linestops") {
        table = dataTablesInitialization("#data-table", params);
        setInterval(function () {
            table.ajax.reload(null, false); // user paging is not reset on reload
        }, 5000);
    }

    /* EVENTS */
    let editing_linestop_id;
    $(document).on("click", ".edit-linestop", async function () {
        editing_linestop_id = $(this).data("linestop_id");

        let details = await getLinestopsDetails(editing_linestop_id);

        $("#edit-resolution").val(details.data.resolution_details);

        $('input[name="radioDefault"][value="' + details.data.isresolved + '"]').prop('checked', true);
    });

    $(document).on("click", ".save", function () {
        let resolution_details = $("#edit-resolution").val();

        let isresolved = $('input[name="radioDefault"]:checked').val();

        let data = {
            id: editing_linestop_id,
            resolution_details: resolution_details,
            isresolved: isresolved,

            creator: user.EmpNo,
        };
        if (window.location.href === "http://apbiphbpswb02/homs/production/linestops") {
            apiCall("/homs/api/production/updateLinestop.php", "POST", data).then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    timer: 1000,
                    timerProgressBar: true,
                    text: 'Linestop edited successfully!',
                });
                table.ajax.reload(null, false); // Reload the table without resetting the pagination

            })
            .catch((error) => {
                console.error("Submit Failed:", error.message);
                alert("Failed to submit reason: " + error.message);
            });
        }
        

    });
});

async function getLinestops() {

    let response = apiCall("/homs/api/production/getLinestops.php?section=" + section, "GET")
    return response;
}

async function getLinestopsDetails(id){

    let response = apiCall("/homs/api/production/getLinestopDetails.php?id=" + id, "GET")
    return response;
}

export async function renderNotifications(containerID, badgeID) {
    const container = $(containerID);

    const oldContent = container.html(); // Save current content

    await getLinestops()
        .then(res => {
            let badgeLength = 0;
            let newContent = '';

            res.data.forEach(element => {
                let isresolved = element.isresolved;

                let status = "glow";
                if (!isresolved) {
                    status = "border-danger danger";
                    badgeLength += 1;
                }

                newContent += `<div class="notification-popover-item d-flex flex-column gap-2 border-1 p-2 ${status} secondary-background mt-2">
                    <span class="fw-bold text-start">Linestop</span>
                    <div class="d-flex gap-1">
                        <div class="d-flex gap-2">
                            <span class="fw-bold">Workcenter: </span>
                            <span>${element.work_center}</span>
                        </div>
                        <div class="d-flex gap-2">
                            <span class="fw-bold">PO: </span>
                            <span>${element.po}</span>
                        </div>
                    </div>
                </div>`;
            });

            // Update only if content changed
            if (oldContent !== newContent) {
                container.html(newContent);
            }

            // Update badge
            if (badgeLength !== 0) {
                $(badgeID).text(badgeLength).show();
            } else {
                $(badgeID).hide();
            }
        })
        .catch(error => {
            console.error("Error fetching linestops:", error);
        });
}

function isRecent(timestampString, thresholdInSeconds = 10) {
    const now = new Date();
    const entryTime = new Date(timestampString.replace(' ', 'T')); // Convert to ISO
    const diffInSeconds = (now - entryTime) / 1000;
    return diffInSeconds <= thresholdInSeconds;
}
