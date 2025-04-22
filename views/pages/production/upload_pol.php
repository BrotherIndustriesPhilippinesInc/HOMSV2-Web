<?php
    global $button;
?>

<title>HOMS - Upload POL</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="main-content bg-custom-secondary container-fluid rounded-3">
        <h1>Upload POL</h1>
        <div id="uppy-dashboard" class="d-flex flex-column justify-content-center align-items-center">
            <div>
                <input type="checkbox" id="add_pol">
                <label for="add_pol"><span class="text-primary fw-semibold">Additional POL</span></label>
            </div>
            <div>
                <p class="text-primary fst-italic">(Check this if you want to add to the existing POL)</p>
            </div>
            <div class="d-flex justify-content-center align-items-center"></div>
        </div>
        
    </div>
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/uploadPOL.js"></script>