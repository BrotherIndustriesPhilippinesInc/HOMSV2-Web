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
        <div id="uppy-dashboard" class="d-flex justify-content-center align-items-center"></div>
    </div>
</body>

<script defer type="module" src="/js/functions/page-scripts/uploadPOL.js"></script>