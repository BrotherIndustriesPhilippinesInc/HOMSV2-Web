import appendParameterToURL from "../appendParameterToUrl.js";
import redirect from "../redirect.js";
import apiCall from "../apiCall.js";
import { search, formatTimeOnlyToPostgres, switchModals } from "../helperFunctions.js";
import dataTablesInitialization from "../dataTablesInitialization.js";

$(function () {

    /* INITIALIZATION */
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');

    let timeSyncInterval = null;
    let oldRowData = null;
    let poDetailsInterval = null;

    const startTime = flatpickr("#startTime", {
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
            console.log("Flatpickr for #startTime is ready. Selected dates:", selectedDates);
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

    getPOList();
    popoverInitialize();

    addReasonRow();
    addLinestopReasonRow();

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

        /* HIDE UNNECESSARY DATAS */
        $(".stopProduction").hide();
        $(".countInputs").hide();

        $.when(
            await setup(poId),
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
                $("#startTime").val(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                $(".shiftSelect").val(selectedShift);

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
                    "plan_quantity": selectedPOData.plan_quantity,
                    "takt_time": $("#taktTime").val(),
                    "actual_quantity": $("#actualQuantity").val().trim() === "" ? 0 : Number($("#actualQuantity").val()),
                    "variance": $("#variance").val().trim() === "" ? 0 : Number($("#variance").val()),
                    "shift": $(".shiftSelect").val(),
                    "direct_operators": $("#directOperations").val(),
                    "start_time": formatTimeOnlyToPostgres(startTime.input.value),
                    "end_time": null,
                    "creator": userId,

                    "esp_id": $(".espSelect").val(),
                    "hourly_plan": $("#hourlyPlanQuantity").val(),
                    "target": $("#target").val(),
                    "compliance_rate": $("#complianceRate").val().replace('%', ''),
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
                            realTimeUpdateOfPODetails(selectedPOData.po_id);
                        }
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
        let advanceReason = JSON.stringify(collectAdvanceReasonData());
        let linestopReason = JSON.stringify(collectLinestopReasonData());

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

            "hourly_plan": $("#hourlyPlanQuantity").val(),
            "target": $("#target").val(),
            "compliance_rate": $("#complianceRate").val().replace('%', ''),
            "esp_id": $(".espSelect").val()
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
                { data: "target", visible: true},
                { data: "actual_quantity"},
                { data: "compliance_rate", visible: true},
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

    async function setup(poId){

        let lastRun = await getLatestRun(poId);

        let poDetails = await apiCall(`/homs/API/uploading/getPODetails.php?section=${section}&poID=${poId}`, 'GET');
        assignPODetails(poDetails.data);

        assignAreaListValues(poDetails.data.pol_line_name);

        let espList = await apiCall(`/homs/API/admin/getESPSBySection.php?section=${section}&po=${poId}&isAlreadyRunning=false`, 'GET');
        assignESPListValues(espList.data);

        let lineList = await apiCall(`/homs/API/admin/getWorkcenterDetails.php?section=${section}&work_center=${work_center}`, 'GET');
        assignLineListValues(lineList.data);

        await getTaktTime();
        computeHourlyPlan();

        checkIfAlreadyStarted(lastRun.data);

        updateVariance();
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
            espSelect.append(new Option(`${esp_name} - ${sensor_name}`, id));
        });
    }

    function assignPODetails(poDetails) {
        $("#po_number span").text(poDetails.prd_order_no);
        $("#material span").text(poDetails.material);
        $("#description span").text(poDetails.description);

        $("#planQuantity").val(poDetails.plan_quantity);
    }

    function assignLineListValues(lineList) {
        const lineSelect = $(".lineSelect").empty();
        lineSelect.append(new Option("Select Line...", "", true, true));

        // Allow user to open the dropdown and select an option
        lineSelect.on("change", function () {
            // Disable the first option once user makes a real choice
            $(this).find("option:first").prop("disabled", true);
        });

        lineList.forEach(({ line_name, id }) => {
            lineSelect.append(new Option(`${line_name}`, id));
        });
    }

    function assignAreaListValues(areaList) {
        const areaSelect = $(".areaSelect").empty();
        areaSelect.append(new Option(areaList, areaList, true, true));
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

    function initAllDynamicSelect2sAdvanceReasons() {
        $('.dynamic-select2-advance-reasons:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Reason...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
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

    function initAllDynamicSelect2sAdvanceActions() {
        $('.dynamic-select2-advance-actions:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Action...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
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

    function initAllDynamicSelect2sLinestopReasons() {
        $('.dynamic-select2-linestop-reasons:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Reason...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
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

    function initAllDynamicSelect2sLinestopActions() {
        $('.dynamic-select2-linestop-actions:not(.select2-hidden-accessible)').select2({
            placeholder: "Select Action...",
            allowClear: true,
            dropdownParent: $('#stopProductionModal'), // adjust as needed
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

    function updateAddButtons() {
        $(".advanceAddLayer").hide().removeClass("d-flex");
        $(".advanceAddLayer").last().show().addClass("d-flex");
    }

    function updateLinestopAddButtons() {
        $(".linestopAddLayer").hide().removeClass("d-flex");
        $(".linestopAddLayer").last().show().addClass("d-flex");
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

    function clearAllAdvanceRows() {
        $("#advance-container").empty(); // remove all rows
        addReasonRow(); // add one fresh default row

        $("#linestop-container").empty(); // remove all rows
        addLinestopReasonRow(); // add one fresh default row
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
            espSelect.append(new Option(`${lastRunData.esp_name} - ${lastRunData.esp_sensor_name}`, lastRunData.esp_id));

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

            startTaktTimer();

            /* REALTIME UPDATES IF ESP IS SELECTED */
            if(lastRunData.esp_id != 0){
                realTimeUpdateOfPODetails(lastRunData.po_id);
            }
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
            if(changedFields[0]["column"] == "hourly_plan" || changedFields[0]["column"] == "actual_quantity"){

                newRowData["variance"] = parseInt(newRowData["actual_quantity"]) - newRowData["hourly_plan"];
                
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

                "esp_id": newRowData["esp_id"],
                "hourly_plan": newRowData["hourly_plan"],
                "target": newRowData["target"],

            };

            await apiCall('/homs/API/production/updateProductionRecord.php', 'POST', updatedData)
            .then((response) => {
                /* console.log(response); */
            });

        } else {
            console.log("No changes detected in this row");
        }
    }

    async function realTimeUpdateOfPODetails(poId) {
        console.log("Realtime update of PO details");

        // Clear any existing interval first (important!)
        if (poDetailsInterval) {
            clearInterval(poDetailsInterval);
            poDetailsInterval = null;
        }

        const response = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}`, 'GET');
        const data = response.data;

        if (data) {
            computeHourlyPlan();
            updateActualQuantity(data.actual_quantity);
        }

        if ($(".espSelect").val() != 0) {
            poDetailsInterval = setInterval(async () => {
                const response = await apiCall(`/homs/API/production/getLastRunning.php?section=${section}&work_center=${work_center}&po=${poId}`, 'GET');
                const data = response.data;

                if (data) {
                    computeHourlyPlan();
                    updateActualQuantity(data.actual_quantity);
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

    function updateActualQuantity(quantity) {
        $("#actualQuantity").val(quantity).trigger("input");
    }

});