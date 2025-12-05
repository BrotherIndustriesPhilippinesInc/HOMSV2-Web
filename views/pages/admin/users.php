<?php
    global $button;
    global $textbox;
    global $select;
    
    $date = $textbox->dateSelect("date");

    /* REGISTRATION */
    $create = $button->primaryButton("create","Register user", "", "", "data-bs-toggle='modal' data-bs-target='#userCreateModal'");
    $submit = $button->primaryButton("submit","Submit", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $createName = $textbox->primaryTextbox("create-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $createMacAddress = $textbox->primaryTextbox("create-mac_address", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $createAssignedSection = $select->primarySelect("create-assigned_section", "", [
        "true" => "True",
        "false" => "False"
    ]);
    $createLineName = $textbox->primaryTextbox("create-line_name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $createArea = $textbox->primaryTextbox("create-area", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $createSensorName = $textbox->primaryTextbox("create-sensor_name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    /* EDIT */
    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editName = $textbox->primaryTextbox("edit-name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editMacAddress = $textbox->primaryTextbox("edit-mac_address", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
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
    ]);
    $editLineName = $textbox->primaryTextbox("edit-line_name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editArea = $textbox->primaryTextbox("edit-area", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    $editSensorName = $textbox->primaryTextbox("edit-sensor_name", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");
    
?>

<title>HOMS - User Management</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>User Management</h1>
        <div>
            <?php echo $create; ?>
        </div>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Section</th>
                    <th scope="col">Position</th>
                    <th scope="col">Employee Number</th>
                    <th scope="col">ADID</th>
                    <th scope="col">Is Admin</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
        </table>
    </div>
    
    <!-- Modal -->
    <div id="userCreateModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Register User</h1>
                    <button type="button" class="btn-close my-custom-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="create-name" class="form-label">Employee Number</label>
                            </div>
                            <?php echo $createName; ?>
                        </div>
                        
                        <div>
                            <div>
                                <label for="create-assigned_section" class="form-label">Is Admin</label>
                            </div>
                            <?php echo $createAssignedSection; ?>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="modal-footer border-0">
                    <?php echo $submit; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="userEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Register user32</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="edit-name" class="form-label">user Name</label>
                            </div>
                            <?php echo $editName; ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <div>
                                    <label for="edit-mac_address" class="form-label">Mac Address</label>
                                </div>
                                <?php echo $editMacAddress; ?>
                            </div>
                            <div>
                                <div>
                                    <label for="edit-sensor_name" class="form-label">Sensor Name</label>
                                </div>
                                <?php echo $editSensorName; ?>
                            </div>
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

<script defer type="module" src="/homs/js/functions/page-scripts/users.js"></script>