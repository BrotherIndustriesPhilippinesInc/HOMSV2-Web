import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';
import { resetFields, validateFields } from '../helperFunctions.js';

$(async function () {
    const user = JSON.parse(localStorage.getItem("user"));

    let editingID = null;

    const params = {
        ajax: {
            url: "http://apbiphbpswb01:9876/api/Users", // your endpoint
            method: "GET",
            dataSrc: "",
        },
        processing: true,
        layout: {
            topStart: {
                buttons: ['colvis']
            },
            topEnd: ['search', 'pageLength'],
        },
        columns: [
            { data: "fullName" },
            { data: "emailAddress" },
            { data: "section" },
            { data: "position" },
            { data: "employeeNumber" },
            { data: "adid" },
            { 
                data: "isAdmin",
                render: function (data) {
                    if(data) {
                        return '<i class="fas fa-check-circle text-success"></i>'; // green check
                    } else {
                        return '<i class="fas fa-times-circle text-danger"></i>'; // red cross
                    }
                },
                className: "text-center" // optional: center the icon
            },
            {
                data: "id",
                orderable: false,
                render: function (data) {
                    return `
                            <a href="/Users/Update?portalId=${data}" asp-user-id="${data}" class="btn">Update</a>
                            <a href="/Users/Delete?portalId=${data}" asp-user-id="${data}" class="btn">Delete</a>
                    `;
                },
                className: "text-center" // optional: center the buttons
            }
        ]
    };
    let table = dataTablesInitialization("#data-table", params);

    $(".create").on("click", function (e) {
        let selectors = [
            "#create-name",
            "#create-mac_address",
            ".create-assigned_section",
            "#create-line_name",
            "#create-area",
            "#create-sensor_name",
        ];
        resetFields(selectors);
    });

    $(".edit-esp").on("click", function (e) {
        let selectors = [
            "#create-name",
            "#create-mac_address",
            ".create-assigned_section",
            "#create-line_name",
            "#create-area",
            "#create-sensor_name",
        ];
        resetFields(selectors);
    });

    $(".submit").on("click", function (e) {
        submit();
    });

    $(document).on("click", ".edit-esp", function (e) {
        let espId = $(this).data("esp");
        let esp = table.rows().data().toArray().find(r => r.id == espId);
        $("#edit-name").val(esp.esp_name);
        $("#edit-mac_address").val(esp.mac_address);
        $(".edit-assigned_section").val(esp.assigned_section);
        $("#edit-line_name").val(esp.line_name);
        $("#edit-area").val(esp.area);
        $("#edit-sensor_name").val(esp.sensor_name);

        $(".save").attr("data-esp_id", espId);
        editingID = espId;
    });

    $(".save").on("click", function (e) {
        save(editingID);
    });

    $(document).on("click", ".delete-esp", function (e) {
        let espId = $(this).data("esp_id");
        deleteESP(espId);
    });

    $(".create-category").on("change", function (e) {
        $("#create-legend").val("");
        let selectedCategory = $(this).val().toLowerCase();

        if (selectedCategory.includes("linestop")) {
            $("#create-legend-container").removeClass("d-none");
        } else {
            $("#create-legend-container").addClass("d-none");
        }
    });

    function submit(){
        let esp = {
            esp_name: $("#create-name").val(),
            mac_address: $("#create-mac_address").val(),
            assigned_section: $(".create-assigned_section").val(),
            line_name: $("#create-line_name").val(),
            area: $("#create-area").val(),
            sensor_name: $("#create-sensor_name").val(),

            creator: user["EmpNo"],
        };

        let espFields = [
            { name: "Name", value: $("#create-name").val() }, 
            { name: "MAC Address", value: $("#create-mac_address").val() }, 
            { name: "Assigned Section", value: $(".create-assigned_section").val() }, 
            { name: "Line Name", value: $("#create-line_name").val() },
            { name: "Area", value: $("#create-area").val() }, 
            { name: "Sensor Name", value: $("#create-sensor_name").val() }
        ];
        if (!validateFields(espFields)) return;

        apiCall("/homs/api/admin/submitESP.php", "POST", esp)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'ESP Registered successfully!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit esp: " + error.message);
        });
    }

    function save(id){
        let esp = {
            id: id,
            esp_name: $("#edit-name").val(),
            mac_address: $("#edit-mac_address").val(),
            assigned_section: $(".edit-assigned_section").val(),
            line_name: $("#edit-line_name").val(),
            area: $("#edit-area").val(),
            sensor_name: $("#edit-sensor_name").val(),

            creator: user["EmpNo"],
        };

        let espFields = [
            { name: "Name", value: $("#edit-name").val() }, 
            { name: "MAC Address", value: $("#edit-mac_address").val() }, 
            { name: "Assigned Section", value: $(".edit-assigned_section").val() }, 
            { name: "Line Name", value: $("#edit-line_name").val() },
            { name: "Area", value: $("#edit-area").val() }, 
            { name: "Sensor Name", value: $("#edit-sensor_name").val() }
        ];
        if (!validateFields(espFields)) return;

        apiCall("/homs/api/admin/updateESP.php", "PUT", esp)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'ESP Updated Successfully!!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit esp: " + error.message);
        });
    }

    function deleteESP(espId) {
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
                apiCall("/homs/api/admin/deleteESP.php", "DELETE", { id: espId })
                .then((response) => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your ESP has been deleted.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true
                    });
                    table.ajax.reload(null, false); // Reload the table without resetting the pagination
                })
                .catch((error) => {
                    console.error("Delete Failed:", error.message);
                    alert("Failed to delete ESP: " + error.message);
                });
            }
        });

    }
});