import appendParameterToURL from "./../appendParameterToUrl.js";
import redirect from "./../redirect.js";
import apiCall from "./../apiCall.js";
import { search, formatTimeOnlyToPostgres, switchModals } from "../helperFunctions.js";

$(function () {
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');

    let selectedPOData = {};

    /* PAGE INITIALIZATION */
    getPOList();
    getReasons();
    $(".stopProduction").hide();
    $(".popover-trigger").hide();
    getLatestRun();

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
        $(".initial").addClass("d-flex");
        $(".initial").removeClass("initial")

        const poId = $(this).data("po-id");
        

        let details = await apiCall('/homs/API/uploading/getPODetails.php?section=' + section + '&po=' + poId, 'GET');
        selectedPOData = details.data;

        /* LINE SELECT INITIALIZATION */
        $(".lineSelect").empty();
        $(".lineSelect").append(new Option(details.data.line_name, details.data.line_name));
        $(".lineSelect").val(details.data.line_name).trigger("change");

        /* PLAN QUANTITY INITIALIZATION */
        $("#planQuantity").val(details.data.qty);

        if(details){
            $("#details-container").removeClass("d-none");
            $("#details-container").addClass("d-flex");
        }

        $("#po_number span").text(details.data.prd_order_no);
        $("#material span").text(details.data.material);
        $("#description span").text(details.data.description);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('poModal'));
        if (modal) modal.hide();

        updateVariance();
    });

    $(".startProduction").on("click", function () {
        
        const shift = {
            "ds1": {"from": "06:00", "to": "16:00"},
            "dssp": {"from": "07:00", "to": "17:00"},
            "ds2": {"from": "07:30", "to": "17:30"},
            "ds3": {"from": "09:00", "to": "19:00"},
            "ns1": {"from": "18:00", "to": "04:00"},
            "nssp": {"from": "19:00", "to": "05:00"},
            "ns2": {"from": "19:30", "to": "05:30"},
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
                    "po_id": selectedPOData.id, 
                    "po": selectedPOData.prd_order_no, 
                    "section": section,
                    "work_center": selectedPOData.work_center,
                    "line_name": selectedPOData.line_name,
                    "area": "N/A",
                    "material": selectedPOData.material,
                    "description": selectedPOData.description,
                    "plan_quantity": selectedPOData.qty,
                    "takt_time": 0,
                    "actual_quantity": $("#actualQuantity").val(),
                    "variance": $("#variance").val(),
                    "shift": $(".shiftSelect").val(),
                    "direct_operators": $("#directOperations").val(),
                    "start_time": formatTimeOnlyToPostgres(startTime.input.value),
                    "end_time": null,
                    "creator": userId
                }
                let result = await apiCall('/homs/API/production/insertProductionRecord.php', 'POST', data).then((response) => {
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
                        $(this).hide();
                    });
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
            "po_id": selectedPOData.id, 
            "po": selectedPOData.prd_order_no, 
            "section": section,
            "work_center": selectedPOData.work_center,
            "line_name": selectedPOData.line_name,
            "area": "N/A",
            "material": selectedPOData.material,
            "description": selectedPOData.description,
            "plan_quantity": selectedPOData.qty,
            "takt_time": 0,
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

        let result = await apiCall('/homs/API/production/insertProductionRecord.php', 'POST', data).then((response) => {
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
                $(this).show();

                resetFields();
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
        /* $("#planQuantity").val(""); */
        $("#actualQuantity").val("0");
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

    async function getLatestRun(){
        let now = new Date();
        let date = now.toISOString().split('T')[0];

        let data = await apiCall(`/homs/API/production/getLastRunning.php?date=${date}&section=${section}&work_center=${work_center}`, 'GET');
        console.table(data);
    }
});
