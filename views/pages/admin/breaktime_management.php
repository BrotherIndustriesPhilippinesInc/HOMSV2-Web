<?php 
    global $button;
    global $textbox;
    global $select;

    /* REGISTRATION */
    $create = $button->primaryButton("create","Register Breaktime", "", "", "data-bs-toggle='modal' data-bs-target='#breaktimeCreateModal'");
    $submit = $button->primaryButton("submit","Submit", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $createName = $textbox->primaryTextbox("create-name", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");
    
    $createStartTime = $textbox->timeSelect("create-start_time", "bg-custom-tertiary");
    $createEndTime = $textbox->timeSelect("create-end_time", "bg-custom-tertiary");

    $createAssignedSection = $select->primarySelect("create-assigned_section", "", [
        "Printer 1" => "Printer 1",
        "Printer 2" => "Printer 2",
        "Ink Head" => "Ink Head",
        "P-Touch" => "P-Touch",
        "Tape Cassette" => "Tape Cassette",
        "Ink Cartridge" => "Ink Cartridge",
        "BPS" => "BPS",
        "Toner" => "Toner",
        "PCBA" => "PCBA",
        "MOLDING" => "Molding",

    ]);
    $createLineName = $textbox->primaryTextbox("create-line_name", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");
    $createArea = $textbox->primaryTextbox("create-area", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");
    $createShift = $textbox->primaryTextbox("create-shift", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");

    $createBreakType = $select->primarySelect("create-break_type", "", [
        "AM" => "AM Break",
        "NOON_MIDNIGHT" => "Noon / Midnight Break",
        "PM" => "PM Break",
        "OT" => "Overtime Break",
    ]);

    $createIsOvertime = $select->primarySelect("create-is_overtime", "", [
        "true" => "Yes",
        "false" => "No",
    ]);

    /* EDIT */
    $edit = $button->primaryButton("edit","Register Breaktime", "", "", "data-bs-toggle='modal' data-bs-target='#breaktimeEditModal'");
    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary brounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editName = $textbox->primaryTextbox("edit-name", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");
    
    $editStartTime = $textbox->timeSelect("edit-start_time", "bg-custom-tertiary");
    $editEndTime = $textbox->timeSelect("edit-end_time", "bg-custom-tertiary");

    $editAssignedSection = $select->primarySelect("edit-assigned_section", "", [
        "Printer 1" => "Printer 1",
        "Printer 2" => "Printer 2",
        "Ink Head" => "Ink Head",
        "P-Touch" => "P-Touch",
        "Tape Cassette" => "Tape Cassette",
        "Ink Cartridge" => "Ink Cartridge",
        "BPS" => "BPS",
        "Toner" => "Toner",
        "PCBA" => "PCBA",
        "MOLDING" => "Molding",
    ]);
    $editLineName = $textbox->primaryTextbox("edit-line_name", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");
    $editArea = $textbox->primaryTextbox("edit-area", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");
    $editShift = $textbox->primaryTextbox("edit-shift", "form-control bg-custom-tertiary rounded-3 fw-medium text-primary glow", "");

    $editBreakType = $select->primarySelect("edit-break_type", "", [
        "AM" => "AM Break",
        "NOON_MIDNIGHT" => "Noon / Midnight Break",
        "PM" => "PM Break",
        "OT" => "Overtime Break",
    ]);

    $editIsOvertime = $select->primarySelect("edit-is_overtime", "", [
        "true" => "Yes",
        "false" => "No",
    ]);
?>

<title>HOMS - Breaktime Management</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Breaktime Management</h1>
        <div>
            <?php echo $create; ?>
        </div>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Shift</th>
                    <th scope="col">Break Type</th>
                    <th scope="col">Start</th>
                    <th scope="col">End</th>
                    <th scope="col">Section</th>
                    <th scope="col">Line</th>
                    <th scope="col">Area</th>
                    <th scope="col">Is Overtime Break</th>
                
                    <th scope="col">Creator</th>
                    <th scope="col">Time Create</th>
                    <th scope="col">Updated By</th>
                    <th scope="col">Time Updated</th>
                    
                    <th scope="col">Actions</th>

                </tr>
            </thead>
        </table>
    </div>
    
    <!-- Modal -->
    <div id="breaktimeCreateModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Register Breaktime</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="create-name" class="form-label">Breaktime Name</label>
                            </div>
                            <?php echo $createName; ?>
                        </div>
                        <div>
                            <div>
                                <label for="create-shift" class="form-label">Shift</label>
                            </div>
                            <?php echo $createShift; ?>
                        </div>
                        <div>
                            <div>
                                <label for="create-break_type" class="form-label">Break Type</label>
                            </div>
                            <?php echo $createBreakType; ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <div>
                                    <label for="create-start_time" class="form-label">Start Time</label>
                                </div>
                                <?php echo $createStartTime; ?>
                            </div>
                            <div>
                                <div>
                                    <label for="create-end_time" class="form-label">End Time</label>
                                </div>
                                <?php echo $createEndTime; ?>
                            </div>
                        </div>
                        
                        <div>
                            <div>
                                <label for="create-is_overtime" class="form-label">Is Overtime Break</label>
                            </div>
                            <?php echo $createIsOvertime; ?>
                        </div>
                        <div>
                            <div>
                                <label for="create-assigned_section" class="form-label">Section</label>
                            </div>
                            <?php echo $createAssignedSection; ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <div>
                                    <label for="create-line_name" class="form-label">Line</label>
                                </div>
                                <?php echo $createLineName; ?>
                            </div>
                            <div>
                                <div>
                                    <label for="create-area" class="form-label">Area</label>
                                </div>
                                <?php echo $createArea; ?>
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


    <div id="breaktimeEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Breaktime</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="edit-name" class="form-label">Breaktime Name</label>
                            </div>
                            <?php echo $editName; ?>
                        </div>
                        <div>
                            <div>
                                <label for="edit-shift" class="form-label">Shift</label>
                            </div>
                            <?php echo $editShift; ?>
                        </div>
                        <div>
                            <div>
                                <label for="edit-break_type" class="form-label">Break Type</label>
                            </div>
                            <?php echo $editBreakType; ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <div>
                                    <label for="edit-start_time" class="form-label">Start Time</label>
                                </div>
                                <?php echo $editStartTime; ?>
                            </div>
                            <div>
                                <div>
                                    <label for="edit-end_time" class="form-label">End Time</label>
                                </div>
                                <?php echo $editEndTime; ?>
                            </div>
                        </div>
                        
                        <div>
                            <div>
                                <label for="edit-is_overtime" class="form-label">Is Overtime Break</label>
                            </div>
                            <?php echo $editIsOvertime; ?>
                        </div>
                        <div>
                            <div>
                                <label for="edit-assigned_section" class="form-label">Section</label>
                            </div>
                            <?php echo $editAssignedSection; ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <div>
                                    <label for="edit-line_name" class="form-label">Line</label>
                                </div>
                                <?php echo $editLineName; ?>
                            </div>
                            <div>
                                <div>
                                    <label for="edit-area" class="form-label">Area</label>
                                </div>
                                <?php echo $editArea; ?>
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
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/breaktimeManagement.js"></script>