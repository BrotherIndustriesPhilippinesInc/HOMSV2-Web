<?php
    global $button;
    global $textbox;
    global $select;
    
    $date = $textbox->dateSelect("date");

    /* ST REGISTRATION */
    $create = $button->primaryButton("create","Register", "", "", "data-bs-toggle='modal' data-bs-target='#stCreateModal'");
    $submit = $button->primaryButton("submit","Submit", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $plant = $select->primarySelect("register-plant", "", [
        "N101" => "N101",
        "N102" => "N102",
        "N103" => "N103",
    ]);
    $item_code = $textbox->primaryTextbox("register-item-code", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $sequence_no = $textbox->primaryTextbox("register-sequence-no", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $item_text = $textbox->primaryTextbox("register-item-text", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $new_st_sap = $textbox->primaryTextbox("register-new-st-sap", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $current_st_mh = $textbox->primaryTextbox("register-current-st-mh", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $st_default_flag = $textbox->primaryTextbox("register-st-default-flag", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $st_update_sign = $textbox->primaryTextbox("register-st-update-sign", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $new_tt_sap = $textbox->primaryTextbox("register-new-tt-sap", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $current_tt_mh = $textbox->primaryTextbox("register-current-tt-mh", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $tt_update_sign = $textbox->primaryTextbox("register-tt-update-sign", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $delete_sign = $textbox->primaryTextbox("register-delete-sign", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $section = $select->primarySelect("register-section", "", [
        "PR1" => "Printer 1",
        "PR2" => "Printer 2",
        "Ink Head" => "Ink Head",
        "P-Touch" => "P-Touch",
        "Tape Cassette" => "Tape Cassette",
        "Ink Cartridge" => "Ink Cartridge",
        "BPS" => "BPS",
        "Toner" => "Toner",
    ]);
    
    /* EDITING ST */
    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editPlant = $select->primarySelect("edit-plant", "", [
        "N101" => "N101",
        "N102" => "N102",
        "N103" => "N103",
    ]);
    $editItem_code = $textbox->primaryTextbox("edit-item-code", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $editSequence_no = $textbox->primaryTextbox("edit-sequence-no", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editItem_text = $textbox->primaryTextbox("edit-item-text", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $editNew_st_sap = $textbox->primaryTextbox("edit-new-st-sap", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editCurrent_st_mh = $textbox->primaryTextbox("edit-current-st-mh", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editSt_default_flag = $textbox->primaryTextbox("edit-st-default-flag", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editSt_update_sign = $textbox->primaryTextbox("edit-st-update-sign", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $editNew_tt_sap = $textbox->primaryTextbox("edit-new-tt-sap", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editCurrent_tt_mh = $textbox->primaryTextbox("edit-current-tt-mh", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editTt_update_sign = $textbox->primaryTextbox("edit-tt-update-sign", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editDelete_sign = $textbox->primaryTextbox("edit-delete-sign", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $editSection = $select->primarySelect("edit-section", "", [
        "PR1" => "Printer 1",
        "PR2" => "Printer 2",
        "Ink Head" => "Ink Head",
        "P-Touch" => "P-Touch",
        "Tape Cassette" => "Tape Cassette",
        "Ink Cartridge" => "Ink Cartridge",
        "BPS" => "BPS",
        "Toner" => "Toner",
    ]);

    $upload = $button->primaryButton("upload","Upload", "", "", "data-bs-toggle='modal' data-bs-target='#stUploadModal'");
?>

<title>HOMS - ST Management</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>

    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>ST Management</h1>
        <div class="d-flex gap-2">
            <?php 
                echo $create;
                echo $upload;
            ?>
        </div>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Plant</th>
                    <th scope="col">Item Code</th>
                    <th scope="col">Sequence No.</th>
                    <th scope="col">Item Text</th>
                    <th scope="col">New ST(SAP)</th>
                    <th scope="col">Current ST(MH)</th>
                    <th scope="col">ST Default LT Flag</th>
                    <th scope="col">ST Update Sign</th>
                    <th scope="col">New TT(SAP)</th>
                    <th scope="col">Current TT(MH)</th>
                    <th scope="col">TT Update Sign</th>
                    <th scope="col">Delete Sign</th>
                    <th scope="col">Section</th>

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
    <div id="stCreateModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Register</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <div class="row">
                                    <div>
                                        <label for="register-plant" class="form-label">Plant</label>
                                        <?php echo $plant; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-item-code" class="form-label">Item Code</label>
                                        <?php echo $item_code; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-sequence-no" class="form-label">Squence No.</label>
                                        <?php echo $sequence_no; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-item-text" class="form-label">Item Text</label>
                                        <?php echo $item_text; ?>
                                    </div>
                                </div>
                            </div>
                            <div class="col d-flex flex-column justify-content-around">
                                <div class="row">
                                    <div>
                                        <label for="register-new-st-sap" class="form-label">New ST(SAP)</label>
                                        <?php echo $new_st_sap; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-current-st-mh" class="form-label">Current ST(MH)</label>
                                        <?php echo $current_st_mh; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-st-default-flag" class="form-label">ST Default LT Flag</label>
                                        <?php echo $st_default_flag; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-st-update-sign" class="form-label">ST Update Sign</label>
                                        <?php echo $st_update_sign; ?>
                                    </div>
                                </div>
                                
                            </div>

                            <div class="col">
                                <div class="row">
                                    <div>
                                        <label for="register-new-tt-sap" class="form-label">New TT(SAP)</label>
                                        <?php echo $new_tt_sap; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-current-tt-mh" class="form-label">Current TT(MH)</label>
                                        <?php echo $current_tt_mh; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-tt-update-sign" class="form-label">TT Update Sign</label>
                                        <?php echo $tt_update_sign; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-delete-sign" class="form-label">Delete Sign</label>
                                        <?php echo $delete_sign; ?>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <div class="row">
                                    <div>
                                        <label for="register-section" class="form-label">Section</label>
                                        <?php echo $section; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <?php echo $submit; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="stEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <div class="row">
                                    <div>
                                        <label for="edit-plant" class="form-label">Plant</label>
                                        <?php echo $editPlant; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="edit-item-code" class="form-label">Item Code</label>
                                        <?php echo $editItem_code; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="edit-sequence-no" class="form-label">Squence No.</label>
                                        <?php echo $editSequence_no; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="edit-item-text" class="form-label">Item Text</label>
                                        <?php echo $editItem_text; ?>
                                    </div>
                                </div>
                            </div>
                            <div class="col d-flex flex-column justify-content-around">
                                <div class="row">
                                    <div>
                                        <label for="register-new-st-sap" class="form-label">New ST(SAP)</label>
                                        <?php echo $editNew_st_sap; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-current-st-mh" class="form-label">Current ST(MH)</label>
                                        <?php echo $editCurrent_st_mh; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-st-default-flag" class="form-label">ST Default LT Flag</label>
                                        <?php echo $editSt_default_flag; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-st-update-sign" class="form-label">ST Update Sign</label>
                                        <?php echo $editSt_update_sign; ?>
                                    </div>
                                </div>
                                
                            </div>

                            <div class="col">
                                <div class="row">
                                    <div>
                                        <label for="register-new-tt-sap" class="form-label">New TT(SAP)</label>
                                        <?php echo $editNew_tt_sap; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-current-tt-mh" class="form-label">Current TT(MH)</label>
                                        <?php echo $editCurrent_tt_mh; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-tt-update-sign" class="form-label">TT Update Sign</label>
                                        <?php echo $editTt_update_sign; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-delete-sign" class="form-label">Delete Sign</label>
                                        <?php echo $editDelete_sign; ?>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <div class="row">
                                    <div>
                                        <label for="register-section" class="form-label">Section</label>
                                        <?php echo $editSection; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0">
                    <?php echo $save; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="stUploadModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Upload</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div id="uppy-dashboard" class="d-flex flex-column justify-content-center align-items-center gap-2">
                        <a href="/homs/resources/templates/st_template.xlsx"><button type="button" class='{$name} btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary {$class} glow'>
                            <span class="{$name}-span btn-span">Download Template</span>
                        </button></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/stManagement.js"></script>