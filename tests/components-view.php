<?php 
    global $button;
    global $textbox;
    global $select;

    $primaryButton = $button->primaryButton("testButton", "Button");
    $navButton = $button->navButton("Nav Button", "/comptest");

    $primarytextbox = $textbox->primaryTextbox("testTextbox");
    $secondaryTextbox = $textbox->secondaryTextbox("testTextbox");

    $primarySelect = $select->primarySelect("testSelect");
?>

<title>Component Test</title>
<script defer type="module">
    Swal.fire("SweetAlert2 is working!");
</script>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../views/components/header.php";
        require_once __DIR__ . '/../views/components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3 h-100">
        <h1>Components Test</h1>

        <div class="row">

            <div class="col p-3">
                <h3>Buttons</h3>
                <div class="d-flex flex-column gap-2 ">
                    <?php 
                        echo $primaryButton;
                        echo $navButton;
                    ?>
                </div>
            </div>

            <div class="col p-3 d-flex flex-column gap-2">
                <h3>Textbox</h3>
                <?php 
                    echo $primarytextbox;
                    echo $secondaryTextbox;
                ?>
            </div>

        </div>

        <div class="row">
            <div class="col p-3">
                <h3>Selects</h3>
                <?php 
                    echo $primarySelect;
                ?>
            </div>

            <div class="col p-3">
                <h3>Dropdowns</h3>
            </div>
        </div>

        <div class="row">
            <div class="col p-3">
                <h3>Cards</h3>
                
            </div>
        </div>
            
    </div>
    

</body>