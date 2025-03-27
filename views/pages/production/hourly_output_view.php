<?php
    global $button;
?>

<title>HOMS - Hourly Output</title>

<body class="bg-custom text-light container-fluid">
    <?php 
        require_once __DIR__ . "/../../components/header.php";
        require_once __DIR__ . '/../../components/navbar.php';
    ?>

    <div class="main-content bg-custom-secondary container-fluid rounded-3 pb-2">
        <h1>Hourly Output Monitoring File</h1>

        <!-- Output Headers -->
        <div class="d-flex justify-content-between tertiary-background rounded p-2">
            <div class = "output-card production-card">
                <div class="output-header secondary-text fw-bold">
                    Department
                </div>
                <div class="output-body fw-semibold">
                    Production
                </div>
            </div>
            <div class = "output-card production-card">
                <div class="output-header secondary-text fw-bold">
                    Section
                </div>
                <div class="output-body fw-semibold">
                    Tape Cassette
                </div>
            </div>
            <div class = "output-card production-card">
                <div class="output-header secondary-text fw-bold">
                    Process
                </div>
                <div class="output-body fw-semibold">
                    Assembly
                </div>
            </div>
            <div class = "output-card production-card">
                <div class="output-header secondary-text fw-bold">
                    Work Center
                </div>
                <div class="output-body fw-semibold">
                    Aura
                </div>
            </div>
            <div class = "output-card production-card">
                <div class="output-header secondary-text fw-bold">
                    Shift
                </div>
                <div class="output-body fw-semibold">
                    Night Shift
                </div>
            </div>
            <div class = "output-card production-card">
                <div class="output-header secondary-text fw-bold">
                    Date
                </div>
                <div class="output-body fw-semibold">
                    02/07/2025
                </div>
            </div>
        </div>

        <!-- TABS -->
        <div class="nav nav-tabs mt-2" id="nav-tab" role="tablist">
            <button class="nav-link active" id="nav-production-tab" data-bs-toggle="tab" data-bs-target="#nav-production" type="button" role="tab" aria-controls="nav-production" aria-selected="true">Production Output</button>
            <button class="nav-link" id="nav-output-ng-details-tab" data-bs-toggle="tab" data-bs-target="#nav-output-ng-details" type="button" role="tab" aria-controls="nav-output-ng-details" aria-selected="false">Output / NG Details</button>
            <button class="nav-link" id="nav-linestop-abnormality-details-tab" data-bs-toggle="tab" data-bs-target="#nav-linestop-abnormality-details" type="button" role="tab" aria-controls="nav-linestop-abnormality-details" aria-selected="false">Linestop Abnormality Details</button>
        </div>

        <!-- TAB CONTENT -->
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-production" role="tabpanel" aria-labelledby="nav-production-tab">
                <table id="production-output-table" class="cell-border" >
                    <thead>
                        <tr>
                            <th>Time Range</th>
                            <th>Time Actual</th>
                            <th>Material Code</th>
                            <th>PO Number</th>
                            <th>Model</th>
                            <th>Target</th>
                            <th>Cummmulative Target</th>
                            <th>Actual</th>
                            <th>Cummmulative Actual</th>
                            <th>Variance</th>
                            <th>Cummmulative Variance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>6:00 - 8:00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <div>asdasd</div>
                                <div>asdasdsdsd</div>
                            </td>
                        </tr>
                        <tr>
                            <td>8:00 - 10:00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr>
                            <td>10:00 - 12:00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr>
                            <td>12:00 - 13:00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr>
                            <td>13:00 - 15:00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr>
                            <td>15:00 - 17:30</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="nav-output-ng-details" role="tabpanel" aria-labelledby="nav-output-ng-details-tab">
                
                ...
            </div>
            <div class="tab-pane fade" id="nav-linestop-abnormality-details" role="tabpanel" aria-labelledby="nav-linestop-abnormality-details-tab">

                ...
            </div>
        </div>
    </div>
</body>
<script defer type="module" src="/homs/js/functions/page-scripts/hourlyOutputMonitoring.js"></script>