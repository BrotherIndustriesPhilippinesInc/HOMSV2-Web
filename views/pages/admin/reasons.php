<?php
    global $button;
    global $textbox;
    global $select;
    
    $date = $textbox->dateSelect("date");

    $create = $button->primaryButton("create","Create Reason", "", "", "data-bs-toggle='modal' data-bs-target='#reasonCreateModal'");
    
    $submit = $button->primaryButton("submit","Submit", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $createName = $textbox->primaryTextbox("create-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $createDetails = $textbox->textArea("create-details", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    
    $createCategory = $select->primarySelect("create-category", "", [
        "Advance/Delay Reason" => "Advance/Delay Reason",
        "Advance/Delay Action" => "Advance/Delay Action",
        "Linestop/NG Reason" => "Linestop/NG Reason",
        "Linestop/NG Action" => "Linestop/NG Action",

    ]);

    $createLegend = $textbox->primaryTextbox("create-legend", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editName = $textbox->primaryTextbox("edit-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editDetails = $textbox->textArea("edit-details", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    
    $editCategory = $select->primarySelect("edit-category", "", [
        "Advance/Delay Reason" => "Advance/Delay Reason",
        "Advance/Delay Action" => "Advance/Delay Action",
        "Linestop/NG Reason" => "Linestop/NG Reason",
        "Linestop/NG Action" => "Linestop/NG Action",
    ]);

    $editLegend = $textbox->primaryTextbox("edit-legend", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

?>

<title>HOMS - Reasons & Actions</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Reasons & Actions</h1>
        <div>
            <?php echo $create; ?>
        </div>
        <table id="reasons-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Details</th>
                    <th scope="col">Category</th>
                    <th scope="col">Loss Factor Legend</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Updated By</th>
                    <th scope="col">Date Updated</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
        </table>
    </div>
    
    <!-- Modal -->
    <div id="reasonCreateModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Create</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="create-name" class="form-label">Reason Name</label>
                            </div>
                            <?php echo $createName; ?>
                        </div>
                        <div>
                            <div>
                                <label for="create-details" class="form-label">Reason Details</label>
                            </div>
                            <?php echo $createDetails; ?>
                        </div>
                        <div>
                            <div>
                                <label for="create-category" class="form-label">Category</label>
                            </div>
                            <?php echo $createCategory; ?>
                        </div>
                        <div id="create-legend-container" class="d-none">
                            <div>
                                <label for="create-legend" class="form-label">Loss Factor Legend</label>
                            </div>
                            <?php echo $createLegend; ?>
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer border-0">
                    <?php echo $submit; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="reasonEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="edit-name" class="form-label">Reason Name / Loss Factor</label>
                            </div>
                            <?php echo $editName; ?>
                        </div>
                        <div>
                            <div>
                                <label for="edit-name" class="form-label">Reason Details</label>
                            </div>
                            <?php echo $editDetails; ?>
                        </div>
                        <div>
                            <div>
                                <label for="edit-name" class="form-label">Category</label>
                            </div>
                            <?php echo $editCategory; ?>
                        </div>
                        <div id="edit-legend-container" class="d-none">
                            <div>
                                <label for="edit-legend" class="form-label">Loss Factor Legend</label>
                            </div>
                            <?php echo $editLegend; ?>
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer border-0">
                    <?php echo $save; ?>
                </div>
            </div>
        </div>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/reasons.js"></script>