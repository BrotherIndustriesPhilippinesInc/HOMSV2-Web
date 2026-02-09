<?php
    $user = $_SESSION["user"];

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
    <button class="btn btn-primary" onclick="refreshTableauVizData()">Refresh Dashboard</button>

    <?php 
        $userJSON = json_encode($user);
        $generalTableau = <<<HTML
            <div>
                <script type='module' src='https://bi.datalake.brother.co.jp/javascripts/api/tableau.embedding.3.latest.min.js'></script>
                <div class="h-100 w-100">
                    <tableau-viz id='tableau-viz' src='https://bi.datalake.brother.co.jp/t/biph/views/DPP16-2/Dashboard1' width="100%" height="100vh" hide-tabs toolbar='bottom' ></tableau-viz>
                </div>
            </div>
        HTML;

        $pr1Tableau = <<<HTML
            <div>
                <script type='module' src='https://bi.datalake.brother.co.jp/javascripts/api/tableau.embedding.3.latest.min.js'></script>
                <div class="h-100 w-100">
                    <tableau-viz id='tableau-viz' src='https://bi.datalake.brother.co.jp/t/biph/views/HOMSV2PR1EMES/Dashboard1/3141c6c0-3f46-4381-8b20-fecc6db31f92/354e3394-84df-4a5b-a1d7-f34a6d7358e4' width="100%" height="100vh" hide-tabs toolbar='bottom' ></tableau-viz>
                </div>
            </div>
        HTML;

        if($user['Section'] != 'Printer 1') {
            echo $generalTableau;
        }else{
            echo $pr1Tableau;
        }

                    
    
    ?>
    
    
</body>

<script defer type="module" src="/homs/js/functions/page-scripts/home.js"></script>

