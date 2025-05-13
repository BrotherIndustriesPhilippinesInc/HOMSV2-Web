import appendParameterToURL from "../appendParameterToUrl.js";
import redirect from "../redirect.js";
import apiCall from "../apiCall.js";
import { search, formatTimeOnlyToPostgres, switchModals } from "../helperFunctions.js";
import dataTablesInitialization from "../dataTablesInitialization.js";

$(function () {

    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');

    let selectedPOData = {};

    let table;
    
    /* PAGE INITIALIZATION */
    $('.js-example-basic-single').select2();
    getPOList();
    getReasons();
    $(".stopProduction").hide();
    $(".countInputs").hide();
    $("#initial").removeClass("gap-2");
    const startTime = flatpickr("#startTime");
    const endTime = flatpickr("#endTime");

    /* MAIN FUNCTION START */

    $("#searchPO").on("input", function (e) {
        search($("#po_list")[0], this, "po-button");
    });

    popoverInitialize();

    $(".homsView").on("click", function (e) {
        redirect("/homs/production/output");
    });

    $(document).on("click", ".po-button", async function (e) {
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('poModal'));
        if (modal) modal.hide();
        loading("show");

        const poId = $(this).data("po-id");
        $.when(
            setup(poId),
            
        ).done(function () {
            loading("hide");
            createTable();
        }).fail(function () {
            alert('Error loading data.');
            
        });

        updateVariance();
    });

    $(".startProduction").on("click", function () {
        
        const shift = {
            "ds": {"from": "06:00", "to": "19:00"},
            "ns": {"from": "19:00", "to": "05:30"},
        };
    
        let now = new Date();
        let selectedShift = null;
    
        for (const [key, value] of Object.entries(shift)) {
            const from = toTimeObj(value.from);
            const to = toTimeObj(value.to);
    
            if (now >= from && now <= to) {
                selectedShift = key;
                break;
            }
        }
    
        if (!selectedShift) {
            alert("No matching shift found for the current time.");
            return;
        }
    
        Swal.fire({
            title: 'Start Production',
            text: "Are you sure you want to start production?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, start it!',
            cancelButtonText: 'No, cancel!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#startTime").val(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                $(".shiftSelect").val(selectedShift);


                let data = {
                    "production_action": "start",
                    "po_id": selectedPOData.po_id, 
                    "po": selectedPOData.prd_order_no, 
                    "section": section,
                    "work_center": work_center,
                    "line_name": selectedPOData.line_name,
                    "area": "N/A",
                    "material": selectedPOData.material,
                    "description": selectedPOData.description,
                    "plan_quantity": selectedPOData.plan_quantity,
                    "takt_time": $("#taktTime").val(),
                    "actual_quantity": $("#actualQuantity").val(),
                    "variance": $("#variance").val(),
                    "shift": $(".shiftSelect").val(),
                    "direct_operators": $("#directOperations").val(),
                    "start_time": formatTimeOnlyToPostgres(startTime.input.value),
                    "end_time": null,
                    "creator": userId
                }
                let result = await apiCall('/homs/API/production/startProductionRecord.php', 'POST', data).then((response) => {
                    /* ACKNOWLEDGEMENT */
                    Swal.fire({
                        title: 'Started!',
                        text: 'Production has been started.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
                        $(".popover-trigger").show();
                        $(".po-button-modal").hide();
                        $(".stopProduction").show();
                        $(".countInputs").show();
                        $(this).hide();
                    });
                    table.ajax.reload(null, false);
                });
            }
        });

        
    });

    $(".save").on("click", async function () {
    
        $("#endTime").val(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
        const hourlyTime = {
            "0": {"from": "06:00", "to": "08:00"},
            "1": {"from": "08:00", "to": "10:00"},
            "2": {"from": "10:00", "to": "12:00"},
            "3": {"from": "12:00", "to": "14:00"},
            "4": {"from": "14:00", "to": "16:00"},
            "5": {"from": "16:00", "to": "18:00"},
            "6": {"from": "18:00", "to": "20:00"},
            "7": {"from": "20:00", "to": "22:00"},
            "8": {"from": "22:00", "to": "24:00"},
        };

        let now = new Date();
        let selectedHourly = null;
    
        for (const [key, value] of Object.entries(hourlyTime)) {
            const from = toTimeObj(value.from);
            const to = toTimeObj(value.to);
    
            if (now >= from && now <= to) {
                selectedHourly = key;
                break;
            }
        }
    
        if (!selectedHourly) {
            alert("No matching shift found for the current time.");
            return;
        }
    
        $(".hourlyTime").val(selectedHourly);

        let data = {
            "production_action": "end",
            "po_id": selectedPOData.po_id, 
            "po": selectedPOData.prd_order_no, 
            "section": section,
            "work_center": work_center,
            "line_name": selectedPOData.line_name,
            "area": "N/A",
            "material": selectedPOData.material,
            "description": selectedPOData.description,
            "plan_quantity": selectedPOData.plan_quantity,
            "takt_time": $("#taktTime").val(),
            "actual_quantity": $("#actualQuantity").val(),
            "variance": $("#variance").val(),
            "shift": $(".shiftSelect").val(),
            "hourly_time": $(".hourlyTime").val(),
            "direct_operators": $("#directOperations").val(),
            "start_time": null,
            "end_time": formatTimeOnlyToPostgres(endTime.input.value),
            "advance_reason": $("#advanceCause").val(),
            "advance_action": $("#advanceAction").val(),
            "linestop_reason": $("#linestopCause").val(),
            "linestop_action": $("#linestopAction").val(),
            "creator": userId
        }

        let result = await apiCall('/homs/API/production/endProductionRecord.php', 'POST', data).then((response) => {
            /* CONFIRMATION */
            Swal.fire({
                title: 'Stopped!',
                text: 'Production has been stopped.',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                $(".po-button-modal").show();
                $(".startProduction").show();
                $(".stopProduction").hide();
                $(".countInputs").hide();
                $(".shiftSelect").val("Shift").trigger("change");
                $(this).show();
                resetFields();

                table.ajax.reload(null, false);
            });
        });

        
    });

    $("#actualQuantity").on("input", function () {
        updateVariance();
    });

    $(document).on("click", ".advance_reason", function () {
        let current = $("#advanceCause").val(); // get current textarea content
        let textToAdd = $(this).text().trim();  // get button text
        $("#advanceCause").val(current + (current ? "\n" : "") + textToAdd); // append with newline if needed

        $('#advanceCauseCategoriesModal').modal('hide');
        $('#stopProductionModal').modal('show');
    });

    $(document).on("click", ".advance_action", function () {
        let current = $("#advanceAction").val(); // get current textarea content
        let textToAdd = $(this).text().trim();  // get button text
        $("#advanceAction").val(current + (current ? "\n" : "") + textToAdd); // append with newline if needed

        $('#advanceActionCategoriesModal').modal('hide');
        $('#stopProductionModal').modal('show');
    });

    $(document).on("click", ".linestop_reason", function () {
        let current = $("#linestopCause").val(); // get current textarea content
        let textToAdd = $(this).text().trim();  // get button text
        $("#linestopCause").val(current + (current ? "\n" : "") + textToAdd); // append with newline if needed

        $('#linestopCauseCategoriesModal').modal('hide');
        $('#stopProductionModal').modal('show');
    });

    $(document).on("click", ".linestop_action", function () {
        let current = $("#linestopAction").val(); // get current textarea content
        let textToAdd = $(this).text().trim();  // get button text
        $("#linestopAction").val(current + (current ? "\n" : "") + textToAdd); // append with newline if needed

        $('#linestopActionCategoriesModal').modal('hide');
        $('#stopProductionModal').modal('show');
    });
    
    function updateVariance(){
        const planQuantity = parseInt($("#planQuantity").val());
        const actualQuantity = parseInt($("#actualQuantity").val());

        $("#variance").val(actualQuantity - planQuantity);
    }

    function toTimeObj(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        return now;
    }
    
    function popoverInitialize() {
        const popoverTrigger = document.querySelector(".popover-trigger");
        const content = document.querySelector("#popover-stops").innerHTML;

        new bootstrap.Popover(popoverTrigger, {
            html: true,
            sanitize: false,
            content: function () {
                return content;
            }
        });
    }

    async function getPOList() {

        const container = document.getElementById('po_list');

        const wc = new URLSearchParams(window.location.search).get('wc');

        let data = await apiCall('/homs/API/uploading/getPOList.php?section=' + section + '& wc=' + wc, 'GET');
        let response = await apiCall('/homs/helpers/componentAPI/poButtons.php', 'POST', { data: data.data });

        container.innerHTML = response.html;
    }

    async function getReasons() {
        let advanceReasons = document.getElementById('advance-reasons');
        let advanceActions = document.getElementById('advance-actions');

        let lineStopReasons = document.getElementById('linestop-reasons');
        let lineStopActions = document.getElementById('linestop-actions');
        
        let reasons = await apiCall('/homs/API/admin/getReasons.php', 'GET');
    
        // ✅ Sort alphabetically by name (case-insensitive)
        reasons["data"].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    
        let html = '';
    
        for (const element of reasons["data"]) {
            if (element["category"] === "Advance/Delay Reason") {
                element["reason_type"] = "advance_reason";
                const response = await apiCall('/homs/helpers/componentAPI/reasonButtons.php', 'POST', { data: element });
                html += response.html;
            }else if (element["category"] === "Advance/Delay Action"){
                element["reason_type"] = "advance_action";
                const response = await apiCall('/homs/helpers/componentAPI/reasonButtons.php', 'POST', { data: element });
                advanceActions.innerHTML += response.html;
            }else if(element["category"] === "Linestop/NG Reason"){
                element["reason_type"] = "linestop_reason";
                const response = await apiCall('/homs/helpers/componentAPI/reasonButtons.php', 'POST', { data: element });
                lineStopReasons.innerHTML += response.html;
            }else if(element["category"] === "Linestop/NG Action"){
                element["reason_type"] = "linestop_action";
                const response = await apiCall('/homs/helpers/componentAPI/reasonButtons.php', 'POST', { data: element });
                lineStopActions.innerHTML += response.html;
            }
        }
    
        advanceReasons.innerHTML = html;
    }
    
    function resetFields(){
        /* $("#planQuantity").val("0"); */
        /* $("#actualQuantity").val("0"); */
        /* $(".lineSelect").val("").trigger("change"); */
        
        $(".shiftSelect").val("Shift").trigger("change");
        $(".hourlyTime").val("").trigger("change");

        $("#directOperations").val("0");

        $("#startTime").val("00:00");
        $("#endTime").val("00:00");

        $("#advanceCause").val("");
        $("#advanceAction").val("");
        $("#linestopCause").val("");
        $("#linestopAction").val("");

        updateVariance();
    }

    async function setup(poId){
        let lastRun = await getLatestRun(poId);
        if (
            lastRun.data.production_action === "end" ||
            lastRun.data.production_action === undefined ||
            lastRun.data.production_action === ""
        ) {
            await initialSetup(poId);
            return;
        }

        /* LINE SELECT INITIALIZATION */
        $(".lineSelect").empty();
        $(".lineSelect").append(new Option(lastRun.data.line_name, lastRun.data.line_name));
        $(".lineSelect").val(lastRun.data.line_name).trigger("change");

        /* AREA SELECT INITIALIZATION */

        /* PLAN QUANTITY INITIALIZATION */
        $("#planQuantity").val(lastRun.data.plan_quantity);

        if(lastRun){
            $("#details-container").removeClass("d-none");
            $("#details-container").addClass("d-flex");
        }

        /* DATA SETTING */
        $("#po_number span").text(lastRun.data.prd_order_no);
        $("#material span").text(lastRun.data.material);
        $("#description span").text(lastRun.data.description);
        $("#taktTime").val(lastRun.data.takt_time?? 0);
        $("#actualQuantity").val(lastRun.data.actual_quantity ?? 0);
        $("#variance").val(lastRun.data.variance?? 0);
        $(".shiftSelect").val(lastRun.data.shift);

        /* $("#advanceCause").val(lastRun.data.advance_reason);
        $("#advanceAction").val(lastRun.data.advance_action);
        $("#linestopCause").val(lastRun.data.linestop_reason);
        $("#linestopAction").val(lastRun.data.linestop_action); */

        /* FLIP TO STOP PRODUCTION */
        $(".popover-trigger").show();
        $(".po-button-modal").hide();
        $(".stopProduction").show();
        $(".countInputs").show();
        $(".startProduction").hide();
    }

    async function getLatestRun(poId){
        let now = new Date();
        let localDateTime = now.toLocaleString('en-PH', {
            timeZone: 'Asia/Manila'
        });

        let details = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}`, 'GET');
        selectedPOData = details.data;
        
        return details;
    }

    async function initialSetup(poId){
        let lastRun = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}`, 'GET');
                        
        selectedPOData = lastRun.data;

        /* LINE SELECT INITIALIZATION */
        $(".lineSelect").empty();
        $(".lineSelect").append(new Option(lastRun.data.line_name, lastRun.data.line_name));
        $(".lineSelect").val(lastRun.data.line_name).trigger("change");

        /* AREA SELECT INITIALIZATION */

        /* PLAN QUANTITY INITIALIZATION */
        $("#planQuantity").val(lastRun.data.plan_quantity);

        if(lastRun){
            $("#details-container").removeClass("d-none");
            $("#details-container").addClass("d-flex");
        }

        /* DATA SETTING */
        $("#po_number span").text(lastRun.data.prd_order_no);
        $("#material span").text(lastRun.data.material);
        $("#description span").text(lastRun.data.description);
        $("#taktTime").val(lastRun.data.takt_time?? 0);
        $("#actualQuantity").val(lastRun.data.actual_quantity ?? 0);
        $("#variance").val(lastRun.data.variance?? 0);
        $('.shiftSelect').prop('selectedIndex', 0).trigger('change');

        /* ADD both data setting the reasons */
        $("#advanceCause").val(lastRun.data.advance_reason);
        $("#advanceAction").val(lastRun.data.advance_action);
        $("#linestopCause").val(lastRun.data.linestop_reason);
        $("#linestopAction").val(lastRun.data.linestop_action);

        /* TAKT TIME OVERRIDE */
        let itemCode = lastRun.data.material;
        let taktTimeValue = await apiCall(`/homs/API/admin/getTaktTime.php?material=${itemCode}`, 'GET');
        $("#taktTime").val(taktTimeValue.data.current_tt_mh);
    }

    function loading(state){
        if(state === "show"){
            $("#loading").show();
            $("#loading").addClass('d-flex');

            $(".initial").removeClass("d-flex");
            $(".initial").addClass("initial-setup"); 
            
            $(".popover-trigger").hide();
        }
        else if(state === "hide"){
            $("#loading").hide();
            $("#loading").removeClass('d-flex');

            $(".initial").removeClass("d-none");
            $(".initial").removeClass("initial-setup");

            $(".popover-trigger").show();
        }
    }

    function createTable(){
        const params = {
            ajax: {
                url: `/homs/api/production/getSectionProduction.php?section=${section}&po=${selectedPOData.prd_order_no}`, // your endpoint
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
                { data: 'id' },
                { data: "po", visible: false},
                { data: "section", visible: false},
                { data: "work_center", visible: false},
                { data: "line_name", visible: false},
                { data: "area", visible: false},
                { data: "material", visible: false},
                { data: "description", visible: false},
                { data: "plan_quantity"},
                { data: "takt_time", visible: false},
                { data: "actual_quantity"},
                { data: "variance"},
                { data: "shift", visible: false},
                { data: "hourly_time", visible: false},
                { data: "direct_operators", visible: false},
                { data: "start_time"},
                { data: "end_time"},
                { data: "advance_reason", visible: false},
                { data: "advance_action", visible: false},
                { data: "linestop_reason", visible: false},
                { data: "linestop_action", visible: false},

                { data: "creator", visible: false},
                { data: "time_created", visible: false},
                { data: "updated_by", visible: false},
                { data: "production_action", visible: false},
                {
                    data: null,
                    title: "Actions",
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-primary edit-prod" data-prod_id="${row.id}" data-bs-toggle="modal" data-bs-target="#prodEditModal">Edit</button>
                            <button class="btn danger delete-prod" data-prod_id="${row.id}">Delete</button>
                        `;
                    }
                },
                
            ],
            columnDefs: [
                { targets: 0, visible: false }, // hide ID column
                { targets: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 
                    createdCell: function (td, cellData, rowData, rowIndex, colIndex) {
                        $(td).attr('contenteditable', 'true');
                    }
                }
            ],
    
            createdRow: function(row, data, dataIndex) {
                $(row).addClass('reason-row');
                $(row).attr('data-reason-id', data["id"]);
            }
        };
        $('#data-table').DataTable().destroy();
        table = dataTablesInitialization("#data-table", params);
    }

    let oldRowData = null;
    // Capture old row data on focus (when a cell is clicked to edit)
    $(document).on('focus', '#data-table tbody td[contenteditable]', function () {
        const row = table.row($(this).closest('tr'));  // Get the row containing the edited cell
        oldRowData = $.extend(true, {}, row.data());  // Make a deep copy of the old row data
    });

    // Capture the edit when the cell loses focus (after editing)
    $(document).on('blur', '#data-table tbody td[contenteditable]', function () {
        watchEdit(this, table, oldRowData);
    });

    async function watchEdit(cell, table, oldRowData) {
        const row = table.row(cell.closest('tr'));
        const newRowData = row.data();
        const colIndex = table.cell(cell).index().column;
        const colName = table.settings()[0].aoColumns[colIndex].data;
        const newValue = $(cell).text().trim();
    
        const oldValueStr = (oldRowData[colName] ?? '').toString().trim();
        const newValueStr = newValue.toString().trim();
    
        const changedFields = [];
    
        if (oldValueStr !== newValueStr) {
            changedFields.push({
                column: colName,
                oldValue: oldValueStr,
                newValue: newValueStr
            });
    
            // Update internal DataTable state
            newRowData[colName] = newValue;
            row.data(newRowData).invalidate();
    
            console.log('Row edited:', {
                oldRowData,
                newRowData,
                changedFields
            });

            let data = {"creator": userId, "old_data": JSON.stringify(oldRowData), "new_data": JSON.stringify(newRowData)};

            await apiCall('/homs/API/production/submitedithistory.php', 'POST', data);
            
        } else {
            console.log("No changes detected in this row");
        }
    }
});