<?php
    global $button;
    global $textbox;
    
    $date = $textbox->dateSelect("date");
?>

<title>HOMS - Edit History</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Edit History</h1>
        <table id="data-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Creator</th>
                    <th scope="col">Time Created</th>
                    <th scope="col">Old Data</th>
                    <th scope="col">New Data</th>
                </tr>
            </thead>
        </table>
    </div>
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/edit_history.js"></script>
