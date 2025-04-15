<?php
    $button = new Buttons();
    $textbox = new Textboxes();
    $dropdown = new Dropdowns();

    $wcName = $_GET['wc'];

    $search = $textbox->searchTextbox("searchPO");

    $selectPO = $button->primaryButton("po-button-modal", "Select PO", "/homs/resources/icons/shopping_cart.svg", "po_cart", "data-bs-toggle='modal' data-bs-target='#poModal'");

    $startProduction = $button->primaryButton("startProduction", "Start Production", "/homs/resources/icons/pallet.svg", "");
    $stopProduction = $button->primaryButtonAlt("stopProduction", "Stop Production", "fa-regular fa-circle-stop", "", "danger");

    $addPlan = $button->primaryButton("addPlan", "Add Plan", "/homs/resources/icons/add.svg", "Add Plan");

    $planQuantity = $textbox->primaryTextbox("planQuantity", "plan-detail-textbox secondary-background p-1");

    $lineSelect = $dropdown->primaryDropdown("lineSelect", "Line", ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8", "Line 9", "Line 10"]);
    $areaSelect = $dropdown->primaryDropdown("areaSelect", "Area", ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8", "Area 9", "Area 10"]);
    $shiftSelect = $dropdown->primaryDropdown("shiftSelect", "Shift", ["Shift 1", "Shift 2", "Shift 3", "Shift 4", "Shift 5", "Shift 6", "Shift 7", "Shift 8", "Shift 9", "Shift 10"]);
    
    $hourlyTime = $dropdown->primaryDropdown("hourlyTime", "Hourly Time", ["8:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00", "22:00-24:00"]);
    $directOperations = $textbox->primaryTextbox("directOperations", "secondary-background p-1 text-center");

    $startTime = $textbox->timeSelect("startTime");
    $endTime = $textbox->timeSelect("endTime");

    $breaktime = $textbox->primaryTextbox("breaktime", "secondary-background p-1 text-center");
    $changeModel = $textbox->primaryTextbox("changeModel", "secondary-background p-1 text-center");
    $lineStop = $textbox->primaryTextbox("lineStop", "secondary-background p-1 text-center");
    $others = $textbox->primaryTextbox("others", "secondary-background p-1 text-center");

    $causeOfVariance = $textbox->textArea("causeOfVariance", "secondary-background p-1 h-100");
    $action = $textbox->textArea("action", "secondary-background p-1 h-100");

    $causeCategories = $button->primaryButton("causeCategories", "Cause Categories", "/homs/resources/icons/list_alt.svg", "cause_categories", "data-bs-toggle='modal' data-bs-target='#causeModal'", "d-flex align-items-center p-1");
    $actionCategories = $button->primaryButton("actionCategories", "Action Categories", "/homs/resources/icons/list_alt.svg", "action_categories", "data-bs-toggle='modal' data-bs-target='#actionModal'", "d-flex align-items-center p-1");
    
    $homsView = $button->primaryButton("homsView", "HOMS", "/homs/resources/icons/visibility.svg", "homs_view");
    $save = $button->primaryButton("save", "Save", "/homs/resources/icons/save.svg", "save");

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

            <div class="d-flex align-items-center gap-2">
                <div>
                    <h1><?php echo "$wcName"?></h1>
                </div>
                
                <div class="d-flex gap-2 align-items-center">
                    <img src="/homs/resources/icons/list_alt.svg" style="width: 16px; height: 16px;"/>
                    <span class="fw-bold">quantity(placeholder)</span>
                </div>

                <div>
                    <?php echo $search; ?>
                </div>
            </div>
            
            <div>
                <img src="/homs/resources/icons/arrow_back_2.svg" alt="arrow-popover-trigger" class="popover-trigger"
                    data-bs-toggle="popover" 
                    data-bs-placement="left"
                    data-bs-html="true"
                />
                
            </div>
        </div>

        <div class="h-100 d-flex justify-content-between gap-3">
            <div class="w-75 d-flex flex-column gap-2">
                <!-- CONTROLS -->
                <div class="d-flex justify-content-between w-100">
                    <div class="">
                        <div>
                            <?php
                                echo $selectPO; 
                            ?>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
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
                <div class="content-group p-2 rounded-3">
                    <div class="d-flex justify-content-between">
                        <h5>Section <br> Details</h5>
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
                            <div>
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
                        <div class="d-flex align-items-center">
                            <span class="section-details-label">End Time</span>
                            <?php 
                                echo $endTime
                            ?>
                        </div>


                    </div>
                </div>
                <!-- STOPS -->
                <div class="content-group p-2 rounded-3">
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
                <!-- REASONS & ACTIONS -->
                <div class="d-flex flex-column content-group p-2 rounded-3 h-100">
                    <h5>Reasons & Actions</h5>
                    <div class="d-flex h-100">
                        <div class="d-flex gap-2 w-100">
                            <div class="d-flex flex-column w-50">
                                <div class="d-flex align-items-center justify-content-between">
                                    <span class="section-details-label">Cause Of Variance</span>
                                    <?php echo $causeCategories; ?>
                                </div>
                                <?php 
                                    echo $causeOfVariance
                                ?>
                            </div>
                            <div class="d-flex flex-column w-50">
                                <div class="d-flex align-items-center justify-content-between">
                                    <span class="section-details-label">Action to the Delay</span>
                                    <?php echo $actionCategories; ?>
                                </div>
                                
                                <?php 
                                    echo $action
                                ?>
                            </div>
                            
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
            
            <!-- PLAN -->
            <div class="d-flex gap-2 flex-column w-25">
                <div class="d-flex flex-column w-100 justify-content-between content-group rounded-3 p-2">
                    <h5>Plan</h5>
                    <div>
                        <span class="plan-details">Plan Quantity</span>
                        <?php
                            echo $planQuantity;
                        ?>
                    </div>

                    <div>
                        <span class="plan-details">Takt Time (Seconds)</span>
                        <?php
                            echo $planQuantity;
                        ?>
                    </div>

                    <div>
                        <span class="plan-details">Actual Quantity</span>
                        <?php
                            echo $planQuantity;
                        ?>
                    </div>

                    <div>
                        <span class="plan-details">Variance</span>
                        <?php
                            echo $planQuantity;
                        ?>
                    </div>
                    
                </div>
                <div class="d-flex flex-column gap-2">
                    <?php 
                        echo $homsView;
                        
                    ?>
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
                <div class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">
                    <?php 
                        for($i = 0; $i < 150; $i++){
                            echo $button->primaryButton("po-button","Production Order #{$i}", "", "", "data-po-id='{$i}' data-bs-dismiss='modal' data-bs-target='#popover-stops'");
                        }
                    ?>
                </div>
            </div>
        </div>
    </div>

    <div id="causeModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Causes</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">
                    <?php 
                        for($i = 0; $i < 10; $i++){
                            echo $button->primaryButton("po-button","Cause #{$i}", "", "", "data-po-id='{$i}' data-bs-dismiss='modal' data-bs-target='#popover-stops'");
                        }
                    ?>
                </div>
            </div>
        </div>
    </div>

    <div id="actionModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Actions</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-grid gap-2" style="grid-template-columns: repeat(1, 1fr);">
                    <?php 
                        for($i = 0; $i < 10; $i++){
                            echo $button->primaryButton("po-button","Actions #{$i}", "", "", "data-po-id='{$i}' data-bs-dismiss='modal' data-bs-target='#popover-stops'");
                        }
                    ?>
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

            <div>
                <?php echo $lineStopPopOver ?>
            </div>
        </div>
    </div>
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/detailsPOSelection.js"></script>
<script defer type="module" src="/homs/js/functions/flatpickr.js"></script>