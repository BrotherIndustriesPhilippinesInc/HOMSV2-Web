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
        <h1>Graphs</h1>
        <div class="container-fluid w-75 d-flex justify-content-center">
            <canvas class="w-100" id="initial-graph"></canvas>
        </div>
        
    </div>
</body>
<script defer type="module" src="/homs/js/functions/page-scripts/initialGraph.js"></script>