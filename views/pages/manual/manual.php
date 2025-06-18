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
    <div class="main-content bg-custom-secondary container-fluid rounded-3">
        <h1>Operational Manual</h1>
        <div class="container-fluid w-100 d-flex justify-content-center">
            <div class="w-100" style = "height: calc(100vh - 150px)">
                <iframe class="w-100 h-100" src="/homs/resources/pdfs/operational_manual.pdf" frameborder="0" ></iframe>
            </div>
        </div>
        
    </div>
</body>
<script defer type="module" src="/homs/js/functions/page-scripts/manual.js"></script>