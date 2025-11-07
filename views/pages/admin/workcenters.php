<?php
    global $button;
    global $textbox;
    global $select;
    
    $date = $textbox->dateSelect("date");

    /* WORKCENTER REGISTRATION */
    $create = $button->primaryButton("create","Register", "", "", "data-bs-toggle='modal' data-bs-target='#workcenterCreateModal'");
    $submit = $button->primaryButton("submit","Submit", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $section = $select->primarySelect("register-section", "", [
        "Printer 1" => "Printer 1",
        "Printer 2" => "Printer 2",
        "Ink Head" => "Ink Head",
        "P-Touch" => "P-Touch",
        "Tape Cassette" => "Tape Cassette",
        "Ink Cartridge" => "Ink Cartridge",
        "BPS" => "BPS",
        "Toner" => "Toner",
        "PCBA" => "PCBA",
        "Molding" => "Molding",
    ]);
    $costcenter = $select->primarySelect("register-costcenter", "", [
        "4110" => "4110",
        "A001" => "A001",
        "Y012" => "Y012",
        "Y011" => "Y011",
        "4140" => "4140",
        "B001" => "B001",
        "Y001" => "Y001",
        "YH02" => "YH02",
        "YH04" => "YH04",
        "5110" => "5110",
        "5120" => "5120",
        "5130" => "5130",
        "D001" => "D001",
        "YM12" => "YM12",
        "D002" => "D002",
        "B002" => "B002",
        "4160" => "4160",
        "YB04" => "YB04",
        "6110" => "6110",
        "4130" => "4130",
        "F001" => "F001",
        "Y002" => "Y002",
        "Y004" => "Y004",
        "C006" => "C006",
        "4131" => "4131",
        "C007" => "C007",
        "C009" => "C009",
        "C008" => "C008",
        "4150" => "4150",
        "C004" => "C004",
        "Y003" => "Y003",
        "Y006" => "Y006",
        "Y007" => "Y007",
        "4120" => "4120",
        "A002" => "A002",
        "Y016" => "Y016",
        "Y015" => "Y015",
        "Y013" => "Y013",
        "A003" => "A003",
        "A004" => "A004",
        "4180" => "4180",
        "4181" => "4181"
    ]);
    $costcenter_name = $textbox->primaryTextbox("register-costcenter-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $plant = $select->primarySelect("register-plant", "", [
        "N101" => "N101",
        "N102" => "N102",
        "N103" => "N103",
    ]);
    $workcenter_name = $textbox->primaryTextbox("register-workcenter-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $line_name = $textbox->primaryTextbox("register-line-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $folder_name = $textbox->primaryTextbox("register-folder-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $pattern = $select->primarySelect("register-pattern", "", [
        "A" => "Pattern A",
        "B" => "Pattern B",
        "C" => "Pattern C",
        "D" => "Pattern D",
    ]);
    
    /* EDITING WORKCENTER */
    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editSection = $select->primarySelect("edit-section", "", [
        "Printer 1" => "Printer 1",
        "Printer 2" => "Printer 2",
        "Ink Head" => "Ink Head",
        "P-Touch" => "P-Touch",
        "Tape Cassette" => "Tape Cassette",
        "Ink Cartridge" => "Ink Cartridge",
        "BPS" => "BPS",
        "Toner" => "Toner",
        "PCBA" => "PCBA",
        "Molding" => "Molding",
    ]);
    $editCostcenter = $select->primarySelect("edit-costcenter", "", [
        "4110" => "4110",
        "A001" => "A001",
        "Y012" => "Y012",
        "Y011" => "Y011",
        "4140" => "4140",
        "B001" => "B001",
        "Y001" => "Y001",
        "YH02" => "YH02",
        "YH04" => "YH04",
        "5110" => "5110",
        "5120" => "5120",
        "5130" => "5130",
        "D001" => "D001",
        "YM12" => "YM12",
        "D002" => "D002",
        "B002" => "B002",
        "4160" => "4160",
        "YB04" => "YB04",
        "6110" => "6110",
        "4130" => "4130",
        "F001" => "F001",
        "Y002" => "Y002",
        "Y004" => "Y004",
        "C006" => "C006",
        "4131" => "4131",
        "C007" => "C007",
        "C009" => "C009",
        "C008" => "C008",
        "4150" => "4150",
        "C004" => "C004",
        "Y003" => "Y003",
        "Y006" => "Y006",
        "Y007" => "Y007",
        "4120" => "4120",
        "A002" => "A002",
        "Y016" => "Y016",
        "Y015" => "Y015",
        "Y013" => "Y013",
        "A003" => "A003",
        "A004" => "A004",
        "4180" => "4180",
        "4181" => "4181"
    ]);
    $editCostcenter_name = $textbox->primaryTextbox("edit-costcenter-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editPlant = $select->primarySelect("edit-plant", "", [
        "N101" => "N101",
        "N102" => "N102",
        "N103" => "N103",
    ]);
    $editWorkcenter_name = $textbox->primaryTextbox("edit-workcenter-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editLine_name = $textbox->primaryTextbox("edit-line-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editFolder_name = $textbox->primaryTextbox("edit-folder-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editPattern = $select->primarySelect("edit-pattern", "", [
        "Pattern A" => "Pattern A",
        "Pattern B" => "Pattern B",
        "Pattern C" => "Pattern C",
        "Pattern D" => "Pattern D",
    ]);

    $upload = $button->primaryButton("upload","Upload", "", "", "data-bs-toggle='modal' data-bs-target='#workcenterUploadModal'");

    $register_dpr_template = $textbox->primaryTextbox("register-dpr-template", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $register_breaktime_line = $textbox->primaryTextbox("register-breaktime-line-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $edit_dpr_template = $textbox->primaryTextbox("edit-dpr-template", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $edit_breaktime_line_name = $textbox->primaryTextbox("edit-breaktime-line-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
?>

<title>HOMS - Workcenters</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>

    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Workcenters</h1>
        <div class="d-flex gap-2">
            <?php 
                echo $create;
                echo $upload;
            ?>
        </div>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Section</th>
                    <th scope="col">Costcenter</th>
                    <th scope="col">Costcenter Name</th>
                    <th scope="col">Plant</th>
                    <th scope="col">Workcenter</th>
                    <th scope="col">Line Name</th>
                    <th scope="col">Folder Name</th>
                    <th scope="col">Pattern</th>

                    <th scope="col">DPR Template</th>

                    <th scope="col">Breaktime Name</th>
                    <th scope="col">Break Start Time</th>
                    <th scope="col">Break End Time</th>
                    <th scope="col">Shift</th>
                    <th scope="col">Is Overtime</th>
                    <th scope="col">Area</th>
                    <th scope="col">Line</th>
                    <th scope="col">Break Type</th>

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
    <div id="workcenterCreateModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
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
                                        <label for="register-section" class="form-label">Section</label>
                                        <?php echo $section; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-costcenter" class="form-label">Costcenter</label>
                                        <?php echo $costcenter; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-plant" class="form-label">Plant</label>
                                        <?php echo $plant; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-pattern" class="form-label">Pattern</label>
                                        <?php echo $pattern; ?>
                                    </div>
                                </div>
                            </div>
                            <div class="col d-flex flex-column justify-content-around">
                                <div class="row">
                                    <div>
                                        <label for="register-costcenter-name" class="form-label">Costcenter Name</label>
                                        <?php echo $costcenter_name; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-workcenter-name" class="form-label">Workcenter Name</label>
                                        <?php echo $workcenter_name; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-line-name" class="form-label">Line Name</label>
                                        <?php echo $line_name; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-folder-name" class="form-label">Folder Name</label>
                                        <?php echo $folder_name; ?>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div>
                                <label for="register-costcenter-name" class="form-label">DPR Template Name</label>
                                <?php echo $register_dpr_template ?>
                            </div>
                        </div>
                        <div class="row">
                            <div>
                                <label for="register-costcenter-name" class="form-label">Breaktime Line Name</label>
                                <?php echo $register_breaktime_line ?>
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

    <div id="workcenterEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
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
                                        <label for="edit-section" class="form-label">Section</label>
                                        <?php echo $editSection; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-costcenter" class="form-label">Costcenter</label>
                                        <?php echo $editCostcenter; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-plant" class="form-label">Plant</label>
                                        <?php echo $editPlant; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-pattern" class="form-label">Pattern</label>
                                        <?php echo $editPattern; ?>
                                    </div>
                                </div>
                            </div>
                            <div class="col d-flex flex-column justify-content-around">
                                <div class="row">
                                    <div>
                                        <label for="register-costcenter-name" class="form-label">Costcenter Name</label>
                                        <?php echo $editCostcenter_name; ?>
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-workcenter-name" class="form-label">Workcenter Name</label>
                                        <?php echo $editWorkcenter_name; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-line-name" class="form-label">Line Name</label>
                                        <?php echo $editLine_name; ?>
                                    </div>

                                </div>
                                <div class="row">
                                    <div>
                                        <label for="register-folder-name" class="form-label">Folder Name</label>
                                        <?php echo $editFolder_name; ?>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div>
                                <label for="register-costcenter-name" class="form-label">DPR Template Name</label>
                                <?php echo $edit_dpr_template ?>
                            </div>
                        </div>

                        <div class="row">
                            <div>
                                <label for="edit-breaktime-line-name" class="form-label">Breaktime Line Name</label>
                                <?php echo $edit_breaktime_line_name ?>
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

    <div id="workcenterUploadModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Upload</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div id="uppy-dashboard" class="d-flex flex-column justify-content-center align-items-center gap-2">
                        <a href="/homs/resources/templates/workcenter_template.xlsx"><button type="button" class='{$name} btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary {$class} glow'>
                            <span class="{$name}-span btn-span">Download Template</span>
                        </button></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/workcenters.js"></script>