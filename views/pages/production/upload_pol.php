<?php
    global $button;
    $primaryButton = $button->primaryButton("testButton","Button");
?>

<title>HOMS</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3" style="height: calc(100vh - 98px);">
        <h1>Upload POL</h1>
        <div id="uppy-dashboard" class="d-flex justify-content-center align-items-center"></div>
    </div>
</body>

<script defer type="module" src="/js/functions/uploadPOL.js"></script>