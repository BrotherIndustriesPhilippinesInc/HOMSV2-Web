<?php
    global $button;
    $primaryButton = $button->primaryButton("testButton","Button");
?>

<title>HOMS</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../components/header.php";
        require_once __DIR__ . '/../components/navbar.php';
    ?>


    <script type='module' src='https://bi.datalake.brother.co.jp/javascripts/api/tableau.embedding.3.latest.min.js'></script>
    <div class="h-100 w-100">
        <tableau-viz id='tableau-viz'class="inline-block w-100 h-100" src='https://bi.datalake.brother.co.jp/t/biph/views/trialdash/Dashboard1' toolbar='bottom'></tableau-viz>
    </div>
    
</body>