<?php

    require_once __DIR__ . '/../../components/checkbox.php';
    global $button;
    global $textbox;
    global $select;

    $checkbox = new Checkbox();

    /* SECTION CHECKBOXES */
    $inkHead = $checkbox->primaryCheckbox(
        'inkHeadID',
        'inkHead',
        'Ink Head',
        false
    );
    $toner = $checkbox->primaryCheckbox(
        'tonerID',
        'toner',
        'Toner',
        false
    );
    $pcba = $checkbox->primaryCheckbox(
        'pcbaID',
        'pcba',
        'PCBA',
        false
    );
    $printer1 = $checkbox->primaryCheckbox(
        'printer1ID',
        'printer1',
        'Printer 1',
        false
    );
    $ptouch = $checkbox->primaryCheckbox(
        'ptouchID',
        'ptouch',
        'P-Touch',
        false
    );
    $ink = $checkbox->primaryCheckbox(
        'inkID',
        'ink',
        'Ink Cartridge',
        false
    );
    $printer2 = $checkbox->primaryCheckbox(
        'printer2ID',
        'printer2',
        'Printer 2',
        false
    );
    $tapeCassette = $checkbox->primaryCheckbox(
        'tapeCassetteID',
        'tapeCassette',
        'Tape Cassette',
        false
    );
?>

<title>HOMS - Settings</title>

<body class="bg-custom text-light container-fluid">
    <?php
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>

    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Settings</h1>

        <div id="hourly-update">
            <h2>Hourly Update</h2>
            <p>Sections</p>
            <div class="d-flex gap-3">
                <?php 
                    echo $inkHead;
                    echo $toner;
                    echo $pcba;
                    echo $printer1;
                    echo $ptouch;
                    echo $ink;
                    echo $printer2;
                    echo $tapeCassette;
                ?>
            </div>
        </div>
    </div>

    <div class="toast-container  position-fixed bottom-0 end-0 p-3">
        <div id="update-toast" class="toast glow" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header d-flex gap-2">
                <i class="fa-solid fa-clock"></i>
                <strong class="me-auto">Hourly Update</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Hourly updates settings updated successfully.
            </div>
        </div>
    </div>
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/settings.js"></script>