<?php
    $button = new Buttons();
    $textbox = new Textboxes();
    $dropdown = new Dropdowns();
    $select = new Selects();

    $wcName = $_GET['wc'];

    $search = $textbox->searchTextbox("searchPO");

    $selectPO = $button->primaryButton("po-button-modal", "Select PO", "/homs/resources/icons/shopping_cart.svg", "po_cart", "data-bs-toggle='modal' data-bs-target='#poModal'");

    $startProduction = $button->primaryButton("startProduction", "Start Production", "/homs/resources/icons/pallet.svg", "", );

    $stopProduction = $button->primaryButtonAlt("stopProduction", "Stop Production", "fa-regular fa-circle-stop", "data-bs-toggle='modal' data-bs-target='#stopProductionModal'", "danger" );
    //$causeCategories = $button->primaryButton("causeCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#causeModal'", "d-flex align-items-center p-1");

    $addPlan = $button->primaryButton("dprView", "DPR View", "/homs/resources/icons/add.svg", "DPR View");

    $planQuantity = $textbox->primaryTextbox("planQuantity", "plan-detail-textbox secondary-background p-1", "", "0", "number");
    $taktTime = $textbox->primaryTextbox("taktTime", "plan-detail-textbox secondary-background p-1", "", "0", "number");
    $actualQuantity = $textbox->primaryTextbox("actualQuantity", "plan-detail-textbox secondary-background p-1", "", "0", "number");
    $variance = $textbox->primaryTextbox("variance", "plan-detail-textbox secondary-background p-1", "", "0", "number");

    $lineSelect = $select->primarySelect("lineSelect", "Line", ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8", "Line 9", "Line 10"], "");
    $areaSelect = $select->primarySelect("areaSelect", "Area", ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8", "Area 9", "Area 10"], "");
    $shiftSelect = $select->primarySelect("shiftSelect", "Shift", ["ds1"=>"6:00 AM - 4:00 PM", "dssp"=>"7:00 AM - 5:00 PM", "ds2"=>"7:30 AM - 5:30 PM", "ds3"=>"9:00 AM - 7:00 PM", "ns1"=>"6:00 PM - 4:00 AM", "nssp"=>"7:00 PM - 5:00 AM", "ns2"=>"7:30 PM - 5:30 PM"], "");
    
    $hourlyTime = $select->primarySelect("hourlyTime", "Hourly Time", ["06:00 - 08:00", "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00", "20:00 - 22:00", "22:00 - 24:00"], "");
    $directOperations = $textbox->primaryTextbox("directOperations", "secondary-background p-1 text-center", "", 0);

    $startTime = $textbox->timeSelect("startTime", "", "");
    $endTime = $textbox->timeSelect("endTime", "", "");

    $breaktime = $textbox->primaryTextbox("breaktime", "secondary-background p-1 text-center");
    $changeModel = $textbox->primaryTextbox("changeModel", "secondary-background p-1 text-center");
    $lineStop = $textbox->primaryTextbox("lineStop", "secondary-background p-1 text-center");
    $others = $textbox->primaryTextbox("others", "secondary-background p-1 text-center");

    $advanceCause = $textbox->textArea("advanceCause", "secondary-background p-1");
    $advanceAction = $textbox->textArea("advanceAction", "secondary-background p-1");

    $linestopCause = $textbox->textArea("linestopCause", "secondary-background p-1");
    $linestopAction = $textbox->textArea("linestopAction", "secondary-background p-1");

    $advanceCauseCategories = $button->primaryButton("advanceCauseCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#advanceCauseCategoriesModal'", "d-flex align-items-center p-1");
    $advanceActionCategories = $button->primaryButton("advanceActionCategories", "Action Categories", "/homs/resources/icons/list_alt.svg", "action_categories", "data-bs-toggle='modal' data-bs-target='#advanceActionCategoriesModal'", "d-flex align-items-center p-1");
    
    $linestopCauseCategories = $button->primaryButton("linestopCauseCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#linestopCauseCategoriesModal'", "d-flex align-items-center p-1");
    $linestopActionCategories = $button->primaryButton("linestopActionCategories", "Action Categories", "/homs/resources/icons/list_alt.svg", "action_categories", "data-bs-toggle='modal' data-bs-target='#linestopActionCategoriesModal'", "d-flex align-items-center p-1");
    
    $homsView = $button->primaryButton("homsView", "HOMS", "/homs/resources/icons/visibility.svg", "homs_view");
    $save = $button->primaryButton("save", "Stop", "/homs/resources/icons/save.svg", "save", "data-bs-dismiss='modal'");

    $lineStopPopOver = $button->primaryButton("lineStop-popOver", "Line Stop", "/homs/resources/icons/front_hand.svg", "line_stop", "", "w-100 border border-danger text-danger danger");
    $breaktimePopOver = $button->primaryButton("breaktime-popOver", "Breaktime", "/homs/resources/icons/fork_spoon.svg", "breaktime", "", "w-100");
?>

<title>HOMS - WC Selection</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    
    <div class="main-content d-flex flex-column bg-custom-secondary container-fluid rounded-3 pb-2"> 
        <div class="d-flex align-items-center justify-content-between gap-3">

            <div class="d-flex align-items-center gap-2 w-75 justify-content-between">
                <div>
                    <h1><?php echo "$wcName"?></h1>
                </div>
                
                <div id="details-container" class="d-none gap-5">
                    <div id="po_number" class="gap-2 align-items-center">
                        <i class="fa-solid fa-paste" style="font-size: 24px; margin-right: 5px;"></i>
                        <span class="fw-bold">po_number</span>
                    </div>
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
            
            <div class="initial">
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
                <div class=" d-flex justify-content-between w-100">
                    <div class="">
                        <div>
                            <?php
                                echo $selectPO; 
                            ?>
                        </div>
                    </div>
                    
                    <div class=" initial gap-2">
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
                <div class="initial content-group p-2 rounded-3 flex-column gap-2">
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
                            <span class="section-details-label">Start Time</span>
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
                <div class="initial gap-2 flex-column w-100">
                    <div class="d-flex flex-column w-100 justify-content-between content-group rounded-3 p-2">
                        <h5>Current Status</h5>
                        <div class="d-flex gap-2">
                            <div>
                                <span class="plan-details section-details-label">Plan Quantity</span>
                                <?php
                                    echo $planQuantity;
                                ?>
                            </div>

                            <div>
                                <span class="plan-details section-details-label">Takt Time (Seconds)</span>
                                <?php
                                    echo $taktTime;
                                ?>
                            </div>

                            <div>
                                <span class="plan-details section-details-label">Actual Quantity</span>
                                <?php
                                    echo $actualQuantity;
                                ?>
                            </div>

                            <div>
                                <span class="plan-details section-details-label">Variance</span>
                                <?php
                                    echo $variance;
                                ?>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div class="d-flex gap-2">
                        <?php 
                            echo $homsView;
                            echo $addPlan;
                        ?>
                    </div>
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
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Causes & Actions</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id="stopProductionModalBody" class="container modal-body">
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                            <h5>Advance / Delay</h5>
                            <div class="d-flex h-100">
                                <div class="d-flex gap-2 w-100">
                                    <div class="d-flex flex-column w-50">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span class="section-details-label">Reason</span>
                                            <?php echo $advanceCauseCategories; ?>
                                        </div>
                                        <?php 
                                            echo $advanceCause
                                        ?>
                                    </div>
                                    <div class="d-flex flex-column w-50">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span class="section-details-label">Action</span>
                                            <?php echo $advanceActionCategories; ?>
                                        </div>
                                        
                                        <?php 
                                            echo $advanceAction
                                        ?>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                            <h5>Linestop / Abnormality Detail</h5>
                            <div class="d-flex h-100">
                                <div class="d-flex gap-2 w-100">
                                    <div class="d-flex flex-column w-50">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span class="section-details-label">Reason</span>
                                            <?php echo $linestopCauseCategories; ?>
                                        </div>
                                        <?php 
                                            echo $linestopCause
                                        ?>
                                    </div>
                                    <div class="d-flex flex-column w-50">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span class="section-details-label">Action</span>
                                            <?php echo $linestopActionCategories; ?>
                                        </div>
                                        
                                        <?php 
                                            echo $linestopAction
                                        ?>
                                    </div>
                                    
                                </div>
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
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/detailsPOSelection.js"></script>
<script defer type="module" src="/homs/js/functions/flatpickr.js"></script>