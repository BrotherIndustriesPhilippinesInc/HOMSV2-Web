import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';

$(async function () {
    const user = JSON.parse(localStorage.getItem("user"));

    let editingID = null;

    const params = {
        ajax: {
            url: "/homs/api/admin/getReasons.php", // your endpoint
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
            { data: "name" },
            { data: "details", visible: false},
            { data: "category" },
            { data: "loss_factor_legend" },
            { data: "creator" },
            { data: "time_created", visible: false},
            { data: "updated_by", visible: false },
            { data: "time_updated", visible: false },
            {
                data: null,
                title: "Actions",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary edit-reason" data-reason_id="${row.id}" data-bs-toggle="modal" data-bs-target="#reasonEditModal">Edit</button>
                        <button class="btn danger delete-reason" data-reason_id="${row.id}">Delete</button>
                    `;
                }
            }
        ],
        createdRow: function(row, data, dataIndex) {
            $(row).addClass('reason-row');
            $(row).attr('data-reason-id', data["id"]);
        }
    };
    
    let table = dataTablesInitialization("#reasons-table", params);

    $(".create").on("click", function (e) {
        $("#create-name").val("");
        $("#create-details").val("");
        $(".create-category").val("");
        $("#create-legend").val("");
        $("#create-legend-container").addClass("d-none");

    });

    $(".edit-reason").on("click", function (e) {
        $("#edit-name").val("");
        $("#edit-details").val("");
        $(".edit-category").val("");
        $("#edit-legend").val("");
        $("#edit-legend-container").addClass("d-none");
    });

    $(".submit").on("click", function (e) {
        submit();
    });

    $(document).on("click", ".edit-reason", function (e) {
        let reasonId = $(this).data("reason_id");
        let reason = table.rows().data().toArray().find(r => r.id == reasonId);
        $("#edit-name").val(reason.name);
        $("#edit-details").val(reason.details);
        $(".edit-category").val(reason.category);
        openFactorLegend(".edit-category");
        $("#edit-legend").val(reason.loss_factor_legend);
        

        $(".save").attr("data-reason_id", reasonId);
        editingID = reasonId;
    });

    $(".save").on("click", function (e) {
        save(editingID);
    });

    $(document).on("click", ".delete-reason", function (e) {
        let reasonId = $(this).data("reason_id");
        deleteReason(reasonId);
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

    $(".edit-category").on("change", function (e) {
        openFactorLegend(".edit-category");
    });

    function openFactorLegend(select){
        let selectedCategory = $(select).val();
    
        if (selectedCategory && selectedCategory.toLowerCase().includes("linestop")) {
            $("#edit-legend-container").removeClass("d-none");
        } else {
            $("#edit-legend-container").addClass("d-none");
        }
    }

    function submit(){
        let reason = {
            name: $("#create-name").val(),
            details: $("#create-details").val(),
            category: $(".create-category").val(),
            creator: user["EmpNo"],
            loss_factor_legend: $("#create-legend").val()
        };

        if (reason.name === "" || reason.category === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields!',
            });
            return;
        }

        apiCall("/homs/api/admin/submitReason.php", "POST", reason)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'Reason submitted successfully!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination

        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit reason: " + error.message);
        });
    }

    function save(id){
        let reason = {
            id: id,
            name: $("#edit-name").val(),
            details: $("#edit-details").val(),
            category: $(".edit-category").val(),
            creator: user["EmpNo"],
            loss_factor_legend: $("#edit-legend").val()
        };

        if (reason.name === "" || reason.category === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields!',
            });
            return;
        }

        apiCall("/homs/api/admin/updateReason.php", "PUT", reason)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'Reason updated successfully!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination

        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit reason: " + error.message);
        });
    }

    function deleteReason(reasonId) {
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
                apiCall("/homs/api/admin/deleteReason.php", "DELETE", { id: reasonId })
                .then((response) => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your reason has been deleted.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true
                    });
                    table.ajax.reload(null, false); // Reload the table without resetting the pagination
                })
                .catch((error) => {
                    console.error("Delete Failed:", error.message);
                    alert("Failed to delete reason: " + error.message);
                });
            }
        });

    }
});