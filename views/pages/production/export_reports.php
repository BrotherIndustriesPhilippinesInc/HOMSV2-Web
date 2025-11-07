<?php
    global $button;
    global $textbox;
    
    $date = $textbox->dateSelect("date");
?>

<title>HOMS - Export Reports</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Export Reports</h1>
        <div class="py-2">
            <?php echo $date ?>
        </div>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Work Center</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
        </table>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/export_reports.js"></script>
