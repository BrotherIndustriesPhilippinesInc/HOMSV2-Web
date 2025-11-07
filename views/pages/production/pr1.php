<?php
global $button;
global $textbox;
global $select;

/* Input */
$inputLineSelect = $select->primarySelect(
    "lineSelect",
    "Production Line",
    [
        "BHMINI21_A - BHMINI21_A" => "Line A",
        "BHMINI21_B - BHMINI21_B" => "Line B",
        "BHMINI21_C - BHMINI21_C" => "Line C",
        "BHMINI21_D - BHMINI21_D" => "Line D",
        "BHMINI21_E - BHMINI21_E" => "Line E",
        "BHMINI21_F - BHMINI21_F" => "Line F",
        "BHMINI21_G - BHMINI21_G" => "Line G",
        "BHMINI21_H - BHMINI21_H" => "Line H",
        "BHMINI21_I - BHMINI21_I" => "Line I",
        "BHMINI21_J - BHMINI21_J" => "Line J",
        "BHMINI21_K - BHMINI21_K" => "Line K",
        "BHMINI21_L - BHMINI21_L" => "Line L",
        "BHMINI21_M - BHMINI21_M" => "Line M"
    ],
    ""
);

$inputPO = $select->primarySelect(
    "poSelect",
    "Production Order",
    [
    ],
    ""
);

$inputDateSelect = $textbox->timeSelect("dateSelect", "bg-custom-tertiary text-primary fw-medium ", "", "height: -webkit-fill-available");

/* Finished */
$finishedLineSelect = $select->primarySelect(
    "finishedLineSelect",
    "Production Line",
    [
        "Line A",
        "Line B",
        "Line C",
        "Line D",
        "Line E",
        "Line F",
        "Line G",
        "Line H",
        "Line I",
        "Line J",
        "Line K",
        "Line L",
        "Line M"
    ],
    ""
);

$finishedPO = $select->primarySelect(
    "finishedPOSelect",
    "Production Order",
    [
        "0000123456789"
    ],
    ""
);

$finishedDateSelect = $textbox->timeSelect("finishedDateSelect", "bg-custom-tertiary text-primary fw-medium", "", "height: -webkit-fill-available");

$checkDelayButton = $button->primaryButton("checkDelayButton", "Check Delay", "");
?>

<title>HOMS - Reasons & Actions</title>

<body class="bg-custom container-fluid p-3">
    <?php
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>
    <div class="bg-custom-secondary container-fluid rounded-3">
        <h1>Printer 1 Production</h1>
        <div class="mb-3">
            <button type="button"
                class="checkDelayButton btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary glow d-flex">
                <iconify-icon icon="hugeicons:chat-delay" width="24" height="24"></iconify-icon>
                <span class="checkDelayButton-span btn-span ps-2">Check Delay</span>
            </button>
        </div>
        <div class="d-flex gap-3">
            <!-- Input Chart -->
            <div class="w-50 border p-3 rounded d-flex flex-column gap-3">
                <h3>Input</h3>
                <div>
                    <canvas id="input-chart"></canvas>
                </div>

                <div class="d-flex justify-content-between">
                    <div>
                        <?php
                        echo $inputDateSelect;
                        ?>
                    </div>

                    <div class="d-flex gap-2 w-50">
                        <?php
                        echo $inputLineSelect;
                        echo $inputPO;
                        ?>
                    </div>

                </div>

                <div>
                    <table id="input-table" class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Production Line</th>
                                <th scope="col">Production Order</th>
                                <th scope="col">Target</th>
                                <th scope="col">Input</th>
                                <th scope="col">Time</th>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div>

            <!-- Finished Chart -->
            <div class="w-50 border p-3 rounded d-flex flex-column gap-3">
                <h3>Finished</h3>
                <div>
                    <canvas id="finished-chart"></canvas>
                </div>

                <div class="d-flex justify-content-between">
                    <div>
                        <?php
                        echo $finishedDateSelect;
                        ?>
                    </div>

                    <div class="d-flex gap-2 w-50">
                        <?php
                        echo $finishedLineSelect;
                        echo $finishedPO;
                        ?>
                    </div>

                </div>

                <div>
                    <table id="finished-table" class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Production Line</th>
                                <th scope="col">Production Order</th>
                                <th scope="col">Target</th>
                                <th scope="col">Finished</th>
                                <th scope="col">Time</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <!-- Modal -->
    <div class="modal fade" id="delayModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delays</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table id="delay-table" class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Production Line</th>
                                <th scope="col">Model Code</th>
                                <th scope="col">Production Order</th>
                                <th scope="col">Target</th>
                                <th scope="col">Input</th>
                                <th scope="col">Time</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                
            </div>
        </div>
    </div>

</body>

<script defer type="module" src="/homs/js/functions/page-scripts/pr1.js"></script>