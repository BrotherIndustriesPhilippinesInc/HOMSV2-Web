<?php
    global $button;
    global $textbox;
    
    $search = $textbox->searchTextbox("searchPO");
?>

<title>HOMS - Work Center Selection</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Work Center Selection</h1>
        <div class="d-flex align-items-center justify-content-between py-2">
            <?php echo $search ?>
            <div class="d-none flex-column">
                <div>
                    <span class="secondary-text">Last Update: </span>
                    <span id="last_update_date" class="fw-bold text-primary"></span>
                    <span class="fw-bold text-primary"> - </span>
                    <span id="last_update_time" class="fw-bold text-primary"></span>
                </div>
                <div>
                    <span class="secondary-text">By: </span>
                    <span id="last_update_by" class="fw-bold text-primary"></span>
                </div>
            </div>
            
        </div>
        <div id="work_center_container" class="d-grid gap-2" style="grid-template-columns: repeat(5, 1fr);">
        </div>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/wcSelection.js"></script>
