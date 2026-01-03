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
                data: "employeeNumber",
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <div class="d-flex justify-content-center gap-2">
                            <button 
                                data-user-id="${row.employeeNumber}"
                                data-user-id2="${row.portalID}"
                                class="edit-user btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#userEditModal">
                                Update
                            </button>
                            <button 
                                data-user-id="${row.employeeNumber}"
                                class="delete-account btn danger">
                                Delete
                            </button>
                        </div>
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

    $(document).on("click", ".edit-user", function (e) {
        let userId = $(this).data("user-id");
        let userId2 = $(this).data("user-id2");
        let user = table.rows().data().toArray().find(r => r.employeeNumber == userId);
        $("#edit-name").val(user.employeeNumber);
        $(".edit-is_admin").val(String(user.isAdmin)); // convert boolean to string (user.isAdmin);

        $(".save").attr("data-user-id", userId);
        editingID = userId2;
    });

    $(".save").on("click", function (e) {
        save(editingID);
    });

    $(document).on("click", ".delete-account", function (e) {
        let accountID = $(this).data("user-id");
        deleteAccount(accountID);
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
        let postData = {
            "biphid": $("#create-name").val(),
            "isAdmin": Boolean($(".create-is_admin").val()),
        }

        let createFields = [
            { name: "biphid", value: $("#create-name").val(), }, 
            { name: "isAdmin", value: $(".create-is_admin").val() }, 
            
        ];
        if (!validateFields(createFields)) return;

        apiCall("http://apbiphbpswb01:9876/api/Users", "POST", postData)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'User Registered successfully!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit esp: " + error.message);
        });
    }

    function save(id){
        let data = {
            isAdmin: $(".edit-is_admin").val() === "true"
        };

        let createFields = [
            { name: "isAdmin", value: $(".edit-is_admin").val() }, 
            
        ];
        if (!validateFields(createFields)) return;

        apiCall(`http://apbiphbpswb01:9876/api/Users/UpdateUser/${id}`, "POST", data)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'User Updated Successfully!!',
            });
            table.ajax.reload(null, false); // Reload the table without resetting the pagination
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit user: " + error.message);
        });
    }

    function deleteAccount(accountID) {
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
                apiCall(
                    "http://apbiphbpswb01:9876/api/Users/DeleteUsers",
                    "POST",
                    { emp_id: String(accountID) }
                )
                .then((response) => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Account has been deleted.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true
                    });
                    table.ajax.reload(null, false); // Reload the table without resetting the pagination
                })
                .catch((error) => {
                    console.error("Delete Failed:", error.message);
                    alert("Failed to delete account: " + error.message);
                });
            }
        });
    }

});