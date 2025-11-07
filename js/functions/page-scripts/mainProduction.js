import appendParameterToURL from "../appendParameterToUrl.js";
import redirect from "../redirect.js";
import apiCall from "../apiCall.js";
import { search, formatTimeOnlyToPostgres, switchModals, getTodayDateString } from "../helperFunctions.js";
import dataTablesInitialization from "../dataTablesInitialization.js";
import { convertTo24Hour} from "../helperFunctions.js";

$(async function () {

    /* INITIALIZATION */
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    let work_center = localStorage.getItem('wc');

    let timeSyncInterval = null;
    let oldRowData = null;
    let poDetailsInterval = null;

    let globalSettings = {};

    let hourlyUpdates = false;
    let startProductionTime = null;
    let lastUpdateTime = null;

    const toastWatchEdit = document.getElementById('watchEdit')
    
    const dateSelect = flatpickr("#dateSelect", {
        enableTime: false,
        dateFormat: "Y-m-d",
        disableMobile: true,
        allowInput: true,
        defaultDate: new Date(),
        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr ready. Date:", dateStr);
        }
    });

    const startTime = flatpickr("#startTime", {
        enableTime: true,
        noCalendar: true, // hides calendar from UI
        disableMobile: true,
        allowInput: true,
        hourIncrement: 1,
        minuteIncrement: 1,
        enableSeconds: true,
        defaultDate: new Date(),
        dateFormat: "h:i:s K", // shown format: "12:34:56 PM"

        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const fullDate = selectedDates[0];

                // Build full datetime string in ISO format
                const isoString = fullDate.toISOString().slice(0, 19).replace('T', ' '); // e.g. "2025-07-10 18:35:28"
                
                // Store this somewhere safe
                startProductionTime = isoString;

                console.log("Actual full datetime stored:", startProductionTime);
            }
        },

        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr ready. Selected:", selectedDates);
        }
    });

    startSyncingFlatpickrToNow(startTime);
    
    const endTime = flatpickr("#endTime", {
        enableTime: true,
        noCalendar: true,
        disableMobile: true,
        allowInput: true,
        hourIncrement: 1,
        minuteIncrement: 1,
        enableSeconds: true,
        defaultDate: new Date(), // Crucial for pre-filling and populating selectedDates
        // Add an onReady hook to confirm when it's ready
         dateFormat: "h:i:s K", // h: 12-hour, i: minutes, K: AM/PM
        onReady: function(selectedDates, dateStr, instance) {
            console.log("Flatpickr for #endTime is ready. Selected dates:", selectedDates);
        }
    });

    let isAlreadyRunning = false;
    
    let selectedPOData = {};
    let table;

    let producedUnits = 0;
    let taktTimer = null;

    let selectedPOID;

    getPOList();
    popoverInitialize();

    addReasonRow("#advance-container");
    addLinestopReasonRow("#linestop-container");

    /* FEATURE CHECKS */
    startFeatureChecks();

    /* EVENTS */
    $(".homsView").on("click", function (e) {
        redirect("/homs/production/output");
    });

    $("#searchPO").on("input", function (e) {
        search($("#po_list")[0], this, "po-button");
    });

    $(document).on("click", ".po-button", async function (e) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('poModal'));
        if (modal) modal.hide();
        loading("show");

        const poId = $(this).data("po-id");
        selectedPOID = poId;
        /* HIDE UNNECESSARY DATAS */
        $(".stopProduction").hide();
        $(".countInputs").hide();

        $.when(
            await setup(poId, $("#dateSelect").val()),
        ).done(function () {
            loading("hide");
            taktTimeToSeconds($("#taktTime").val());
            createTable();
        }).fail(function () {
            alert('Error loading data.');
        });

        
    });

    $("#dateSelect").on("change", async function () {
        if(selectedPOID ){
            loading("show");

            $(".stopProduction").hide();
            $(".countInputs").hide();

            $.when(
                await setup(selectedPOID, $("#dateSelect").val()),
            ).done(function () {
                loading("hide");
                createTable();
            }).fail(function () {
                alert('Error loading data.');
            });
        }
        
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
                
                /* CHECK INPUTS IF COMPLETE */
                let espSelected = $(".espSelect").val();
                let lineSelected = $(".lineSelect").val();
                let shiftSelected = $(".shiftSelect").val();

                if(
                    espSelected == "" ||
                    lineSelected == "0" ||
                    shiftSelected == "Shift"
                ){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please complete the form before starting production.',
                        timer: 1000,
                        timerProgressBar: true
                    });
                    return;
                }


                $("#startTime").val(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                $(".shiftSelect").val(selectedShift);

                let date = formatTimeOnlyToPostgres(startTime.input.value);
                let data = {
                    "production_action": "start",
                    "po_id": selectedPOData.po_id, 
                    "po": selectedPOData.prd_order_no, 
                    "section": section,
                    "work_center": work_center,
                    "line_name": $(".lineSelect option:selected").text(),
                    "area":$(".areaSelect option:selected").text(),
                    "material": selectedPOData.material,
                    "description": selectedPOData.description,
                    "plan_quantity": $("#planQuantity").val(),
                    "takt_time": $("#taktTime").val(),
                    "actual_quantity": $("#actualQuantity").val().trim() === "" ? 0 : Number($("#actualQuantity").val()),
                    "variance": $("#variance").val().trim() === "" ? 0 : Number($("#variance").val()),
                    "shift": $(".shiftSelect").val(),
                    "direct_operators": $("#directOperations").val(),
                    "start_time": formatTimeOnlyToPostgres(startTime.input.value),
                    /* "start_time": $("#dateSelect").val() + " " + startTime.input.value, */
                    "end_time": null,
                    "creator": userId,

                    "esp_id": $(".espSelect").val(),
                    "hourly_plan": $("#hourlyPlanQuantity").val(),
                    "target": $("#target").val(),
                    "compliance_rate": $("#complianceRate").val().replace('%', ''),

                    "commulative_plan": $("#target").val(),
                    "commulative_actual": $("#actualQuantity").val().trim() === "" ? 0 : Number($("#actualQuantity").val()),
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
                        $(".stopProduction").show();
                        $(this).hide();

                        $(".po-button-modal").hide();
                        $(".popover-trigger").show();
                        
                        $(".countInputs").show();

                        $(".espSelect").attr("disabled", true);
                        $(".lineSelect").attr("disabled", true);
                        $(".areaSelect").attr("disabled", true);
                        $(".shiftSelect").attr("disabled", true);
                        
                        isAlreadyRunning = true;

                        computeHourlyPlan();
                        updateVariance();

                        setTarget();
                        startTaktTimer();

                        /* START REALTIME UPDATE IF ESP IS SELECTED */
                        let espSelectID = $(".espSelect").val();
                        if (espSelectID !== "0") {
                            realTimeUpdateOfPODetails(selectedPOData.po_id, date);
                        }

                        startProductionTime = $("#dateSelect").val() + " " + convertTo24Hour(startTime.input.value);
                    });
                    table.ajax.reload(null, false);
                });
            }
        });
    });

    $("#actualQuantity").on("input", function () {
        updateVariance();
        calculateComplianceRate();
    });

    $("#target").on("input", function () {
        updateVariance();
        calculateComplianceRate();
    });

    $("#taktTime").on("input", function () {
        startTaktTimer();
    });

    $(".shiftSelect").on("change", function () {
        if ($(this).val() === "ds") {
            // Find the corresponding lineSelect in the same .d-flex container
            const $lineSelect = $(this)
                .closest(".d-flex")
                .find(".lineSelect");

            // Select option by index — e.g., 1 = first selectable (not "Select Line...")
            $lineSelect.find("option").eq(1).prop("selected", true);

            // Trigger change to update Select2 or dependent UI
            $lineSelect.trigger("change");
        }else{
            // Find the corresponding lineSelect in the same .d-flex container
            const $lineSelect = $(this)
                .closest(".d-flex")
                .find(".lineSelect");

            // Select option by index — e.g., 1 = first selectable (not "Select Line...")
            $lineSelect.find("option").eq(2).prop("selected", true);

            // Trigger change to update Select2 or dependent UI
            $lineSelect.trigger("change");
        }
    });

    $(document).on("click", ".advanceAddLayer", function(){
        addReasonRow("#advance-container");
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
        addLinestopReasonRow("#linestop-container");
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

    $(document).on("click", ".edit-advanceAddLayer", function () {
        addReasonRow("#edit-advance-container", true);
        updateAddButtons(true);
    });

    $(document).on("click", ".edit-advanceRemoveLayer", function () {
        const $row = $(this).closest(".edit-reason-action-row");

        // Only remove if there is more than one row left
        if ($(".edit-reason-action-row").length > 1) {
            $row.remove();
            updateAddButtons(true);
        } else {
            alert("At least one reason/action row must remain.");
        }
    });

    $(document).on("click", ".edit-linestopAddLayer", function () {
        addLinestopReasonRow("#edit-linestop-container", true);
        updateLinestopAddButtons(true);
    });

    $(document).on("click", ".edit-linestopRemoveLayer", function () {
        const $row = $(this).closest(".edit-linestop-reason-action-row");

        // Only remove if there is more than one row left
        if ($(".edit-linestop-reason-action-row").length > 1) {
            $row.remove();
            updateLinestopAddButtons(true);
        } else {
            alert("At least one reason/action row must remain.");
        }
    });

    $(".save").on("click", async function () {
        
        $("#endTime").val(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
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
        let planQuantity = parseInt($("#hourlyPlanQuantity").val());
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

        let advanceReason = collectAdvanceReasonData();
        let linestopReason = collectLinestopReasonData();

        if($("#espSelect").val() == 0){
            console.log("Please select ESP Sensor");
        }else{
            console.log("esp selected");
        }

        let data = {
            "production_action": "end",
            "po_id": selectedPOData.po_id, 
            "po": selectedPOData.prd_order_no, 
            "section": section,
            "work_center": work_center,
            "line_name": $(".lineSelect option:selected").text(),
            "area":$(".areaSelect option:selected").text(),
            "material": selectedPOData.material,
            "description": selectedPOData.description,
            "plan_quantity": $("#planQuantity").val(),
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

            "hourly_plan": $("#hourlyPlanQuantity").val(),
            "target": $("#target").val(),
            "compliance_rate": $("#complianceRate").val().replace('%', ''),
            "esp_id": $(".espSelect").val(),

            "islinestop": $("#islinestop").is(":checked") ? true : false
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

                stopRealTimePODetails();
                stopTaktTimer();

                $(".startProduction").show();
                $(".stopProduction").hide();

                /* RESET FIELDS */
                $(".espSelect").attr("disabled", false);
                $(".lineSelect").attr("disabled", false);
                $(".areaSelect").attr("disabled", false);
                $(".shiftSelect").attr("disabled", false);

                $(".po-button-modal").show();

                let espList = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&po=${selectedPOData.po_id}&isAlreadyRunning=false`, 'GET');
                assignESPListValues(espList.data);
                $(".espSelect").val("").trigger("change");
                $(".lineSelect").val("").trigger("change");
                $(".shiftSelect").val("Shift").trigger("change");
                
                $("#planQuantity").val($("#planQuantity").val() - $("#actualQuantity").val());
                $("#hourlyPlanQuantity").val(0);
                $("#target").val(0);
                $("#actualQuantity").val(0);
                $("#complianceRate").val(0);
                $("#variance").val(0);

                computeHourlyPlan();
                setTarget();
                updateVariance();
                calculateComplianceRate();

                /* $(".countInputs").hide(); */

                $("#esp-output-conainer").hide();

                table.ajax.reload(null, false);
            });
        });
        clearAllAdvanceRows();
    });

    // Capture old row data on focus (when a cell is clicked to edit)
    $(document).on('focus', '#data-table tbody td[contenteditable]', function () {
        const row = table.row($(this).closest('tr'));  // Get the row containing the edited cell
        oldRowData = $.extend(true, {}, row.data());  // Make a deep copy of the old row data
    });

    // Capture the edit when the cell loses focus (after editing)
    $(document).on('blur', '#data-table tbody td[contenteditable]', function () {
        watchEdit(this, table, oldRowData);
    });

    $(document).on("click", ".edit-reason", async function () {
        $("#edit-advance-container").empty(); // remove all rows
        $("#edit-linestop-container").empty();

        let rowID = $(this).data("id");
        await showEditAdvanceReason(rowID);
        $(".editSave").data("id", rowID);
    });

    $(".editSave").on("click", async function () {
        editSave();
    });

    
    
    /* FUNCTIONS */
    async function getPOList() {
        $("#po_list").empty();
        const container = document.getElementById('po_list');

        const wc = new URLSearchParams(window.location.search).get('wc');

        let data = await apiCall('/homs/API/uploading/getPOList.php?section=' + section + '& wc=' + wc, 'GET');
        let response = await apiCall('/homs/helpers/componentAPI/poButtons.php', 'POST', { data: data.data });

        container.innerHTML = response.html;
    }

    function createTable(){
        let date = dateSelect.input.value;
        const params = {
            resposive: true,
            ajax: {
                url: `/homs/api/production/getSectionProduction.php?section=${section}&po=${selectedPOData.prd_order_no}&date=${date}`, // your endpoint
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
                { data: "po", visible: true},
                { data: "section", visible: false},
                { data: "work_center", visible: false},
                { data: "line_name", visible: false},
                { data: "area", visible: false},
                { data: "material", visible: false},
                { data: "description", visible: false},
                { data: "plan_quantity", visible: false},
                { data: "hourly_plan", visible: false},
                { data: "takt_time", visible: false},

                { data: "target", visible: true},
                { data: "commulative_plan", visible: true},

                { 
                    data: "actual_quantity", 
                    render: function(data, type, row, meta) {
                        if (!data) return "-";

                        let parsed;
                        try {
                            parsed = (typeof data === "string") ? JSON.parse(data) : data;
                        } catch (e) {
                            console.error("Invalid JSON in actual_quantity:", data);
                            return data;
                        }

                        // parsed is an object → convert to array of [key, value]
                        let html = Object.entries(parsed).map(([sensor, qty]) => `
                            <div class="mb-1">
                                <strong>${sensor}</strong>: <span class="text-primary">${qty}</span>
                            </div>
                        `).join("");

                        return `<div style="max-height:100px;overflow-y:auto;">${html}</div>`;
                    }
                },
                { data: "commulative_actual", visible: true},

                { data: "compliance_rate", visible: true},
                { data: "variance"},
                { data: "shift", visible: false},
                { data: "hourly_time", visible: false},
                { data: "direct_operators", visible: false},
                { data: "start_time"},
                { data: "end_time"},
                
                {
                    data: "advance_reasons",
                    visible: true,
                    render: function(data, type, row, meta) {
                        if (!data || data.length === 0) return "-";
                        
                        let parsed = Array.isArray(data) ? data : JSON.parse(data);
                        
                        let contentHtml = parsed.map(item => `
                            <div class="mb-2">
                                <strong>${item.reason_label}</strong><br>
                                <small>${item.reason_notes}</small><br>
                                <em>${item.action_label}</em><br>
                                <small>${item.action_notes}</small>
                            </div>
                        `).join("");

                        return `
                            <div contenteditable="false" style="height: 100px; overflow-y: auto;">
                                ${contentHtml}
                            </div>
                            <div contenteditable="false" class="mt-1">
                                <button data-bs-toggle="modal" data-bs-target="#reasonEditModal" class="btn btn-sm btn-outline-secondary edit-reason text-primary" 
                                        data-id='${row.id}' data-type='advance'>Edit</button>
                            </div>
                        `;
                    }

                },

                {
                    data: "linestop_reasons",
                    visible: true,
                    render: function(data, type, row, meta) {
                        if (!data || data.length === 0) return "-";
                        
                        let parsed = Array.isArray(data) ? data : JSON.parse(data);
                        
                        let contentHtml = parsed.map(item => `
                            <div class="mb-2">
                                <strong>${item.reason_label}</strong><br>
                                <small>${item.reason_notes}</small><br>
                                <em>${item.action_label}</em><br>
                                <small>${item.action_notes}</small>
                            </div>
                        `).join("");

                        return `
                            <div contenteditable="false" style="height: 100px; overflow-y: auto;">
                                ${contentHtml}
                            </div>
                            <div contenteditable="false" class="mt-1">
                                <button data-bs-toggle="modal" data-bs-target="#reasonEditModal" class="btn btn-sm btn-outline-secondary edit-reason text-primary" 
                                        data-id='${row.id}' data-type='advance'>Edit</button>
                            </div>
                        `;
                    }
                },

                { data: "creator", visible: false},
                { data: "ended_by", visible: false},
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

    async function setup(poId, date){

        let lastRun = await getLatestRun(poId, date);
        startProductionTime = lastRun.data.start_time;

        let poDetails = await apiCall(`/homs/API/uploading/getPODetails.php?section=${section}&poID=${poId}`, 'GET');
        assignPODetails(poDetails.data);

        assignAreaListValues(poDetails.data.pol_line_name);

        let espList = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&po=${poId}&isAlreadyRunning=false`, 'GET');
        assignESPListValues(espList.data);

        let lineList = await apiCall(`/homs/API/admin/getWorkcenterDetails.php?section=${section}&work_center=${work_center}`, 'GET');
        assignLineListValues(lineList.data);

        await pr1Check(section, poId);


        await getTaktTime();
        computeHourlyPlan();

        checkIfAlreadyStarted(lastRun.data);

        $("#planQuantity").val(lastRun.data.plan_quantity);
        updateVariance();
    }

    async function getLatestRun(poId, date){
        let now = new Date();
        let localDateTime = now.toLocaleString('en-PH', {
            timeZone: 'Asia/Manila'
        });

        let details = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}&date=${date}`, 'GET');
        selectedPOData = details.data;
        
        return details;
    }

    function assignESPListValues(espList) {
        
        const espSelect = $(".espSelect").empty();
        espSelect.append(new Option("Select Actual Quantity Source", "", true, true));

        // Allow user to open the dropdown and select an option
        espSelect.on("change", function () {
            // Disable the first option once user makes a real choice
            $(this).find("option:first").prop("disabled", true);
        });

        espSelect.append(new Option(`${"Manual Input"}`, "0"));

        espList.forEach(({ esp_name, sensor_name, id }) => {
            espSelect.append(new Option(`${esp_name}`, id));
        });
    }

    function assignPODetails(poDetails) {
        $("#po_number p").text(poDetails.prd_order_no);
        $("#material span").text(poDetails.material);
        $("#description span").text(poDetails.description);

        $("#planQuantity").val(poDetails.plan_quantity);
    }

    function assignLineListValues(lineList) {
        const lineSelect = $(".lineSelect").empty();
        lineSelect.append(new Option("Select Line...", "0", true, true));

        // Allow user to open the dropdown and select an option
        lineSelect.on("change", function () {
            // Disable the first option once user makes a real choice
            $(this).find("option:first").prop("disabled", true);
        });

        lineList.reverse().forEach(({ line_name, id }) => {
            lineSelect.append(new Option(`${line_name}`, id));
        });
    }

    function assignAreaListValues(areaList) {
        if(section !== "Printer 1"){
            const areaSelect = $(".areaSelect").empty();
            areaSelect.append(new Option(areaList, areaList, true, true));
        }else{
            const areaSelect = $(".areaSelect").empty();
            let lines = [
                "Line A",
                "Line B",
                "Line C",
                "Line D",
                "Line E",
                "Line F",
                "Line G",
                "Line H",
                "Line I",
                "Line J",
                "Line K",
                "Line L",
                "Line M",
            ];
            
            lines.forEach(element => {
                areaSelect.append(new Option(element, element));
            });
        }
        
    }

    function toTimeObj(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        return now;
    }

    /* COMPUTATION FUNCTIONS */
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

    async function getTaktTime(){
        let taktTimeValue = await apiCall(`/homs/API/admin/getTaktTime.php?material=${selectedPOData.material}`, 'GET');
        $("#taktTime").val(taktTimeValue.data.current_tt_mh);
    }

    function updateVariance(){
        const hourlyPlan = parseInt($("#hourlyPlanQuantity").val());
        const actualQuantity = parseInt($("#actualQuantity").val());
        const target = parseInt($("#target").val());

        $("#variance").val(actualQuantity - target);
    }

    function calculateComplianceRate(){
        let actualQuantity = parseInt($("#actualQuantity").val());
        let target = parseInt($("#target").val());

        let complianceRate = 0;

        complianceRate = actualQuantity / target * 100;

        if(isNaN(complianceRate)){
            complianceRate = 0;
        }

        $("#complianceRate").val(complianceRate.toFixed(2) + "%");
    }

    function calculateComplianceRateWithValues(actualQuantity, target){
        
        let complianceRate = 0;

        complianceRate = actualQuantity / target * 100;

        if(isNaN(complianceRate)){
            complianceRate = 0;
        }

        return complianceRate.toFixed(2);
    }

    function calculateVariancePercent(plan, actual) {
    if (plan === 0) {
        // Avoid dividing by zero, duh!
        return 0;
    }

        const variance = ((actual - plan) / plan) * 100;
        return parseFloat(variance.toFixed(2)); // Keep it pretty
    }

    function setTarget(){
        const taktTime = parseFloat($("#taktTime").val()); // minutes per unit, use parseFloat for decimals
        const hourlyPlan = parseInt($("#hourlyPlanQuantity").val()); // units per hour

        let baseStartTime = startTime.selectedDates[0];

        if (!baseStartTime) {
            
            console.warn("No start time found from Flatpickr's selectedDates. Using current time as fallback.");
            baseStartTime = new Date(); // Fallback to current time
        }
        
        if (isNaN(baseStartTime.getTime())) { // Check if baseStartTime is an "Invalid Date" object
            console.error("The selected start time is invalid. Please check the time picker.");
            alert("The selected start time is invalid. Please re-select.");
            return;
        }
        if (isNaN(taktTime) || taktTime <= 0) {
            console.error("Invalid Takt Time. Please enter a positive number.");
            alert("Invalid Takt Time. Please enter a positive number.");
            return;
        }
        if (isNaN(hourlyPlan) || hourlyPlan <= 0) {
            console.error("Invalid Hourly Plan. Please enter a positive number.");
            alert("Invalid Hourly Plan. Please enter a positive number.");
            return;
        }

        for (let minute = 1; minute <= 60; minute++) {
            // Calculate the current time by adding 'minute' minutes to the baseStartTime.
            // We use .getTime() to get the numerical milliseconds since epoch, which allows arithmetic.
            const currentTime = new Date(baseStartTime.getTime() + minute * 60 * 1000);

            const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const units = Math.min(Math.floor(minute / taktTime), hourlyPlan);
            console.log(`${timeStr}: ${units} units`);
        }
    }

    function startTaktTimer() {
        stopTaktTimer();

        const taktTime = parseFloat($("#taktTime").val()); // minutes per unit
        const hourlyPlan = parseInt($("#hourlyPlanQuantity").val());

        if (
            isNaN(taktTime) || taktTime <= 0 ||
            isNaN(hourlyPlan) || hourlyPlan <= 0
        ) {
            console.error("Invalid takt time, hourly plan, or current target.");
            return;
        }

        

        const taktMs = taktTime * 60 * 1000;

        const tick = () => {
            producedUnits = parseInt($("#target").val()) || 0;
            $("#target").val(producedUnits).trigger("input");

            if (producedUnits >= hourlyPlan) {
                console.log("✅ Hourly plan completed!");
                return;
            }

            producedUnits++;
            const now = new Date();
            console.log(`🎯 Unit ${producedUnits} at ${now.toLocaleTimeString()}`);
            $("#target").val(producedUnits).trigger("input");

            taktTimer = setTimeout(tick, taktMs); // next tick
        };

        taktTimer = setTimeout(tick, taktMs);
    }

    function stopTaktTimer() {
        clearTimeout(taktTimer);
        taktTimer = null;
        console.log("🛑 Takt timer stopped.");
    }
    /* END OF COMPUTATION FUNCTIONS */

    /* REASONS */
    function addReasonRow(containerID, isEdit = false, data = {}) {
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

        let componentStringEdit = `
            <div class="edit-reason-action-row d-flex gap-2 text-center w-100">
                <div class="d-flex flex-column gap-2 text-start w-100">
                    <select class="edit-dynamic-select2-advance-reasons w-100" name="state">
                        <option value="${data?.reason_id || ''}" selected>${data?.reason_label || ''}</option>
                    </select>
                    <textarea class="advanceCause secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks...">${data?.reason_notes || ''}</textarea>
                </div>
                <div class="d-flex flex-column gap-2 text-start w-100">
                    <select class="edit-dynamic-select2-advance-actions w-100" name="state">
                        <option value="${data?.action_id || ''}" selected>${data?.action_label || ''}</option>
                    </select>
                    <textarea class="advanceAction secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks...">${data?.action_notes || ''}</textarea>
                </div>
                <div class="d-flex flex-column gap-2 justify-content-between">
                    <button type="button" class="edit-advanceRemoveLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 danger glow">
                        <img src="/homs/resources/icons/delete.svg" alt="remove_layer">
                    </button>
                    <button type="button" class="edit-advanceAddLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 glow">
                        <img src="/homs/resources/icons/add.svg" alt="add_layer">
                    </button>
                </div>
            </div>
        `;


        /* If isEdit is true, append to edit container */


        /* $("#advance-container").append(componentString); */
        $(containerID).append(isEdit ? componentStringEdit : componentString);


        if (isEdit){ 
            initAllDynamicSelect2sAdvanceReasons('.edit-dynamic-select2-advance-reasons', $('#reasonEditModal'));
            initAllDynamicSelect2sAdvanceActions('.edit-dynamic-select2-advance-actions', $('#reasonEditModal'));
        }
        else{ 
            initAllDynamicSelect2sAdvanceReasons('.dynamic-select2-advance-reasons', $('#stopProductionModal'));
            initAllDynamicSelect2sAdvanceActions('.dynamic-select2-advance-actions', $('#stopProductionModal'));
        }
        
    }

    function addLinestopReasonRow(containerID, isEdit = false, data = {}) {
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

        let componentStringEdit = `
            <div class="edit-linestop-reason-action-row d-flex gap-2 text-center w-100">
                <div class="d-flex flex-column gap-2 text-start w-100">
                    <select class="edit-dynamic-select2-linestop-reasons w-100" name="state">
                        <option value="${data.reason_id || ''}" selected>${data.reason_label || ''}</option>
                    </select>
                    <textarea class="linestopCause secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks...">${data.reason_notes || ''}</textarea>
                </div>
                <div class="d-flex flex-column gap-2 text-start w-100">
                    <select class="edit-dynamic-select2-linestop-actions w-100" name="state">
                        <option value="${data.action_id || ''}" selected>${data.action_label || ''}</option>
                    </select>
                    <textarea class="linestopAction secondary-background p-1 form-control border-0 rounded-3 fw-medium tertiary-text glow" placeholder="Input Remarks...">${data.action_notes || ''}</textarea>
                </div>
                <div class="d-flex flex-column gap-2 justify-content-between">
                    <button type="button" class="edit-linestopRemoveLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 danger glow">
                        <img src="/homs/resources/icons/delete.svg" alt="remove_layer">
                    </button>
                    <button type="button" class="edit-linestopAddLayer btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary d-flex justify-content-center align-items-center p-1 glow">
                        <img src="/homs/resources/icons/add.svg" alt="add_layer">
                    </button>
                </div>
            </div>
        `;

        /* $("#linestop-container").append(componentString); */
        $(containerID).append(isEdit ? componentStringEdit : componentString);

        if(isEdit){
            initAllDynamicSelect2sLinestopReasons('.edit-dynamic-select2-linestop-reasons', $('#reasonEditModal'));
            initAllDynamicSelect2sLinestopActions('.edit-dynamic-select2-linestop-actions', $('#reasonEditModal'));
        }else{
            initAllDynamicSelect2sLinestopReasons('.dynamic-select2-linestop-reasons', $('#stopProductionModal'));
            initAllDynamicSelect2sLinestopActions('.dynamic-select2-linestop-actions', $('#stopProductionModal'));
        }
    }

    function initAllDynamicSelect2sAdvanceReasons(elementID, parent) {
        $(elementID + ':not(.select2-hidden-accessible)').select2({
            placeholder: "Select Reason...",
            allowClear: true,
            dropdownParent: parent, // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                data: function (params) {
                    return {
                        search: params.term || '', // search term
                    }
                },
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

    function initAllDynamicSelect2sAdvanceActions(elementID, parent) {
        $(elementID + ':not(.select2-hidden-accessible)').select2({
            placeholder: "Select Action...",
            allowClear: true,
            dropdownParent: parent, // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                data: function (params) {
                    return {
                        search: params.term || '', // search term
                    }
                },
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

    function initAllDynamicSelect2sLinestopReasons(elementID, parent) {
        $(elementID + ':not(.select2-hidden-accessible)').select2({
            placeholder: "Select Reason...",
            allowClear: true,
            dropdownParent: parent, // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                data: function (params) {
                    return {
                        search: params.term || '', // search term
                    }
                },
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

    function initAllDynamicSelect2sLinestopActions(elementID, parent) {
        $(elementID + ':not(.select2-hidden-accessible)').select2({
            placeholder: "Select Action...",
            allowClear: true,
            dropdownParent: parent, // adjust as needed
            ajax: {
                url: '/homs/API/admin/getReasons.php',
                dataType: 'json',
                data: function (params) {
                    return {
                        search: params.term || '', // search term
                    }
                },
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

    function updateAddButtons(isEdit = false) {
        if (!isEdit) {
            $(".advanceAddLayer").hide().removeClass("d-flex");
            $(".advanceAddLayer").last().show().addClass("d-flex");
        }else {
            $(".edit-advanceAddLayer").hide().removeClass("d-flex");
            $(".edit-advanceAddLayer").last().show().addClass("d-flex");
        }
    }

    function updateLinestopAddButtons(isEdit = false) {
        if (!isEdit) {
            $(".linestopAddLayer").hide().removeClass("d-flex");
            $(".linestopAddLayer").last().show().addClass("d-flex");
        }else {
            $(".edit-linestopAddLayer").hide().removeClass("d-flex");
            $(".edit-linestopAddLayer").last().show().addClass("d-flex");
        }
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

    function clearAllAdvanceRows(isEdit = false) {
        if (!isEdit) {
            $("#advance-container").empty(); // remove all rows
            addReasonRow("#advance-container"); // add one fresh default row

            $("#linestop-container").empty(); // remove all rows
            addLinestopReasonRow("#linestop-container"); // add one fresh default row
        } 
        else {
            $("#edit-advance-container").empty(); // remove all rows
            addReasonRow("#edit-advance-container", true); // add one fresh default row

            $("#edit-linestop-container").empty();
            addLinestopReasonRow("#edit-linestop-container", true); // add one fresh default row
        }
        
    }
    /* END OF REASONS FUNCTIONS */

    function resetFields(){

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

    function checkIfAlreadyStarted(lastRunData) {
        if (lastRunData.production_action === "start") {
            
            $(".startProduction").hide();
            $(".stopProduction").show();

            $(".po-button-modal").hide();

            const espSelect = $(".espSelect").empty();
            espSelect.append(new Option(`${lastRunData.esp_name}`, lastRunData.esp_id));

            var option = $(".lineSelect option").filter(function() {
                return $(this).text().trim() === lastRunData.line_name;
            });
            
            $(".lineSelect").val(option.val()).trigger("change");
            $(".areaSelect").val(lastRunData.area).trigger("change");
            $(".shiftSelect").val(lastRunData.shift).trigger("change");

            $(".espSelect").attr("disabled", true);
            $(".lineSelect").attr("disabled", true);
            $(".areaSelect").attr("disabled", true);
            $(".shiftSelect").attr("disabled", true);

            $("#target").val(lastRunData.target);

            $(".countInputs").show();

            isAlreadyRunning = true;

            startTaktTimer();

            /* REALTIME UPDATES IF ESP IS SELECTED */
            if(lastRunData.esp_id != 0){
                realTimeUpdateOfPODetails(lastRunData.po_id, lastRunData.production_record_time_created);
            }

        }else{
            $(".startProduction").show();
            $(".stopProduction").hide();

            $(".po-button-modal").show();

            $(".espSelect").attr("disabled", false);
            $(".lineSelect").attr("disabled", false);
            $(".areaSelect").attr("disabled", false);
            $(".shiftSelect").attr("disabled", false);
        }
    }

    function startSyncingFlatpickrToNow(fpInstance) {
        if (timeSyncInterval) clearInterval(timeSyncInterval);

        timeSyncInterval = setInterval(() => {
            const now = new Date();
            const formatted = formatTimeToFlatpickrString(now);
            fpInstance.setDate(now, false); // Update internal date (no change trigger)
            fpInstance.input.value = formatted; // Update visible text directly
        }, 1000);
    }

    function formatTimeToFlatpickrString(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        if (hours === 0) hours = 12;

        const pad = (n) => n.toString().padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    }

    async function watchEdit(cell, table, oldRowData) {
        const row = table.row(cell.closest('tr'));
        const newRowData = row.data();
        const colIndex = table.cell(cell).index().column;
        const colName = table.settings()[0].aoColumns[colIndex].data;
        const newValue = $(cell).text().trim();

        const oldValueStr = (oldRowData[colName] ?? '').toString().trim();
        const newValueStr = newValue.toString().trim();

        
        const excludedColumns = ["advance_reasons", "linestop_reasons"];
        if (excludedColumns.includes(colName)) {
            console.log(`Change ignored for column: ${colName}`);
            return; // early exit
        }

        const changedFields = [];


        if (oldValueStr !== newValueStr) {
            changedFields.push({
                column: colName,
                oldValue: oldValueStr,
                newValue: newValueStr
            });

            newRowData[colName] = newValue;

            // Target recalculation
            if (colName === "start_time" || colName === "end_time") {
                const taktTime = parseFloat($("#taktTime").val());
                const hourlyPlan = parseInt($("#hourlyPlanQuantity").val());

                const computedTarget = computeTargetBasedOnTime(
                    newRowData["start_time"],
                    newRowData["end_time"],
                    taktTime,
                    hourlyPlan
                );

                newRowData["target"] = computedTarget;

                // Optional: Update variance if actual_quantity exists
                if (!isNaN(parseInt(newRowData["actual_quantity"]))) {
                    newRowData["variance"] = parseInt(newRowData["actual_quantity"]) - (parseInt(newRowData["target"]) || 0);

                    newRowData["commulative_plan"] = Math.abs((parseInt(oldRowData["target"]) - (parseInt(newRowData["target"]) || 0) ) - parseInt(newRowData["commulative_plan"]));

                    newRowData["compliance_rate"] = calculateComplianceRateWithValues(parseInt(newRowData["actual_quantity"]), parseInt(newRowData["target"]));
                }
            }

                // Variance calculation if hourly_plan or actual_quantity edited
            if (colName === "hourly_plan" || colName === "actual_quantity") {
                newRowData["variance"] = parseInt(newRowData["actual_quantity"]) - (parseInt(newRowData["target"]) || 0);

                newRowData["commulative_plan"] = Math.abs((parseInt(oldRowData["target"]) - (parseInt(newRowData["target"]) || 0) ) - parseInt(newRowData["commulative_plan"]));

                newRowData["compliance_rate"] = calculateComplianceRateWithValues(parseInt(newRowData["actual_quantity"]), parseInt(newRowData["target"]));
            }

            // Defensively parse JSON fields
            const parseSafe = (val) => {
                try {
                    return typeof val === "string" ? JSON.parse(val) : val;
                } catch (e) {
                    console.warn("JSON parse failed:", val);
                    return [];
                }
            };

            const updatedData = {
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
                "advance_reasons": parseSafe(newRowData["advance_reasons"]),
                "linestop_reasons": parseSafe(newRowData["linestop_reasons"]),
                "creator": userId,

                "esp_id": newRowData["esp_id"],
                "hourly_plan": newRowData["hourly_plan"],
                "target": newRowData["target"],

                "compliance_rate": (newRowData["compliance_rate"] || "").replace('%', ''),

                "commulative_plan": newRowData["commulative_plan"],
                "commulative_actual": newRowData["commulative_actual"],
            };

            // Update DataTable row once at the end
            row.data(newRowData).invalidate();

            // Submit edit history
            const data = { creator: userId, old_data: oldRowData, new_data: newRowData };
            await apiCall('/homs/API/production/submitEditHistory.php', 'POST', data);

            // Update the backend record
            await apiCall('/homs/API/production/updateProductionRecord.php', 'POST', updatedData);

            console.log('Row edited:', { oldRowData, newRowData, changedFields });

            showToast();
        } else {
            console.log("No changes detected in this row");
        }
    }

    async function realTimeUpdateOfPODetails(poId, date) {
        console.log("Realtime update of PO details");

        // Clear any existing interval first (important!)
        if (poDetailsInterval) {
            clearInterval(poDetailsInterval);
            poDetailsInterval = null;
        }

        const response = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}&date=${date}`, 'GET');
        const data = response.data;

        if (data) {
            computeHourlyPlan();
            //updateActualQuantity(data.actual_quantity);
        }

        //HIDE MANUAL ACTUAL
        $("#esp-output-conainer").show();
        $("#actual-quantity-container").hide();

        //ADD DYNAMIC INPUTS BASED ON THE NUMBER OF ESP SENSORS
        let espDetails = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&isAlreadyRunning=true&po_id=${poId}`, 'GET');
        //console.table(espDetails.data);

        $("#esp-outputs").empty();
        espDetails.data.forEach(element => {
            let jsonQuantity = JSON.parse(data.actual_quantity);
            //console.log(jsonQuantity[element.esp_name + " - " + element.sensor_name]);
            let actualQty = jsonQuantity[element.esp_name + " - " + element.sensor_name] || 0;

            //add to esp-outputs div
            let espOutput = `
            <div>
                <label class="section-details-label">${element.sensor_name}</label>
                <input 
                    type="number" 
                    id="${element.esp_name}_${element.sensor_name}" 
                    class="esp-inputs plan-detail-textbox secondary-background p-1 form-control border-0 rounded-3 fw-medium text-primary glow" 
                    placeholder="" 
                    value="${actualQty}">
            </div>
            `;
            $("#esp-outputs").append(espOutput);
            
        });

        if ($(".espSelect").val() != 0) {
            poDetailsInterval = setInterval(async () => {
                const response = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}&date=${date}`, 'GET');
                const data = response.data;

                let jsonQuantity = JSON.parse(data.actual_quantity);
                
                let espDetails = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&isAlreadyRunning=true&po_id=${poId}`, 'GET');

                if (data) {
                    computeHourlyPlan();
                    let sum = 0;
                    espDetails.data.forEach(element => {
                        let actualQty = jsonQuantity[element.esp_name + " - " + element.sensor_name] || 0;
                        updateActualQuantity(element.esp_name + "_" + element.sensor_name, actualQty);

                        sum += actualQty;
                    });

                    $(`#actualQuantity`).val(sum).trigger("input");
                }
            }, 3000);
        }
    }

    function stopRealTimePODetails() {
    if (poDetailsInterval) {
        clearInterval(poDetailsInterval);
        poDetailsInterval = null;
        console.log("⏹️ Real-time PO detail updates stopped.");
    }
    }

    function updateActualQuantity(id, quantity) {

        
        $(`#${id}`).val(quantity).trigger("input");
    }

    async function getGlobalSettings() {
        const result = await apiCall('/homs/api/admin/getGlobalSettings.php', 'GET');
        if (result['status'] === 'error') {
            alert(result['message']);
            return;
        }
        return result;
    }

    async function startFeatureChecks() {

        setInterval(async() => {
            globalSettings = await getGlobalSettings();
            /* console.table(globalSettings.data[0].settings.hourlyUpdates.sections); */

            /* START HOURLY UPDATE CHECK */
            await hourlyUpdatesCheck();

            /* LINE STOP NOTIFICATION */
            await lineStopCheck();
        }, 1000);
    }

    function stopFeatureChecks() {
        if (featureChecksInterval) {
            clearInterval(featureChecksInterval);
            featureChecksInterval = null;
        }
    }

    async function hourlyUpdatesCheck() {
        let isHourlyUpdateEnabledForSection = globalSettings.data[0].settings.hourlyUpdates.sections[section];

        if (isHourlyUpdateEnabledForSection) {
            // 👇 just use it directly
            if (hasMinutesPassed(startProductionTime, 60)) {
                console.log("Start Production Time has passed 1 hour, starting hourly updates");

                if (isAlreadyRunning) {
                    await stopProduction();
                }
            }
        }
    }


    function hasMinutesPassed(startTime, minutesThreshold) {
        let now = new Date();
        let start = new Date(startTime);

        let diffMs = now - start;
        let diffMinutes = diffMs / (1000 * 60);

        return diffMinutes >= minutesThreshold;
    }

    function hasSecondsPassed(startTimeString, secondsThreshold) {
        let now = new Date();
        let start = new Date(startTimeString); // this works directly now!

        if (isNaN(start.getTime())) {
            console.error("Invalid start time:", startTimeString);
            return false;
        }

        let diffMs = now - start;
        let diffSeconds = diffMs / 1000;

        return diffSeconds >= secondsThreshold;
    }

    async function stopProduction(){
        $("#endTime").val(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
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
    
        // Loop through the hourly time object and find the matching shift
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
        let planQuantity = parseInt($("#hourlyPlanQuantity").val());
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
        // if (
        //     Math.abs(variancePercent) >= 10 &&
        //     (advanceReasonCheck.length === 0 || linestopReasonCheck.length === 0)
        // ) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Error",
        //         text: "Variance is more than 10% of plan quantity. Please select a reason.",
        //     });
        //     return;
        // }

        /* COLLECT DATA */

        let advanceReason = [
            {
                "action_id": 89,
                "reason_id": 90,
                "action_label": "NO UPDATE",
                "action_notes": "Forgot to stop production",
                "reason_label": "",
                "reason_notes": ""
            }
        ];
        let linestopReason = [
            {
                "action_id": 91,
                "reason_id": 92,
                "action_label": "NO UPDATE",
                "action_notes": "Forgot to stop production",
                "reason_label": "",
                "reason_notes": ""
            }
        ];

        // if($("#espSelect").val() == 0){
        //     alert("Please select ESP Sensor");
        // }else{
        //     alert("esp selected");
        // }
        
        // return;

        let data = {
            "production_action": "end",
            "po_id": selectedPOData.po_id, 
            "po": selectedPOData.prd_order_no, 
            "section": section,
            "work_center": work_center,
            "line_name": $(".lineSelect option:selected").text(),
            "area":$(".areaSelect option:selected").text(),
            "material": selectedPOData.material,
            "description": selectedPOData.description,
            "plan_quantity": $("#planQuantity").val(),
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

            "hourly_plan": $("#hourlyPlanQuantity").val(),
            "target": $("#target").val(),
            "compliance_rate": $("#complianceRate").val().replace('%', ''),
            "esp_id": $(".espSelect").val(),

            "islinestop": true
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

                stopRealTimePODetails();
                stopTaktTimer();

                $(".startProduction").show();
                $(".stopProduction").hide();

                /* RESET FIELDS */
                $(".espSelect").attr("disabled", false);
                $(".lineSelect").attr("disabled", false);
                $(".areaSelect").attr("disabled", false);
                $(".shiftSelect").attr("disabled", false);

                $(".po-button-modal").show();

                let espList = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&po=${selectedPOData.po_id}&isAlreadyRunning=false`, 'GET');
                assignESPListValues(espList.data);
                $(".espSelect").val("").trigger("change");
                $(".lineSelect").val("").trigger("change");
                $(".shiftSelect").val("Shift").trigger("change");
                
                $("#hourlyPlanQuantity").val(0);
                $("#target").val(0);
                $("#actualQuantity").val(0);
                $("#complianceRate").val(0);
                $("#variance").val(0);

                computeHourlyPlan();
                setTarget();
                updateVariance();
                calculateComplianceRate();

                /* $(".countInputs").hide(); */

                $("#esp-output-conainer").hide();

                table.ajax.reload(null, false);
            });
        });
        clearAllAdvanceRows();
        isAlreadyRunning = false;
    }

    async function showEditAdvanceReason(rowID){
        const reasons = await apiCall(`/homs/API/production/getAdvanceReasons.php?row_id=${rowID}`, 'GET');
        /* console.table(advanceReason.data); */

        reasons.data.advance_reasons.forEach(element => {
            addReasonRow("#edit-advance-container", true, element);
        });

        reasons.data.linestop_reasons.forEach(element => {
            addLinestopReasonRow("#edit-linestop-container", true, element);
        });
    }

    function computeTargetBasedOnTime(start_time_str, end_time_str, taktTime, hourlyPlan) {
        const startTime = new Date(start_time_str);
        const endTime = new Date(end_time_str);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            console.error("Invalid start or end time.");
            return 0;
        }

        if (isNaN(taktTime) || taktTime <= 0 || isNaN(hourlyPlan) || hourlyPlan <= 0) {
            console.error("Invalid taktTime or hourlyPlan");
            return 0;
        }

        const durationInMinutes = (endTime - startTime) / 1000 / 60;
        if (durationInMinutes <= 0) {
            console.warn("Duration is zero or negative.");
            return 0;
        }

        const units = Math.min(Math.floor(durationInMinutes / taktTime), hourlyPlan);
        return units;
    }

    function hideInputsWhenPastDatesAreSelected(){
        
    }

    function collectEditAdvanceReasonData() {
        const result = [];

        $(".edit-reason-action-row").each(function () {
            const row = $(this);

            const reason = row.find(".edit-dynamic-select2-advance-reasons").val(); // ID of selected reason
            const reasonText = row.find(".edit-dynamic-select2-advance-reasons option:selected").text();
            const reasonNotes = row.find("textarea.advanceCause").val();

            const action = row.find(".edit-dynamic-select2-advance-actions").val(); // ID of selected action
            const actionText = row.find(".edit-dynamic-select2-advance-actions option:selected").text();
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

    function collectEditLinestopReasonData() {
        const result = [];

        $(".edit-linestop-reason-action-row").each(function () {
            const row = $(this);

            const reason = row.find(".edit-dynamic-select2-linestop-reasons").val(); // ID of selected reason
            const reasonText = row.find(".edit-dynamic-select2-linestop-reasons option:selected").text();
            const reasonNotes = row.find("textarea.linestopCause").val();

            const action = row.find(".edit-dynamic-select2-linestop-actions").val(); // ID of selected action
            const actionText = row.find(".edit-dynamic-select2-linestop-actions option:selected").text();
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

    function editSave(){
        let advanceReason = collectEditAdvanceReasonData();
        let linestopReason = collectEditLinestopReasonData();
        let id = $(".editSave").data("id");
        /* console.log("Advance Reasons:", advanceReason);
        console.log("Linestop Reasons:", linestopReason); */

        const data = {
            id: id,
            advance_reasons: advanceReason,
            linestop_reasons: linestopReason,
            creator: userId
        };

        const response = apiCall('/homs/API/production/editReasons.php', 'POST', data);
        response.then((result) => {
            if (result.status === "success") {
                showToast();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error'
                });
            }
        }).catch((error) => {
            console.error("Error saving changes:", error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while saving changes.',
                icon: 'error'
            });
        });
        console.log(response);
    }

    function showToast(){
        const toast = new bootstrap.Toast(toastWatchEdit);
        toast.show();
    }

    async function lineStopCheck() {
        
    }

    async function pr1Check(section, poID) {
        let new_work_center = await apiCall(`/homs/API/uploading/getPODetails.php?section=${section}&poID=${poID}`, 'GET').then(response => {
            return response.data.work_center;
        });
        if(section === "Printer 1") {
            localStorage.setItem('wc', new_work_center);
            work_center = new_work_center;
            $("#wcName").text(new_work_center);
        }
    }

    function taktTimeToSeconds(taktTime) {
        // Convert string to number
        let hours = parseFloat(taktTime);
        if (isNaN(hours)) {
            alert("Invalid takt time value!");
            return;
        }

        // 1 hour = 3600 seconds
        let taktTimeSeconds = hours * 3600;

        // Show result
        $("#taktTimeSeconds").val(taktTimeSeconds.toFixed(2));
        $("#taktTimeDisplay").text(taktTimeSeconds.toFixed(2) + " seconds");
    }



});