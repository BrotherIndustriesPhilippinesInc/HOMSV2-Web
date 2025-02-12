<?php
    global $button;
?>

<title>HOMS - WC Selection</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Work Center Selection</h1>
        <div class="d-grid gap-2" style="grid-template-columns: repeat(5, 1fr);">
            
            <?php 
                for($i = 0; $i < 150; $i++){
                    echo $button->primaryButton("wc-button","Button {$i}", "", "", "data-wc-id='{$i}'");
                }
            ?>

        </div>
    </div>
    
</body>

<script defer type="module" src="/js/functions/wcSelection.js"></script>
