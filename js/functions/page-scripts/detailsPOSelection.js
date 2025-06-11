import appendParameterToURL from "../appendParameterToUrl.js";
import redirect from "../redirect.js";
import apiCall from "../apiCall.js";
import { search, formatTimeOnlyToPostgres, switchModals } from "../helperFunctions.js";
import dataTablesInitialization from "../dataTablesInitialization.js";

$(function () {

    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');

    let isAlreadyRunning = false;
    let selectedPOData = {};

    let table;
    
    /* PAGE INITIALIZATION */
    addReasonRow();
    addLinestopReasonRow();

     $('.advance-actions-select').select2({
        dropdownParent: $('#stopProductionModalBody')
    });

    $('.linestop-reasons-select').select2({
        dropdownParent: $('#stopProductionModalBody')
    });

     $('.linestop-actions-select').select2({
        dropdownParent: $('#stopProductionModalBody')
    });

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
            await setup(poId),
            await realTimeUpdateOfPODetails(poId),

        ).done(function () {
            loading("hide");
            createTable();
            
        }).fail(function () {
            alert('Error loading data.');
            
        });
        
        
        
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
                    "line_name": $(".areaSelect").val(),
                    "area":$(".lineSelect").val(),
                    "material": selectedPOData.material,
                    "description": selectedPOData.description,
                    "plan_quantity": selectedPOData.plan_quantity,
                    "takt_time": $("#taktTime").val(),
                    "actual_quantity": $("#actualQuantity").val().trim() === "" ? 0 : Number($("#variance").val()),
                    "variance": $("#variance").val().trim() === "" ? 0 : Number($("#variance").val()),
                    "shift": $(".shiftSelect").val(),
                    "direct_operators": $("#directOperations").val(),
                    "start_time": formatTimeOnlyToPostgres(startTime.input.value),
                    "end_time": null,
                    "creator": userId,

                    "esp_id": $(".espSelect").val(),
                    "hourly_plan": $("#hourlyPlanQuantity").val(),
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
                    }).then(async () => {
                        $(".popover-trigger").show();
                        $(".po-button-modal").hide();
                        $(".stopProduction").show();
                        $(".countInputs").show();
                        $(this).hide();
                        $(".espSelect").disabled = true;
                        isAlreadyRunning = true;
                        await loadESPList();
                        const $select = $(".espSelect");
                        $select.prop("selectedIndex", $select[0].options.length - 1).trigger("change");
                        $select.prop("disabled", true);

                        computeHourlyPlan();
                        updateVariance();
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


        /* Check if variance is 10% of plan */
        let planQuantity = parseInt($("#planQuantity").val());
        let actualQuantity = parseInt($("#actualQuantity").val());

        let variancePercent = calculateVariancePercent(planQuantity, actualQuantity);

        // Get reasons
        let advanceReasonCheck = collectAdvanceReasonData();
        let linestopReasonCheck = collectLinestopReasonData();

        // Clean empty data
        if (advanceReasonCheck.length === 1 &&
            advanceReasonCheck[0].reason_notes === "" &&
            advanceReasonCheck[0].action_notes === "") {
            advanceReasonCheck = [];
        }

        if (linestopReasonCheck.length === 1 &&
            linestopReasonCheck[0].reason_notes === "" &&
            linestopReasonCheck[0].action_notes === "") {
            linestopReasonCheck = [];
        }

        // Check variance and reasons
        if (
            Math.abs(variancePercent) >= 10 &&
            (advanceReasonCheck.length === 0 || linestopReasonCheck.length === 0)
        ) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Variance is more than 10% of plan quantity. Please select a reason.",
            });
            return;
        }

        

        /* COLLECT DATA */
        let advanceReason = JSON.stringify(collectAdvanceReasonData());
        let linestopReason = JSON.stringify(collectLinestopReasonData());

        let data = {
            "production_action": "end",
            "po_id": selectedPOData.po_id, 
            "po": selectedPOData.prd_order_no, 
            "section": section,
            "work_center": work_center,
            "line_name": $(".areaSelect").val(),
            "area": selectedPOData.line_name,
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
            "advance_reasons": advanceReason,
            "linestop_reasons": linestopReason,
            "creator": userId,

            "esp_id": $(".espSelect").val() || 0,
            "hourly_plan": $("#hourlyPlanQuantity").val(),
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
            }).then(async () => {
                $(".po-button-modal").show();
                $(".startProduction").show();
                $(".stopProduction").hide();
                $(".countInputs").hide();
                $(".shiftSelect").val("Shift").trigger("change");
                $(".areaSelect").val("new_line").trigger("change");

                $(this).show();
                resetFields();
                $(".espSelect").disabled = false;
                table.ajax.reload(null, false);
                isAlreadyRunning = false;

                $(".espSelect").attr("disabled", false);
                await loadESPList();
            });
        });

        
        clearAllAdvanceRows();
        
    });

    $("#actualQuantity").on("input", function () {
        updateVariance();
        calculateComplianceRate();
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

    $("#taktTime").on("input", function () {
        computeHourlyPlan();
        updateVariance();
    });
    
    function updateVariance(){
        const hourlyPlan = parseInt($("#hourlyPlanQuantity").val());
        const actualQuantity = parseInt($("#actualQuantity").val());

        $("#variance").val(actualQuantity - hourlyPlan);
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
        /* CLEAR CONTAINER */
        $("#po_list").empty();
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
            await loadESPList();
            return;
        }
        isAlreadyRunning = true;

        /* LINE SELECT INITIALIZATION */
        $(".lineSelect").empty();
        $(".lineSelect").append(new Option(lastRun.data.area, lastRun.data.area));
        $(".lineSelect").val(lastRun.data.area).trigger("change");

        /* AREA SELECT INITIALIZATION */
        $(".areaSelect").empty();
        $(".areaSelect").append(new Option(lastRun.data.line_name, lastRun.data.line_name));
        $(".areaSelect").val(lastRun.data.line_name).trigger("change");

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

        await loadESPList(),
        $(".espSelect").val(lastRun.data.esp_id).trigger("change");
        /* Disable select */
        $(".espSelect").attr("disabled", true);

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

        let lineSubstitute = await apiCall(`/homs/API/uploading/getPODetails.php?&section=${section}&po=${poId}`, 'GET');
                        
        selectedPOData = lastRun.data;

        /* LINE SELECT INITIALIZATION */
        /* $(".lineSelect").empty();
        $(".lineSelect").append(new Option(lastRun.data.pol_line_name, lastRun.data.pol_line_name));
        $(".lineSelect").val(lastRun.data.pol_line_name).trigger("change"); */

        $(".lineSelect").empty();
        $(".lineSelect").append(new Option(lineSubstitute.data.pol_line_name, lineSubstitute.data.pol_line_name));
        $(".lineSelect").val(lineSubstitute.data.pol_line_name).trigger("change");

        /* AREA SELECT INITIALIZATION (it is linename really got switched with area) */
        const lineSelect = $(".areaSelect").empty();
        let line_name_array = await apiCall(`/homs/API/admin/getWorkcenterDetails.php?&work_center=${work_center}`, 'GET');
        $(".areaSelect").empty();

        lineSelect.append(new Option("Select Line Name...", "new_line", true, true));
        // Allow user to open the dropdown and select an option
        lineSelect.on("change", function () {
            // Disable the first option once user makes a real choice
            $(this).find("option:first").prop("disabled", true);
        });

        line_name_array.data.forEach((element) => {
            $(".areaSelect").append(new Option(element.line_name, element.line_name));
        });

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
            resposive: true,
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
                { data: "hourly_plan", visible: true},
                { data: "takt_time", visible: false},
                { data: "actual_quantity"},
                { data: "variance"},
                { data: "shift", visible: false},
                { data: "hourly_time", visible: false},
                { data: "direct_operators", visible: false},
                { data: "start_time"},
                { data: "end_time"},
                { data: "advance_reasons", visible: false},
                { data: "linestop_reasons", visible: false},

                { data: "creator", visible: false},
                { data: "time_created", visible: false},
                { data: "updated_by", visible: false},
                { data: "production_action", visible: false},

            ],
            columnDefs: [
                { targets: 0, visible: false }, // hide ID column
                { targets: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], 
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
            if(changedFields[0]["column"] == "plan_quantity" || changedFields[0]["column"] == "actual_quantity"){

                newRowData["variance"] = parseInt(newRowData["actual_quantity"]) - newRowData["plan_quantity"];
                
                row.data(newRowData).invalidate();
            }

            let data = {"creator": userId, "old_data": JSON.stringify(oldRowData), "new_data": JSON.stringify(newRowData)};

            await apiCall('/homs/API/production/submitedithistory.php', 'POST', data);
            
            /* FORGOTTEN TO UPDATE THE DB */
            let updatedData = {
                "id": newRowData["id"],
                "po": newRowData["po"],
                "section": newRowData["section"],
                "work_center": newRowData["work_center"],
                "line_name": newRowData["line_name"],
                "area": newRowData["area"],
                "material": newRowData["material"],
                "description": newRowData["description"],
                "plan_quantity": newRowData["plan_quantity"],
                "takt_time": newRowData["takt_time"],
                "actual_quantity": newRowData["actual_quantity"],
                "variance": newRowData["variance"],
                "shift": newRowData["shift"],
                "hourly_time": newRowData["hourly_time"],
                "direct_operators": newRowData["direct_operators"],
                "start_time": newRowData["start_time"],
                "end_time": newRowData["end_time"],
                "advance_reasons": newRowData["advance_reasons"],
                "linestop_reasons": newRowData["linestop_reasons"],
                "creator": userId,
            };

            await apiCall('/homs/API/production/updateProductionRecord.php', 'POST', updatedData)
            .then((response) => {
                console.log(response);
            });

        } else {
            console.log("No changes detected in this row");
        }
    }

    function initAllDynamicSelect2sAdvanceReasons() {
        $('.dynamic-select2-advance-reasons:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Reason...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                processResults: function (data) {
                    return {
                        results: data.data
                            .filter(item => item.category === "Advance/Delay Reason")
                            .map(item => ({
                                id: item.id,
                                text: item.name
                            }))
                            .sort((a, b) => a.text.localeCompare(b.text))
                    };
                }
            }
        });
    }

    function initAllDynamicSelect2sAdvanceActions() {
        $('.dynamic-select2-advance-actions:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Action...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                processResults: function (data) {
                    return {
                        results: data.data
                            .filter(item => item.category === "Advance/Delay Action")
                            .map(item => ({
                                id: item.id,
                                text: item.name
                            }))
                            .sort((a, b) => a.text.localeCompare(b.text))
                    };
                }
            }
        });
    }

    function initAllDynamicSelect2sLinestopReasons() {
        $('.dynamic-select2-linestop-reasons:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Reason...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                processResults: function (data) {
                    return {
                        results: data.data
                            .filter(item => item.category === "Linestop/NG Reason")
                            .map(item => ({
                                id: item.id,
                                text: item.name
                            }))
                            .sort((a, b) => a.text.localeCompare(b.text))
                    };
                }
            }
        });
    }

    function initAllDynamicSelect2sLinestopActions() {
        $('.dynamic-select2-linestop-actions:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Action...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                processResults: function (data) {
                    return {
                        results: data.data
                            .filter(item => item.category === "Linestop/NG Action")
                            .map(item => ({
                                id: item.id,
                                text: item.name
                            }))
                            .sort((a, b) => a.text.localeCompare(b.text))
                    };
                }
            }
        });
    }

    $(document).on("click", ".advanceAddLayer", function(){
        addReasonRow();
        updateAddButtons();
    });

    $(document).on("click", ".advanceRemoveLayer", function () {
    const $row = $(this).closest(".reason-action-row");

    // Only remove if there is more than one row left
    if ($(".reason-action-row").length > 1) {
        $row.remove();
        updateAddButtons();
    } else {
        alert("At least one reason/action row must remain.");
    }
    });

    $(document).on("click", ".linestopAddLayer", function(){
        addLinestopReasonRow();
        updateLinestopAddButtons();
    });

    $(document).on("click", ".linestopRemoveLayer", function () {
        const $row = $(this).closest(".linestop-reason-action-row");

        // Only remove if there is more than one row left
        if ($(".linestop-reason-action-row").length > 1) {
            $row.remove();
            updateLinestopAddButtons();
        } else {
            alert("At least one reason/action row must remain.");
        }
    });

    function updateAddButtons() {
    $(".advanceAddLayer").hide().removeClass("d-flex");
    $(".advanceAddLayer").last().show().addClass("d-flex");
    }

    function updateLinestopAddButtons() {
    $(".linestopAddLayer").hide().removeClass("d-flex");
    $(".linestopAddLayer").last().show().addClass("d-flex");
    }

    function addReasonRow() {
    let componentString = `
    <div class="reason-action-row d-flex gap-2 text-center w-100">
        <div class="d-flex flex-column gap-2 text-start w-100">
            <select class="dynamic-select2-advance-reasons w-100" name="state">
                <option></option>
            </select>
            <textarea class="advanceCause secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks..."></textarea>
        </div>
        <div class="d-flex flex-column gap-2 text-start w-100">
            <select class="dynamic-select2-advance-actions w-100" name="state">
                <option></option>
            </select>
            <textarea class="advanceAction secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks..."></textarea>
        </div>
        <div class="d-flex flex-column gap-2 justify-content-between">
            <button type="button" class="advanceRemoveLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 danger glow">
                <img src="/homs/resources/icons/delete.svg" alt="remove_layer">
            </button>
            <button type="button" class="advanceAddLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 glow">
                <img src="/homs/resources/icons/add.svg" alt="add_layer">
            </button>
        </div>
    </div>
    `;



    $("#advance-container").append(componentString);
    initAllDynamicSelect2sAdvanceReasons();
    initAllDynamicSelect2sAdvanceActions();

    }

    function addLinestopReasonRow() {
        let componentString = `
    <div class="linestop-reason-action-row d-flex gap-2 text-center w-100">
        <div class="d-flex flex-column gap-2 text-start w-100">
            <select class="dynamic-select2-linestop-reasons w-100" name="state">
                <option></option>
            </select>
            <textarea class="linestopCause secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks..."></textarea>
        </div>
        <div class="d-flex flex-column gap-2 text-start w-100">
            <select class="dynamic-select2-linestop-actions w-100" name="state">
                <option></option>
            </select>
            <textarea class="linestopAction secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks..."></textarea>
        </div>
        <div class="d-flex flex-column gap-2 justify-content-between">
            <button type="button" class="linestopRemoveLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 danger glow">
                <img src="/homs/resources/icons/delete.svg" alt="remove_layer">
            </button>
            <button type="button" class="linestopAddLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 glow">
                <img src="/homs/resources/icons/add.svg" alt="add_layer">
            </button>
        </div>
    </div>
        `;

        $("#linestop-container").append(componentString);
        initAllDynamicSelect2sLinestopReasons();
        initAllDynamicSelect2sLinestopActions();

    }

    function clearAllAdvanceRows() {
        $("#advance-container").empty(); // remove all rows
        addReasonRow(); // add one fresh default row

        $("#linestop-container").empty(); // remove all rows
        addLinestopReasonRow(); // add one fresh default row
    }

    function collectAdvanceReasonData() {
        const result = [];

        $(".reason-action-row").each(function () {
            const row = $(this);

            const reason = row.find(".dynamic-select2-advance-reasons").val(); // ID of selected reason
            const reasonText = row.find(".dynamic-select2-advance-reasons option:selected").text();
            const reasonNotes = row.find("textarea.advanceCause").val();

            const action = row.find(".dynamic-select2-advance-actions").val(); // ID of selected action
            const actionText = row.find(".dynamic-select2-advance-actions option:selected").text();
            const actionNotes = row.find("textarea.advanceAction").val();

            result.push({
                reason_id: reason,
                reason_label: reasonText,
                reason_notes: reasonNotes,
                action_id: action,
                action_label: actionText,
                action_notes: actionNotes
            });
        });

        return result;
    }

    function collectLinestopReasonData() {
        const result = [];

        $(".linestop-reason-action-row").each(function () {
            const row = $(this);

            const reason = row.find(".dynamic-select2-linestop-reasons").val(); // ID of selected reason
            const reasonText = row.find(".dynamic-select2-linestop-reasons option:selected").text();
            const reasonNotes = row.find("textarea.linestopCause").val();

            const action = row.find(".dynamic-select2-linestop-actions").val(); // ID of selected action
            const actionText = row.find(".dynamic-select2-linestop-actions option:selected").text();
            const actionNotes = row.find("textarea.linestopAction").val();

            result.push({
                reason_id: reason,
                reason_label: reasonText,
                reason_notes: reasonNotes,
                action_id: action,
                action_label: actionText,
                action_notes: actionNotes
            });
        });

        return result;
    }

    async function loadESPList() {
        const $espSelect = $(".espSelect").empty();
        $espSelect.append(new Option("Select ESP...", "", true, true));

        // Allow user to open the dropdown and select an option
        $espSelect.on("change", function () {
            // Disable the first option once user makes a real choice
            $(this).find("option:first").prop("disabled", true);
        });

        try {
            const response = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&isAlreadyRunning=${isAlreadyRunning}&po_id=${selectedPOData.po_id}`, 'GET');
            const espData = response.data;

            if (!espData || espData.length === 0) {
                $espSelect.append(new Option("No ESPs available", "", false, false));
                return;
            }
            /* Add Manual Option */
            $espSelect.append(new Option("Manual", "0", false, false));

            espData.forEach(({ esp_name, sensor_name, id }) => {
                $espSelect.append(new Option(`${esp_name} - ${sensor_name}`, id));
            });

        } catch (error) {
            console.error("Failed to load ESPs:", error);
            $espSelect.append(new Option("Error loading ESPs", "", false, false));
        }
    }

    $(".po-button-modal").on("click", function () {
        getPOList();
    });

    async function realTimeUpdateOfPODetails(poId) {

        const response = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}`, 'GET');
        const data = response.data;

        if (data) {
            /* Compute Hourly plan */
            computeHourlyPlan();
            updateActualQuantity(data.actual_quantity);
            updateVariance();
        }

        /* 5 Seconds timer update */
        if($(".espSelect").val() != 0){
            setInterval(async () => {
                
                const response = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}`, 'GET');
                const data = response.data;

                /* Compute Hourly plan */
                if (data) {
                    computeHourlyPlan();
                    updateActualQuantity(data.actual_quantity);
                    updateVariance();
                }
                
            }, 3000);
        }
        

        
    }

    function updateActualQuantity(quantity) {
        $("#actualQuantity").val(quantity);
    }

    function computeHourlyPlan() {
        let taktTime = $("#taktTime").val();
        let planQuantity = $("#planQuantity").val();
        let hourlyPlan = 60 / taktTime;
        hourlyPlan = Math.round(hourlyPlan);
        if(planQuantity < hourlyPlan){
            $("#hourlyPlanQuantity").val(planQuantity);
        }else{
            $("#hourlyPlanQuantity").val(hourlyPlan);
        }
    }

    function calculatePercent(value, percent) {
        return value * (percent / 100);
    }

    function calculateVariancePercent(plan, actual) {
    if (plan === 0) {
        // Avoid dividing by zero, duh!
        return 0;
    }

    const variance = ((actual - plan) / plan) * 100;
    return parseFloat(variance.toFixed(2)); // Keep it pretty
    }

    function calculateComplianceRate(){
        let actualQuantity = parseInt($("#actualQuantity").val());
        let hourlyPlanQuantity = parseInt($("#hourlyPlanQuantity").val());

        let complianceRate = 0;

        complianceRate = actualQuantity / hourlyPlanQuantity * 100;

        $("#complianceRate").val(complianceRate.toFixed(2) + "%");
    }
    
});

