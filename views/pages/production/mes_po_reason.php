<?php
    $po = $_GET['po'];
    global $button;

    $button = new Buttons();
    $textbox = new Textboxes();
    $dropdown = new Dropdowns();
    $select = new Selects();
    $checkbox = new Checkbox();
    
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

    $save = $button->primaryButtonAlt("save", "Submit", "fa-solid fa-floppy-disk", "", "" );
    $islinestop = $checkbox->primaryCheckbox("islinestop", "linestop", "Is Linestop?");
?>


<title>HOMS - PO Reason</title>

<body class="bg-custom container-fluid">
    <?php 
        //require_once __DIR__ . "/../../components/header.php";
        //require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="bg-custom-secondary rounded-3 w-50 p-2">
            <h1><?php echo $po ?></h1>
            <div>
                 <div class="border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Causes & Actions</h1>
                </div>
                <div id="stopProductionModalBody" class="">
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3">
                            <h5>Advance / Delay</h5>
                            <div class="w-100 d-flex justify-content-start">
                                <h5 class="w-50">Causes</h5>
                                <h5 class="w-50">Actions</h5>
                            </div>
                            <div id="advance-container" class="d-flex flex-column gap-2">

                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="d-flex flex-column content-group p-2 rounded-3">
                            <h5>Linestop / Abnormality Detail</h5>
                            <div class="w-100 d-flex justify-content-start">
                                <h5 class="w-50">Causes</h5>
                                <h5 class="w-50">Actions</h5>
                            </div>
                            <div id="linestop-container" class="d-flex flex-column gap-2">

                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 d-flex justify-content-between mt-2 ">
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

    <!-- MODALS -->
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

    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/mes_po_reason.js"></script>