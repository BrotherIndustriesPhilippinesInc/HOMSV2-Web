import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';
import { resetFields, validateFields } from './../helperFunctions.js'
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
            url: "/homs/api/admin/getST.php", // your endpoint
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
            { data: "plant" },
            { data: "item_code"},
            { data: "sequence_no", visible: false },
            { data: "item_text", visible: false},
            { data: "new_st_sap"},
            { data: "current_st_mh"},
            { data: "st_default_flag", visible: false},
            { data: "st_update_sign", visible: false},
            { data: "new_tt_sap"},
            { data: "current_tt_mh" },
            { data: "tt_update_sign", visible: false},
            { data: "delete_sign", visible: false},
            { data: "section"},

            { data: "creator", visible: false },
            { data: "time_created", visible: false},
            { data: "updated_by", visible: false },
            { data: "time_updated", visible: false },
            {
                data: null,
                title: "Actions",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary edit-st" data-st_id="${row.id}" data-bs-toggle="modal" data-bs-target="#stEditModal">Edit</button>
                        <button class="btn danger delete-st" data-st_id="${row.id}">Delete</button>
                    `;
                }
            }
        ],
        createdRow: function(row, data, dataIndex) {
            $(row).addClass('st-row');
            $(row).attr('data-st-id', data["id"]);
        }
    };
    
    let table = dataTablesInitialization("#data-table", params);


    $(".submit").on("click", function (e) {
        submit();
    });

    $(document).on("click", ".edit-st", function (e) {
        let stId = $(this).data("st_id");
        let st = table.rows().data().toArray().find(r => r.id == stId);

        $(".edit-plant").val(st.plant).trigger("change"),
        $("#edit-item-code").val(st.item_code),
        $("#edit-sequence-no").val(st.sequence_no),
        $("#edit-item-text").val(st.item_text),

        $("#edit-new-st-sap").val(st.new_st_sap),
        $("#edit-current-st-mh").val(st.current_st_mh),
        $("#edit-st-default-flag").val(st.st_default_flag),
        $("#edit-st-update-sign").val(st.st_update_sign),
        $("#edit-new-tt-sap").val(st.new_tt_sap),
        $("#edit-current-tt-mh").val(st.current_tt_mh),
        $("#edit-tt-update-sign").val(st.tt_update_sign),
        $("#edit-delete-sign").val(st.delete_sign),

        $(".edit-section").val(st.section).trigger("change")

        $(".save").attr("data-st_id", stId);
        editingID = stId;
    });

    $(".save").on("click", function (e) {
        save(editingID);
    });

    $(document).on("click", ".delete-st", function (e) {
        let stId = $(this).data("st_id");
        deleteFunction(stId);
    });

    function submit() {
        let stFields = [
            { name: "Plant", value: $(".register-plant").val() },
            { name: "Item Code", value: $("#register-item-code").val() },
            { name: "Sequence No.", value: $("#register-sequence-no").val() },
            { name: "Item Text", value: $("#register-item-text").val() },

            { name: "New ST(SAP)", value: $("#register-new-st-sap").val() },
            { name: "Current ST(MH)", value: $("#register-current-st-mh").val() },
            { name: "ST Default LT Flag", value: $("#register-st-default-flag").val() },
            { name: "ST Update Sign", value: $("#register-st-update-sign").val() },

            { name: "New TT(SAP)", value: $("#register-new-tt-sap").val() },
            { name: "Current TT(MH)", value: $("#register-current-tt-mh").val() },
            { name: "TT Update Sign", value: $("#register-tt-update-sign").val() },
            { name: "Delete Sign", value: $("#register-delete-sign").val() },

            { name: "Section", value: $(".register-section").val() }
        ];
    
        if (!validateFields(stFields)) return;
    
        let st = {
            plant:               $(".register-plant").val(),
            item_code:           $("#register-item-code").val(),
            sequence_no:         $("#register-sequence-no").val(),
            item_text:           $("#register-item-text").val(),
        
            new_st_sap:          $("#register-new-st-sap").val(),
            current_st_mh:       $("#register-current-st-mh").val(),
            st_default_flag:     $("#register-st-default-flag").val(),
            st_update_sign:      $("#register-st-update-sign").val(),
        
            new_tt_sap:          $("#register-new-tt-sap").val(),
            current_tt_mh:       $("#register-current-tt-mh").val(),
            tt_update_sign:      $("#register-tt-update-sign").val(),
            delete_sign:         $("#register-delete-sign").val(),
        
            section:             $(".register-section").val(),

            creator:             user["EmpNo"],
        };
        
    
        apiCall("/homs/api/admin/submitST.php", "POST", st)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'ST submitted successfully!',
            });
            table.ajax.reload(null, false);

            resetFields([
                ".register-plant",
                "#register-item-code",
                "#register-sequence-no",
                "#register-item-text",

                "#register-new-st-sap",
                "#register-current-st-mh",
                "#register-st-default-flag",
                "#register-st-update-sign",

                "#register-new-tt-sap",
                "#register-current-tt-mh",
                "#register-tt-update-sign",
                "#register-delete-sign",

                ".register-section"
            ])
        })
        .catch((error) => {
            console.error("Submit Failed:", error.message);
            alert("Failed to submit ST: " + error.message);
        });
    }
    
    function save(id){

        let stFields = [
            { name: "Plant", value: $(".edit-plant").val() },
            { name: "Item Code", value: $("#edit-item-code").val() },
            { name: "Sequence No.", value: $("#edit-sequence-no").val() },
            { name: "Item Text", value: $("#edit-item-text").val() },

            { name: "New ST(SAP)", value: $("#edit-new-st-sap").val() },
            { name: "Current ST(MH)", value: $("#edit-current-st-mh").val() },
            { name: "ST Default LT Flag", value: $("#edit-st-default-flag").val() },
            { name: "ST Update Sign", value: $("#edit-st-update-sign").val() },

            { name: "New TT(SAP)", value: $("#edit-new-tt-sap").val() },
            { name: "Current TT(MH)", value: $("#edit-current-tt-mh").val() },
            { name: "TT Update Sign", value: $("#edit-tt-update-sign").val() },
            { name: "Delete Sign", value: $("#edit-delete-sign").val() },

            { name: "Section", value: $(".edit-section").val() }
        ];
    
        if (!validateFields(stFields)) return;
    
        let st = {
            id: id,
            plant:               $(".edit-plant").val(),
            item_code:           $("#edit-item-code").val(),
            sequence_no:         $("#edit-sequence-no").val(),
            item_text:           $("#edit-item-text").val(),
        
            new_st_sap:          $("#edit-new-st-sap").val(),
            current_st_mh:       $("#edit-current-st-mh").val(),
            st_default_flag:     $("#edit-st-default-flag").val(),
            st_update_sign:      $("#edit-st-update-sign").val(),
        
            new_tt_sap:          $("#edit-new-tt-sap").val(),
            current_tt_mh:       $("#edit-current-tt-mh").val(),
            tt_update_sign:      $("#edit-tt-update-sign").val(),
            delete_sign:         $("#edit-delete-sign").val(),
        
            section:             $(".edit-section").val(),
    
            creator: user["EmpNo"],
        };
    
        apiCall("/homs/api/admin/updateST.php", "POST", st)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                text: 'Workcenter updated successfully!',
            });
            table.ajax.reload(null, false);
            resetFields([
                ".edit-plant",
                "#edit-item-code",
                "#edit-sequence-no",
                "#edit-item-text",

                "#edit-new-st-sap",
                "#edit-current-st-mh",
                "#edit-st-default-flag",
                "#edit-st-update-sign",

                "#edit-new-tt-sap",
                "#edit-current-tt-mh",
                "#edit-tt-update-sign",
                "#edit-delete-sign",

                ".edit-section"
            ]);
        })
        .catch((error) => {
            console.error("Update Failed:", error.message);
            alert("Failed to update workcenter: " + error.message);
        });
    }

    function deleteFunction(Id) {
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
                apiCall("/homs/api/admin/deleteST.php", "DELETE", { id: Id })
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
            endpoint: '/homs/API/admin/uploadST.php',
            formData: true,
            limit: 1,
            timeout: 0
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
            text: 'ST Uploaded successfully!',
        });
        table.ajax.reload(null, false);
    });
    
    uppy.on('upload-error', (file, error, response) => {
        alert('Error uploading file: ' + file.name + '\n' + error.message);
    });
});