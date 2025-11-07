<?php
    global $button;
    $primaryButton = $button->primaryButton("testButton","Button");
?>

<title>HOMS</title>

<body class="bg-custom container-fluid">
    <?php 
        require_once __DIR__ . "/../components/header.php";
        require_once __DIR__ . '/../components/navbar.php';
    ?>
    <!-- FILTERS -->
    <!-- <div class="d-flex gap-2 width-100 flex-wrap bg-danger" style="padding: 10px; height: 50px;" id="filters"></div>

    <div style="width: auto; height: 400px"><canvas id="acquisitions"></canvas></div> -->

    <script type='module' src='https://bi.datalake.brother.co.jp/javascripts/api/tableau.embedding.3.latest.min.js'></script>
    <div class="h-100 w-100">
        <tableau-viz id='tableau-viz' src='https://bi.datalake.brother.co.jp/t/biph/views/DPP16-2/Dashboard1' width='1300' height='840' hide-tabs toolbar='bottom' ></tableau-viz>
    </div>


    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/home.js"></script>

