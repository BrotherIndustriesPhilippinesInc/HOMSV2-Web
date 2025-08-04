import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';
import { receiveFromWebView, sendToWebView } from '../WebViewInteraction.js';
import { resetFields, validateFields, formatTimeOnlyToPostgres } from '../helperFunctions.js';

$(async function () {
    /* INITIALIZATION */
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');
    const user = JSON.parse(localStorage.getItem("user"));

    let editingID = null;

    const startTime = flatpickr("#create-start_time", {
        enableTime: true,
        noCalendar: true,
        disableMobile: true,
        allowInput: true,
        hourIncrement: 1,
        minuteIncrement: 1,
        enableSeconds: true,
        defaultDate: new Date(), // Crucial for pre-filling and populating selectedDates
        // Add an onReady hook to confirm when it's ready
         dateFormat: "h:i:S K", // h: 12-hour, i: minutes, K: AM/PM
        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr for #startTime is ready. Selected dates:", selectedDates);
        }
        
    });

    const endTime = flatpickr("#create-end_time", {
        enableTime: true,
        noCalendar: true,
        disableMobile: true,
        allowInput: true,
        hourIncrement: 1,
        minuteIncrement: 1,
        enableSeconds: true,
        defaultDate: new Date(), // Crucial for pre-filling and populating selectedDates
        // Add an onReady hook to confirm when it's ready
         dateFormat: "h:i:S K", // h: 12-hour, i: minutes, K: AM/PM
        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr for #endTime is ready. Selected dates:", selectedDates);
        }
    });

    const editStartTime = flatpickr("#edit-start_time", {
        enableTime: true,
        noCalendar: true,
        disableMobile: true,
        allowInput: true,
        hourIncrement: 1,
        minuteIncrement: 1,
        enableSeconds: true,
        defaultDate: new Date(), // Crucial for pre-filling and populating selectedDates
        // Add an onReady hook to confirm when it's ready
         dateFormat: "h:i:S K", // h: 12-hour, i: minutes, K: AM/PM
        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr for #startTime is ready. Selected dates:", selectedDates);
        }
    });

    const editEndTime = flatpickr("#edit-end_time", {
        enableTime: true,
        noCalendar: true,
        disableMobile: true,
        allowInput: true,
        hourIncrement: 1,
        minuteIncrement: 1,
        enableSeconds: true,
        defaultDate: new Date(), // Crucial for pre-filling and populating selectedDates
        // Add an onReady hook to confirm when it's ready
         dateFormat: "h:i:S K", // h: 12-hour, i: minutes, K: AM/PM
        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr for #endTime is ready. Selected dates:", selectedDates);
        }
    });
    
    const params = {
        ajax: {
            url: `/homs/api/admin/getBreaktimes.php?section=${section}`, // your endpoint
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
            { data: "breaktime_name"},
            { data: "shift"},
            { data: "break_type"},
            { 
                data: "start_time",
                render: function(data, type, row) {
                    if (!data) return '';
                    return data.substring(11, 16); // Extracts HH:MM from "YYYY-MM-DD HH:MM:SS"
                }
            },
            { 
                data: "end_time",
                render: function(data, type, row) {
                    if (!data) return '';
                    return data.substring(11, 16); // Extracts HH:MM
                }
            },
            { data: "section"},
            { data: "line", visible: true},
            { data: "area", visible: true},
            { data: "isovertime", visible: false},

            { data: "creator", visible: false},
            { data: "time_created", visible: false},
            { data: "updated_by", visible: false},
            { data: "time_updated", visible: false},
            {
                data: null,
                title: "Actions",
                render: function (data, type, row) {
                    return `
                        <div class="d-flex gap-2">

                            <button class="btn btn-primary edit-breaktime" data-breaktime="${row.id}" data-bs-toggle="modal" data-bs-target="#breaktimeEditModal">Edit</button>
                            <button class="btn danger delete-breaktime" data-breaktime_id="${row.id}">Delete</button>
                        </div>
                    `;
                }
            }
        ],
        createdRow: function(row, data, dataIndex) {
            $(row).addClass('reason-row');
            $(row).attr('data-reason-id', data["id"]);
        }
    };
        
    let table = dataTablesInitialization("#data-table", params);

    /* EVENTS */
    $(".submit").on("click", async function () {
        submit();
    });

    $(document).on("click", ".edit-breaktime", function (e) {
        let breaktimeId = $(this).data("breaktime");
        let breaktime = table.rows().data().toArray().find(r => r.id == breaktimeId);
        
        $("#edit-name").val(breaktime.breaktime_name);

        $("#edit-shift").val(breaktime.shift);

        $(".edit-break_type").val(breaktime.break_type);

        editStartTime.setDate(new Date(breaktime.start_time.replace(" ", "T")));
        editEndTime.setDate(new Date(breaktime.end_time.replace(" ", "T")));

        let isOvertime = breaktime.isovertime ? "true" : "false";
        $(".edit-is_overtime").val(isOvertime);
        $(".edit-assigned_section").val(breaktime.section);

        $("#edit-line_name").val(breaktime.line);
        $("#edit-area").val( breaktime.area);

        $(".save").attr("data-breaktime_id", breaktimeId);
        editingID = breaktimeId;
    });

    $(".save").on("click", function (e) {
        save(editingID);
    });

    $(document).on("click", ".delete-breaktime", function (e) {
        let breaktimeId = $(this).data("breaktime_id");
        deleteBreaktime(breaktimeId);
    });

    /* FUNCTIONS */
    function submit(){
        let breaktime = {
            breaktime_name: $("#create-name").val(),

            shift: $("#create-shift").val(),

            break_type: $(".create-break_type").val(),

            start_time: formatTimeOnlyToPostgres(startTime.input.value),
            end_time: formatTimeOnlyToPostgres(endTime.input.value),

            isOvertime: $(".create-is_overtime").val(),
            section: $(".create-assigned_section").val(),

            line: $("#create-line_name").val(),
            area: $("#create-area").val(),

            creator: user["EmpNo"],
        };

        let breaktimeFields = [
            { name: "Name", value: $("#create-name").val() }, 
            { name: "Shift", value: $("#create-shift").val() }, 
            { name: "Break Type", value: $(".create-break_type").val() },
            { name: "Start Time", value: $("#create-start_time").val() }, 
            { name: "End Time", value: $("#create-end_time").val() },
            { name: "Is Overtime", value: $(".create-is_overtime").val() },
            { name: "Section", value: $(".create-assigned_section").val() },
            { name: "Line", value: $("#create-line_name").val() },
            { name: "Area", value: $("#create-area").val() },
        ];
        if (!validateFields(breaktimeFields)) return;

        apiCall("/homs/api/admin/submitBreaktime.php", "POST", breaktime)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'Breaktime Registered successfully!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit esp: " + error.message);
        });
    }

    function save(id){
        let breaktime = {
            id: id,
            breaktime_name: $("#edit-name").val(),
            shift: $("#edit-shift").val(),
            break_type: $(".edit-break_type").val(),
            start_time: formatTimeOnlyToPostgres(editStartTime.input.value),
            end_time: formatTimeOnlyToPostgres(editEndTime.input.value),
            isOvertime: $(".edit-is_overtime").val(),
            section: $(".edit-assigned_section").val(),
            line: $("#edit-line_name").val(),
            area: $("#edit-area").val(),

            creator: user["EmpNo"],
        };
    
        let breaktimeFields = [
            { name: "Name", value: $("#edit-name").val() }, 
            { name: "Shift", value: $("#edit-shift").val() }, 
            { name: "Break Type", value: $(".edit-break_type").val() },
            { name: "Start Time", value: $("#edit-start_time").val() }, 
            { name: "End Time", value: $("#edit-end_time").val() },
            { name: "Is Overtime", value: $(".edit-is_overtime").val() },
            { name: "Section", value: $(".edit-assigned_section").val() },
            { name: "Line", value: $("#edit-line_name").val() },
            { name: "Area", value: $("#edit-area").val() },
        ];

        if (!validateFields(breaktimeFields)) return;
    
            apiCall("/homs/api/admin/updateBreaktime.php", "PUT", breaktime)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    timer: 1000,
                    timerProgressBar: true,
                    text: 'Breaktime Updated Successfully!!',
                });
                table.ajax.reload(null, false);
            })
            .catch((error) => {
                console.error("Submit Failed:", error.message);
                alert("Failed to submit esp: " + error.message);
            });
    }

    function deleteBreaktime(breaktimeId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                apiCall("/homs/api/admin/deleteBreaktime.php", "DELETE", { id: breaktimeId })
                .then((response) => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Breaktime has been deleted.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true
                    });
                    table.ajax.reload(null, false); // Reload the table without resetting the pagination
                })
                .catch((error) => {
                    console.error("Delete Failed:", error.message);
                    alert("Failed to delete Breaktime: " + error.message);
                });
            }
        });

    }

    
});