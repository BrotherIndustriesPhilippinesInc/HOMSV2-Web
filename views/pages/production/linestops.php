<?php
    global $button;
    global $textbox;
    global $select;
    global $checkbox;

    $edit = $button->primaryButton("edit","Register Breaktime", "", "", "data-bs-toggle='modal' data-bs-target='#breaktimeEditModal'");
    $save = $button->primaryButton("save","Save", "btn btn-primary bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "", "data-bs-dismiss='modal'");
    $editResolution = $textbox->textArea("edit-resolution", "form-control bg-custom-tertiary border-0 rounded-3 fw-medium text-primary glow", "");

    $editIsResolved = $checkbox->primaryCheckbox("is-resolved", "edit-is-resolved", "Is Resolved?", false);
?>

<title>HOMS - Linestops</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="main-content bg-custom-secondary container-fluid rounded-3">
        <h1>Linestops</h1>

        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Workcenter</th>
                    <th scope="col">PO</th>
                    <th scope="col">Is Resolved?</th>
                    <th scope="col">Resolution Details</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Updated By</th>
                    <th scope="col">Date Updated</th>
                </tr>
            </thead>
        </table>
    </div>
</body>

<div id="linestopEditModal" class="modal fade" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Linestop</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <div>
                                <label for="edit-resolution" class="form-label">Resolution Details</label>
                            </div>
                            <?php echo $editResolution; ?>
                        </div>
                    </div>

                    <div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value="true">
                            <label class="form-check-label" for="radioDefault1">
                                Resolved
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2" value="false">
                            <label class="form-check-label" for="radioDefault2">
                                Not yet resolved
                            </label>
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer border-0">
                    <?php echo $save; ?>
                </div>
            </div>
        </div>
</div>

<script defer type="module" src="/homs/js/functions/page-scripts/linestops.js"></script>