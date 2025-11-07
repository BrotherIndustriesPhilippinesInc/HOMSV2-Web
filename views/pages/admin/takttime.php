<?php
    global $button;
    global $textbox;
    global $select;
    
    $date = $textbox->dateSelect("date");

    /* REGISTRATION */
    $create = $button->primaryButton("create","Add Model", "", "", "data-bs-toggle='modal' data-bs-target='#espCreateModal'");
    $submit = $button->primaryButton("submit","Submit", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");

    /* EDIT */
    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editSubmit = $button->primaryButton("update","Update", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal' ");

?>

<title>HOMS - Takt Time Management</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>    
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Takt Time Management</h1>
        <div>
            <button type="button" class="create btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary glow d-flex" data-bs-toggle="modal" data-bs-target="#createModal">
                <iconify-icon icon="material-symbols:add" width="24" height="24"></iconify-icon>
                <span class="create-span btn-span ps-2">Add Model</span>
            </button>
        </div>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Model Code</th>
                    <th scope="col">Takt Time (Seconds)</th>
                    <th scope="col">Section</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated By</th>
                    <th scope="col">Updated At</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
        </table>
    </div>
    
    <!-- Modal -->
    <div id="createModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Model</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="modelCode" placeholder="">
                            <label for="floatingInput">Model Code</label>
                        </div>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="taktTime" placeholder="">
                            <label for="taktTime">Takt Time</label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <?php echo $submit; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="editModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Model</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="editModelCode" placeholder="">
                            <label for="floatingInput">Model Code</label>
                        </div>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="editTaktTime" placeholder="">
                            <label for="taktTime">Takt Time</label>
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer border-0">
                    <?php echo $editSubmit; ?>
                </div>
            </div>
        </div>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/takt_time.js"></script>