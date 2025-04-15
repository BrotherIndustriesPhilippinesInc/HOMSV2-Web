<?php
    global $button;
    global $textbox;
    
    $date = $textbox->dateSelect("date");
?>

<title>HOMS - Export Reports</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Export Reports</h1>
        <div class="py-2">
            <?php echo $date ?>
        </div>
        <div class="d-grid gap-2" style="grid-template-columns: repeat(5, 1fr);">

        </div>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/wcSelection.js"></script>
