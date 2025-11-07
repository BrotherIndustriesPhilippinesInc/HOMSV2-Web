
import apiCall from "../apiCall.js";
import dataTablesInitialization from "../dataTablesInitialization.js";
import {sendToWebView, receiveFromWebView} from "../WebViewInteraction.js";

$(async function () {
    //INITIALIZATION
    const user = JSON.parse(localStorage.getItem("user"));

    const params = {
        ajax: {
            url: "http://apbiphbpsts01:8080/homs/api/admin/getTaktTimeV2.php", // your endpoint
            method: "GET",
            contentType: 'application/json',
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
            { data: "model_code" },
            { data: "takt_time" },
            { data: "section" },
            { data: "creator" },
            { data: "time_created" },
            { data: "updated_by", visible : false },
            { data: "time_updated", visible : false },
            {
                data: "id",
                orderable: false,
                render: function (data) {
                    return `
                        <div class="d-flex gap-2 justify-content-center">
                            <button type="button" class="edit btn btn-sm btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary glow d-flex" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editModal">
                                <iconify-icon icon="material-symbols:edit" width="20" height="20"></iconify-icon>
                                <span class="edit-span btn-span ps-2">Edit</span>
                            </button>
                            <button type="button" class="delete btn btn-sm btn-danger bg-custom-tertiary border-1 rounded-3 fw-medium text-danger glow d-flex" data-id="${data}">
                                <iconify-icon icon="material-symbols:delete" width="20" height="20"></iconify-icon>
                                <span class="delete-span btn-span ps-2">Delete</span>
                            </button>
                        </div>

                    `;
                },
                className: "text-center" // optional: center the buttons
            }
        ]
    };
    let table = dataTablesInitialization("#data-table", params);

    //EVENTS
    $(".submit").on("click", function(){
        addModel();
    });

    $(document).on("click", ".edit", async function(){
        let id = $(this).data("id");
        let result =  await getModel(id);
        $("#editModelCode").val(result.data.model_code);
        $("#editTaktTime").val(result.data.takt_time);
        $(".update").data("id", id);
    });

    $(".update").on("click", async function(){
        let id = $(this).data("id");
        let modelCode = $("#editModelCode").val();
        let taktTime = $("#editTaktTime").val();

        let data = {
            "id": id,
            "model_code": modelCode,
            "takt_time": taktTime,
            "creator": user.EmpNo,
            "section": user.Section
        }
        await updateModel(data);
        table.ajax.reload(null, false);
    });

    $(document).on("click", ".delete", async function(){
        let id = $(this).data("id");
        await deleteModel(id);
        table.ajax.reload(null, false);
    });

    //FUNCTIONS
    async function addModel(){
        let modelCode = $("#modelCode").val();
        let taktTime = $("#taktTime").val();
        let userId = user.EmpNo;
        let section = user.Section;

        let data = {
            "model_code": modelCode,
            "takt_time": taktTime,
            "creator": userId,
            "section": section
        };

        await apiCall("http://apbiphbpsts01:8080/homs/api/admin/submitTaktTimeV2.php", "POST", data).then((result) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Takt Time added successfully!'
            }).then(() => {
                table.ajax.reload(null, false);
                $("#modelCode").val("");
                $("#taktTime").val("");

            })
        });

        
    }

    async function getModel(id){
        return await apiCall("http://apbiphbpsts01:8080/homs/api/admin/getSpecificTaktTimeV2.php?id=" + id, "GET").then((result) => {
            return result;
        });
    }

    async function updateModel(data){
        await apiCall("http://apbiphbpsts01:8080/homs/api/admin/updateTaktTimeV2.php", "PUT", data).then((result) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Takt Time updated successfully!'
            }).then(() => {
                table.ajax.reload(null, false);
            })
        });
    }

    async function deleteModel(id){
        let data = {
            "id": id
        };
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await apiCall("http://apbiphbpsts01:8080/homs/api/admin/deleteTaktTimeV2.php", "DELETE", data).then((result) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Takt Time deleted successfully!'
                    }).then(() => {
                        table.ajax.reload(null, false);
                    })
                });
            }
        })
        
    }

});