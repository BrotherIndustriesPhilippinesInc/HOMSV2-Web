<?php
global $button;
global $textbox;
global $select;
?>

<title>HOMS - Delay Overview</title>

<body class="bg-custom container-fluid">
    <?php
    require_once __DIR__ . "/../../components/header.php";
    require_once __DIR__ . '/../../components/navbar.php';
    ?>

    <div class="bg-custom-secondary container-fluid rounded-3 p-4">
        <h1>Delay Overview</h1>

        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Line</th>
                    <th scope="col">Model Code</th>
                    <th scope="col">PO</th>
                    <th scope="col" class="text-center">Advance Reasons</th>
                    <th scope="col" class="text-center">Linestop Reasons</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="modal fade" id="reasonsModal" tabindex="-1" aria-labelledby="reasonsModalLabel" aria-hidden="true">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Register</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal-body-content">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary  glow" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</body>

<script defer src="/homs/js/functions/page-scripts/delay_overview.js"></script>