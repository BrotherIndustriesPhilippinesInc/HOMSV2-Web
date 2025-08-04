<?php
    $button = new Buttons();
    $textbox = new Textboxes();
    $dropdown = new Dropdowns();
    $select = new Selects();
    $checkbox = new Checkbox();

    $wcName = $_GET['wc'];

    $search = $textbox->searchTextbox("searchPO");

    $dateSelect = $textbox->timeSelect("dateSelect", "h-100 bg-custom-tertiary text-primary fw-medium ", "");

    $selectPO = $button->primaryButton("po-button-modal", "Select PO", "/homs/resources/icons/shopping_cart.svg", "po_cart", "data-bs-toggle='modal' data-bs-target='#poModal' style='z-index: 99'");
    $selectESP = $select->primarySelect("espSelect", "ESP32", ["Line 1", "Line 2", "Line 3"], "");

    $startProduction = $button->primaryButton("startProduction", "Start Production", "/homs/resources/icons/pallet.svg", "", );

    $stopProduction = $button->primaryButtonAlt("stopProduction", "Stop Production", "fa-regular fa-circle-stop", "data-bs-toggle='modal' data-bs-target='#stopProductionModal'", "danger" );
    //$causeCategories = $button->primaryButton("causeCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#causeModal'", "d-flex align-items-center p-1");

    $addPlan = $button->primaryButton("dprView", "DPR View", "/homs/resources/icons/add.svg", "DPR View");

    $planQuantity = $textbox->primaryTextbox("planQuantity", "plan-detail-textbox secondary-background p-1", "", "0", "number");
    
    $hourlyPlanQuantity = $textbox->primaryTextbox("hourlyPlanQuantity", "plan-detail-textbox secondary-background p-1", "", "0", "number");
    $taktTime = $textbox->primaryTextbox("taktTime", "plan-detail-textbox secondary-background p-1", "0", "0", "number");
    $actualQuantity = $textbox->primaryTextbox("actualQuantity", "plan-detail-textbox secondary-background p-1", "", "0", "number");
    $variance = $textbox->primaryTextbox("variance", "plan-detail-textbox secondary-background p-1", "0", "0", "number");

    $areaSelect = $select->primarySelect("areaSelect", "Area", ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8", "Area 9", "Area 10"], "");
    $lineSelect = $select->primarySelect("lineSelect", "Line / Team", ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8", "Line 9", "Line 10"], "");
    
    $shiftSelect = $select->primarySelect("shiftSelect", "Shift", ["ds"=>"Day Shift", "ns"=>"Night Shift"], "");
    
    $hourlyTime = $select->primarySelect("hourlyTime", "Hourly Time", ["06:00 - 08:00", "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00", "20:00 - 22:00", "22:00 - 24:00"], "");
    $directOperations = $textbox->primaryTextbox("directOperations", "secondary-background p-1 text-center", "", 0);

    $startTime = $textbox->timeSelect("startTime", "", "disabled");
    $endTime = $textbox->timeSelect("endTime", "", "");

    $breaktime = $textbox->primaryTextbox("breaktime", "secondary-background p-1 text-center");
    $changeModel = $textbox->primaryTextbox("changeModel", "secondary-background p-1 text-center");
    $lineStop = $textbox->primaryTextbox("lineStop", "secondary-background p-1 text-center");
    $others = $textbox->primaryTextbox("others", "secondary-background p-1 text-center");

    $advanceCause = $textbox->textArea("advanceCause", "secondary-background p-1");
    $advanceAction = $textbox->textArea("advanceAction", "secondary-background p-1");
    $advanceAddLayer = $button->primaryButton("advanceAddLayer", "", "/homs/resources/icons/add.svg", "add_layer", "", "d-flex justify-content-center align-items-center p-1");
    $advanceRemoveLayer = $button->primaryButton("advanceRemoveLayer", "", "/homs/resources/icons/delete.svg", "remove_layer", "", "d-flex justify-content-center align-items-center p-1 danger");

    $linestopCause = $textbox->textArea("linestopCause", "secondary-background p-1");
    $linestopAction = $textbox->textArea("linestopAction", "secondary-background p-1");

    $advanceCauseCategories = $button->primaryButton("advanceCauseCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#advanceCauseCategoriesModal'", "d-flex align-items-center p-1");
    $advanceActionCategories = $button->primaryButton("advanceActionCategories", "Action Categories", "/homs/resources/icons/list_alt.svg", "action_categories", "data-bs-toggle='modal' data-bs-target='#advanceActionCategoriesModal'", "d-flex align-items-center p-1");
    
    $linestopCauseCategories = $button->primaryButton("linestopCauseCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#linestopCauseCategoriesModal'", "d-flex align-items-center p-1");
    $linestopActionCategories = $button->primaryButton("linestopActionCategories", "Action Categories", "/homs/resources/icons/list_alt.svg", "action_categories", "data-bs-toggle='modal' data-bs-target='#linestopActionCategoriesModal'", "d-flex align-items-center p-1");
    
    $homsView = $button->primaryButton("homsView", "HOMS", "/homs/resources/icons/visibility.svg", "homs_view");
            
    $save = $button->primaryButtonAlt("save", "Stop Production", "fa-regular fa-circle-stop", "data-bs-dismiss='modal'", "danger" );

    $lineStopPopOver = $button->primaryButton("lineStop-popOver", "Line Stop", "/homs/resources/icons/front_hand.svg", "line_stop", "", "w-100 border border-danger text-danger danger");
    $breaktimePopOver = $button->primaryButton("breaktime-popOver", "Breaktime", "/homs/resources/icons/fork_spoon.svg", "breaktime", "", "w-100");

    $complianceRate = $textbox->primaryTextbox("complianceRate", "plan-detail-textbox secondary-background p-1", "0.00%", "0.00%", "text");

    $target = $textbox->primaryTextbox("target", "plan-detail-textbox secondary-background p-1", "0", "0", "number");

    $editSave = $button->primaryButtonAlt("editSave", "Save Changes", "fa-solid fa-floppy-disk", "data-bs-dismiss='modal'", "success");

    $islinestop = $checkbox->primaryCheckbox("islinestop", "linestop", "Is Linestop?");
?>

<title>HOMS - WC Selection</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    
    <div class="d-flex flex-column bg-custom-secondary container-fluid rounded-3 pb-2"> 
        <div class="d-flex align-items-center justify-content-between gap-3 pt-4">

            <div class="d-flex align-items-center gap-2 justify-content-between">
                <div>
                    <h1><?php echo "$wcName"?></h1>
                </div>
            </div>

            <div id="" class="initial initial-setup">
                <div class="d-flex flex-column gap-4"  style="color : #8DCEE3;">
                    <div id="po_number" class="d-flex align-items-center justify-content-center gap-2 align-items-center">
                        <i class="fa-solid fa-paste" style="font-size: 32px; margin-right: 5px; "></i>
                        <p class="fw-bold m-0" style="font-size: 24px; text-decoration: underline" >po_number</p>
                    </div>
                    <div class="d-flex gap-2">
                        <div id="material" class="gap-2 align-items-center">
                            <i class="fa-solid fa-box" style="font-size: 24px; margin-right: 5px;"></i>
                            <span class="fw-bold">material</span>
                        </div>
                        <div id="description" class="gap-2 align-items-center">
                                <i class="fa-solid fa-info" style="font-size: 24px; margin-right: 5px;"></i>
                            <span class="fw-bold">description</span>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <div id="" class="initial initial-setup" >
                <img src="/homs/resources/icons/arrow_back_2.svg" alt="arrow-popover-trigger" class="popover-trigger"
                    data-bs-toggle="popover" 
                    data-bs-placement="left"
                    data-bs-html="true"
                />
            </div>
        </div>

        <div class="h-100 d-flex justify-content-between gap-3">
            <div class="w-100 d-flex flex-column gap-2">
                <!-- CONTROLS -->
                <div class=" d-flex justify-content-between w-100 pt-2">
                    <div class="d-flex gap-2">
                        <div class="d-flex align-items-center">
                            <?php
                                echo $dateSelect; 
                            ?>
                        </div>
                        <div>
                            <?php
                                echo $selectPO; 
                            ?>
                        </div>
                        <div class="initial initial-setup">
                            <?php
                                echo $selectESP;
                            ?>
                        </div>
                    </div>
                    
                    <div class="initial initial-setup gap-2">
                        <div>
                            <?php 
                                echo $startProduction;
                            ?>
                        </div>

                        <div>
                            <?php 
                                echo $stopProduction;
                            ?>
                        </div>
                        
                    </div>
                </div>

                <!-- SECTION DETAILS -->
                <div id="" class="initial initial-setup content-group p-2 rounded-3 flex-column gap-2">
                    <div class="d-flex justify-content-between">
                        <h5>Section Details</h5>
                        <div class="d-flex gap-2">
                            
                            <div>
                                <?php
                                    echo $lineSelect;
                                ?>
                            </div>

                            <div>
                                <?php
                                    echo $areaSelect;
                                ?>
                            </div>

                            <div>
                                <?php
                                    echo $shiftSelect;
                                ?>
                            </div>
                            <div class="d-none">
                                <?php 
                                    echo $hourlyTime
                                ?>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        
                        <div class="d-flex align-items-center">
                            <span class="section-details-label">Direct Operators</span>
                            <?php 
                                echo $directOperations
                            ?>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="section-details-label">Time</span>
                            <?php 
                                echo $startTime
                            ?>
                        </div>
                        <div class="d-none align-items-center">
                            <span class="section-details-label">End Time</span>
                            <?php 
                                echo $endTime
                            ?>
                        </div>

                    </div>
                </div>

                <!-- STOPS -->
                <div class="d-none content-group p-2 rounded-3">
                    <h5>Stops (Minutes)</h5>
                    <div class="d-flex gap-2">
                        <div>
                            <span class="section-details-label">Breaktime</span>
                            <?php 
                                echo $breaktime
                            ?>
                        </div>
                        <div>
                            <span class="section-details-label">Change Model</span>
                            <?php 
                                echo $changeModel
                            ?>
                        </div>
                        <div>
                            <span class="section-details-label">Line Stop</span>
                            <?php 
                                echo $lineStop
                            ?>
                        </div>
                        <div>
                            <span class="section-details-label">Others</span>
                            <?php 
                                echo $others
                            ?>
                        </div>

                    </div>
                </div>
            
                <!-- PLAN -->
                <div id="" class="initial initial-setup gap-2 flex-column w-100">
                    <div class="d-flex flex-column w-100 justify-content-between content-group rounded-3 p-2">
                        <h5>Current Status</h5>
                        <div class="d-flex gap-2">
                            <div>
                                <span class="plan-details section-details-label">Original PO Plan Quantity</span>
                                <?php
                                    echo $planQuantity;
                                ?>
                            </div>

                            <div>
                                <span class="plan-details section-details-label">Hourly Plan Quantity</span>
                                <?php
                                    echo $hourlyPlanQuantity;
                                ?>
                            </div>

                            <div>
                                <span class="plan-details section-details-label">Takt Time</span>
                                <?php
                                    echo $taktTime;
                                ?>
                            </div>

                            <div class="countInputs">
                                <span class="plan-details section-details-label">Target</span>
                                <?php
                                    echo $target;
                                ?>
                            </div>

                            <div class="countInputs">
                                <span class="plan-details section-details-label">Actual Quantity</span>
                                <?php
                                    echo $actualQuantity;
                                ?>
                            </div>

                            <div class="countInputs">
                                <span class="plan-details section-details-label">Variance</span>
                                <?php
                                    echo $variance;
                                ?>
                            </div>

                            <div class="countInputs">
                                <span class="plan-details section-details-label">Compliance Rate</span>
                                <?php
                                    echo $complianceRate;
                                ?>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>

                <!-- CURRENT DATA -->
                <div class="initial initial-setup">
                    <table id="data-table" class="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">PO</th>
                                <th scope="col">Section</th>
                                <th scope="col">Workcenter</th>
                                <th scope="col">Line</th>
                                <th scope="col">Area</th>
                                <th scope="col">Material</th>
                                <th scope="col">Description</th>
                                <th scope="col">Plan Quantity</th>
                                <th scope="col">Hourly Plan Quantity</th>
                                <th scope="col">Takt Time</th>

                                <th scope="col">Target</th>
                                <th scope="col">Commulative Plan</th>

                                <th scope="col">Actual Quantity</th>
                                <th scope="col">Commulative Actual</th>

                                <th scope="col">Compliance Rate</th>
                                <th scope="col">Variance</th>
                                <th scope="col">Shift</th>
                                <th scope="col">Hourly Time</th>
                                <th scope="col">Direct Operators</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">End Time</th>
                                <th scope="col">Advance Reasons</th>
                                <th scope="col">Linestop Reasons</th>

                                <th scope="col">Started By</th>
                                <th scope="col">Ended By</th>
                                <th scope="col">Time Created</th>
                                <th scope="col">Updated By</th>
                                <th scope="col">Production Action</th>

                            </tr>
                        </thead>
                    </table>
                </div>

                <!-- LOADING -->
                <div id="loading" class="justify-content-center align-items-center h-100" style="display:none;">
                    <div class="loader"></div>
                </div>
            </div>
        </div>

    </div>

    <!-- MODALS -->
    <div id="poModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Production Order</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="p-3 d-flex">
                    <?php echo $search; ?>
                </div>
                <div id="po_list" class="modal-body d-grid gap-2" style="grid-template-columns: repeat(4, 1fr);">
                    
                </div>
            </div>
        </div>
    </div>

    <!-- ADVANCE MODAL -->
    <div id="advanceCauseCategoriesModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Advance / Delay Causes</h1>
                    <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#stopProductionModal" aria-label="Close"></button>
                </div>
                <div id="advance-reasons" class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">
                    
                </div>
            </div>
        </div>
    </div>

    <div id="advanceActionCategoriesModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Advance / Delay Actions</h1>
                    <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#stopProductionModal" aria-label="Close"></button>
                </div>
                <div id="advance-actions" class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">
                    
                </div>
            </div>
        </div>
    </div>

    <!-- LINE STOP MODAL -->
    <div id="linestopCauseCategoriesModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Linestop / NG Causes</h1>
                    <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#stopProductionModal" aria-label="Close"></button>
                </div>
                <div id="linestop-reasons" class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">

                </div>
            </div>
        </div>
    </div>

    <div id="linestopActionCategoriesModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Linestop / NG Actions</h1>
                    <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#stopProductionModal" aria-label="Close"></button>
                </div>
                <div id="linestop-actions" class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">
                    
                </div>
            </div>
        </div>
    </div>

    <div id="stopProductionModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Causes & Actions</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id="stopProductionModalBody" class="container modal-body">
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                            <h5>Advance / Delay</h5>
                            <div class="w-100 d-flex justify-content-start">
                                <h5 class="w-50">Causes</h5>
                                <h5 class="w-50">Actions</h5>
                            </div>
                            <div id="advance-container" class="d-flex flex-column gap-2 h-100">

                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                            <h5>Linestop / Abnormality Detail</h5>
                            <div class="w-100 d-flex justify-content-start">
                                <h5 class="w-50">Causes</h5>
                                <h5 class="w-50">Actions</h5>
                            </div>
                            <div id="linestop-container" class="d-flex flex-column gap-2 h-100">

                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 d-flex justify-content-between">
                    <div class="d-flex gap-2">
                        <div>
                            <?php 
                                echo $save;
                            ?>
                        </div>
                        <div class="d-flex">
                            <?php 
                                echo $islinestop;
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- REASON EDIT MODAL -->
    <div id="reasonEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Reason</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id="reasonEditModalBody" class="modal-body">
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                            <h5>Advance / Delay</h5>
                            <div class="w-100 d-flex justify-content-start">
                                <h5 class="w-50">Causes</h5>
                                <h5 class="w-50">Actions</h5>
                            </div>
                            <div id="edit-advance-container" class="d-flex flex-column gap-2 h-100">

                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                            <h5>Linestop / Abnormality Detail</h5>
                            <div class="w-100 d-flex justify-content-start">
                                <h5 class="w-50">Causes</h5>
                                <h5 class="w-50">Actions</h5>
                            </div>
                            <div id="edit-linestop-container" class="d-flex flex-column gap-2 h-100">

                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 d-flex justify-content-between">
                    <div class="d-flex gap-2">
                        <div>
                            <?php 
                                echo $editSave;
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- POPOVERS -->
    <div  id="popover-stops" style="display: none;">
        <div class="d-flex gap-2 flex-column">
            <div>
                <?php echo $breaktimePopOver ?>
            </div>

            <div class="d-none">
                <?php echo $lineStopPopOver ?>
            </div>
        </div>
    </div>

    <!-- TOASTS -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="watchEdit" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex justify-content-between toast-header">
                <div class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-bell"></i>
                    <strong class="me-auto">Data Updated</strong>
                </div>
                
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                The data has been successfully updated.
            </div>
        </div>
    </div>
</body>

<!-- <script defer type="module" src="/homs/js/functions/page-scripts/detailsPOSelection.js"></script> -->

<script defer type="module" src="/homs/js/functions/flatpickr.js"></script>
<script defer type="module" src="/homs/js/functions/page-scripts/mainProduction.js"></script>