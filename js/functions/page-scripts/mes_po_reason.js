import apiCall from "../apiCall.js";
$(async () => {

    addReasonRow("#advance-container");
    addLinestopReasonRow("#linestop-container");

    $(".save").on("click", async function () {
            
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

        /* COLLECT DATA */
        let advanceReason = collectAdvanceReasonData();
        let linestopReason = collectLinestopReasonData();

        if($("#espSelect").val() == 0){
            console.log("Please select ESP Sensor");
        }else{
            console.log("esp selected");
        }

        var url = new URL(window.location.href);
        var po = url.searchParams.get("po");
        let data = {
            "po" : po,
            "Advance_ReasonsData": advanceReason,
            "Linestop_ReasonsData": linestopReason,
        }

        //client.BaseAddress = new Uri("http://apbiphbpswb01:9876/");
        //client.BaseAddress = new Uri("https://localhost:7046/");
        //api/POStatus/CheckActivityEventStream

        let link = "http://apbiphbpswb01:9876/api/POMESReasons/AddReasons";
        //let link = "https://localhost:7046/api/POMESReasons/AddReasons";

        let result = await apiCall(link, 'POST', data).then((response) => {
            /* CONFIRMATION */
            Swal.fire({
                title: 'Success!',
                text: 'You may now close this window.',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(async () => {
                window.close();
            });
        });

        clearAllAdvanceRows();
    });

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

        /* $("#advance-container").append(componentString); */
        $(containerID).append(isEdit ? componentStringEdit : componentString);

        initAllDynamicSelect2sAdvanceReasons('.dynamic-select2-advance-reasons', $('#stopProductionModalBody'));
        initAllDynamicSelect2sAdvanceActions('.dynamic-select2-advance-actions', $('#stopProductionModalBody'));
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
        
        initAllDynamicSelect2sLinestopReasons('.dynamic-select2-linestop-reasons', $('#stopProductionModalBody'));
        initAllDynamicSelect2sLinestopActions('.dynamic-select2-linestop-actions', $('#stopProductionModalBody'));
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
})