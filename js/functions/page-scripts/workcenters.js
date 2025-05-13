import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';
import { validateFields } from './../helperFunctions.js'
import {
    Uppy,
    Dashboard,
    Url,
    XHRUpload
  } from 'https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs'


$(async function () {
    const user = JSON.parse(localStorage.getItem("user"));

    let editingID = null;

    const params = {
        ajax: {
            url: "/homs/api/admin/getWorkcenters.php", // your endpoint
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
            { data: "section" },
            { data: "costcenter", visible: false },
            { data: "costcenter_name" },
            { data: "plant"},
            { data: "workcenter" },
            { data: "line_name"},
            { data: "folder_name", visible: false  },
            { data: "pattern"},
            { data: "creator", visible: false },
            { data: "time_created", visible: false},
            { data: "updated_by", visible: false },
            { data: "time_updated", visible: false },
            {
                data: null,
                title: "Actions",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary edit-workcenter" data-workcenter_id="${row.id}" data-bs-toggle="modal" data-bs-target="#workcenterEditModal">Edit</button>
                        <button class="btn danger delete-workcenter" data-workcenter_id="${row.id}">Delete</button>
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

    $(".create").on("click", function (e) {
        $("#create-name").val("");
        $("#create-details").val("");
        $(".create-category").val("");
        $("#create-legend").val("");
        $("#create-legend-container").addClass("d-none");
    });

    $(".submit").on("click", function (e) {
        submit();
    });

    $(document).on("click", ".edit-workcenter", function (e) {
        let workcenterId = $(this).data("workcenter_id");
        let workcenter = table.rows().data().toArray().find(r => r.id == workcenterId);

        $(".edit-section").val(workcenter.section).trigger("change"),
        $(".edit-costcenter").val(workcenter.costcenter).trigger("change"),
        $(".edit-plant").val(workcenter.plant).trigger("change"),
        $(".edit-pattern").val(workcenter.pattern).trigger("change"),

        $("#edit-costcenter-name").val(workcenter.costcenter_name),
        $("#edit-workcenter-name").val(workcenter.workcenter),
        $("#edit-line-name").val(workcenter.line_name),
        $("#edit-folder-name").val(workcenter.folder_name),

        $(".save").attr("data-workcenter_id", workcenterId);
        editingID = workcenterId;
    });

    $(".save").on("click", function (e) {
        save(editingID);
    });

    $(document).on("click", ".delete-workcenter", function (e) {
        let workcenterId = $(this).data("workcenter_id");
        deleteReason(workcenterId);
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

    function submit() {
        let workcenterFields = [
            { name: "Section", value: $(".register-section").val() },
            { name: "Cost Center", value: $(".register-costcenter").val() },
            { name: "Plant", value: $(".register-plant").val() },
            { name: "Pattern", value: $(".register-pattern").val() },
            { name: "Cost Center Name", value: $("#register-costcenter-name").val() },
            { name: "Workcenter", value: $("#register-workcenter-name").val() },
            { name: "Line Name", value: $("#register-line-name").val() },
            { name: "Folder Name", value: $("#register-folder-name").val() }
        ];
    
        if (!validateFields(workcenterFields)) return;
    
        let workcenter = {
            section: $(".register-section").val(),
            costcenter: $(".register-costcenter").val(),
            plant: $(".register-plant").val(),
            pattern: $(".register-pattern").val(),
    
            costcenter_name: $("#register-costcenter-name").val(),
            workcenter: $("#register-workcenter-name").val(),
            line_name: $("#register-line-name").val(),
            folder_name: $("#register-folder-name").val(),
    
            creator: user["EmpNo"],
        };
    
        apiCall("/homs/api/admin/submitWorkcenter.php", "POST", workcenter)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'Workcenter submitted successfully!',
            });
            table.ajax.reload(null, false);
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit workcenter: " + error.message);
        });
    }
    
    function save(id){

        let workcenterFields = [
            { name: "Section", value: $(".edit-section").val() },
            { name: "Cost Center", value: $(".edit-costcenter").val() },
            { name: "Plant", value: $(".edit-plant").val() },
            { name: "Pattern", value: $(".edit-pattern").val() },
            { name: "Cost Center Name", value: $("#edit-costcenter-name").val() },
            { name: "Workcenter", value: $("#edit-workcenter-name").val() },
            { name: "Line Name", value: $("#edit-line-name").val() },
            { name: "Folder Name", value: $("#edit-folder-name").val() }
        ];
    
        if (!validateFields(workcenterFields)) return;
    
        let workcenter = {
            id: id,
            section: $(".edit-section").val(),
            costcenter: $(".edit-costcenter").val(),
            plant: $(".edit-plant").val(),
            pattern: $(".edit-pattern").val(),
    
            costcenter_name: $("#edit-costcenter-name").val(),
            workcenter: $("#edit-workcenter-name").val(),
            line_name: $("#edit-line-name").val(),
            folder_name: $("#edit-folder-name").val(),
    
            creator: user["EmpNo"],
        };
    
        apiCall("/homs/api/admin/updateWorkcenter.php", "POST", workcenter)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'Workcenter updated successfully!',
            });
            table.ajax.reload(null, false);
        })
        .catch((error) => {
            console.error("Update Failed:", error.message);
            alert("Failed to update workcenter: " + error.message);
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
                apiCall("/homs/api/admin/deleteWorkcenter.php", "DELETE", { id: reasonId })
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

    /* UPPY */
    let successCount = 0;
    let totalFiles = 0;

    const uppy = new Uppy({
        restrictions: {
            allowedFileTypes: ['.xlsx', '.xls', '.xlsm'], // Restrict to XLSX and XLS files
            maxNumberOfFiles: 1
        },
        allowMultipleUploadBatches: false,
        autoProceed: true // Optional, starts uploading immediately after file selection
    });

    uppy.setMeta({
        creator: user['EmpNo'],
        section: user['Section'],
    });

    uppy
        .use(
            Dashboard, {    
                inline: true, 
                target: '#uppy-dashboard',
                width: '300px',
                height: '300px',
                theme: 'dark',
                showProgressDetails: false
            })

        .use(XHRUpload, {
            endpoint: '/homs/API/admin/uploadWorkcenter.php',
            formData: true,
            limit: 1
        });

    uppy.on('upload', () => {
        const files = uppy.getFiles();
        totalFiles = files.length;
        successCount = 0;

        files.forEach((file, index) => {
            uppy.setFileMeta(file.id, {
                is_first_file: index === 0,
            });
        });
    });

    uppy.on('upload-success', (file, response) => {
        // Optional: Check for backend's confirmation of complete processing
        const backendStatus = response.body?.processingComplete ?? true;

        if (backendStatus) {
            successCount++;
        } else {
            alert(`Server did not confirm full processing for file ${file.name}`);
        }

        Swal.fire({
            icon: 'success',
            title: 'Success',
            timer: 1000,
            timerProgressBar: true,
            text: 'Workcenter submitted successfully!',
        });
        table.ajax.reload(null, false);
    });
    
    uppy.on('upload-error', (file, error, response) => {
        alert('Error uploading file: ' + file.name + '\n' + error.message);
    });
});