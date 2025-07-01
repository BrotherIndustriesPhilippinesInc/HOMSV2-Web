<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- JQUERY -->
    <script defer src="/homs/node_modules/jquery/dist/jquery.min.js"></script>

    <!-- LESS CSS -->
    <link rel="stylesheet/less" type="text/css" href="/homs/css/style.less" />
    <script defer src="/homs/node_modules/less/dist/less.min.js"></script>

    <!-- BOOSTRAP -->
    <link rel="stylesheet" href="/homs/node_modules/bootstrap/dist/css/bootstrap.css">
    <script defer src="/homs/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

    <!-- POPPER -->
    <script defer src="/homs/non_module_libraries/popper/popper.min.js"></script>

    <!-- SWEETALERT2 -->
    <link rel="stylesheet" href="/homs/node_modules/sweetalert2/dist/sweetalert2.dark.css" />
    <script defer src="/homs/node_modules/sweetalert2/dist/sweetalert2.min.js"></script>

    <!-- MAINSCRIPT -->
    <script defer type="module" defer src="/homs/js/main-script.js"></script>

    <!-- UPPY -->
    <link href="https://releases.transloadit.com/uppy/v4.13.2/uppy.min.css" rel="stylesheet"/>

    <!-- FLATPICKR -->
    <link rel="stylesheet" type="text/css" href="/homs/non_module_libraries/flatpickr/dark.css">
    <script defer src="/homs/non_module_libraries/flatpickr/flatpickr.js"></script>

    <!-- CHART JS -->
    <script defer src="/homs/non_module_libraries/chartjs/chart.umd.min.js"></script>
    <script defer src="/homs/non_module_libraries/chartjs/chartjs-adapter-date-fns.bundle.min.js"></script>

    <!-- DATATABLES -->
    <script defer src="/homs/non_module_libraries/datatables/datatables.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/homs/non_module_libraries/datatables/datatables.min.css">
    
    <!-- FONT AWESOME -->
    <link href="/homs/non_module_libraries/fontawesome/css/fontawesome.css" rel="stylesheet" />
    <link href="/homs/non_module_libraries/fontawesome/css/brands.css" rel="stylesheet" />
    <link href="/homs/non_module_libraries/fontawesome/css/solid.css" rel="stylesheet" />

    <!-- SELECT2 -->
    <link href="/homs/non_module_libraries/select2/select2.min.css" rel="stylesheet" />
    <script defer src="/homs/non_module_libraries/select2/select2.min.js"></script>

</head>
<body>
    <?php
    //Initialize Components
    require_once __DIR__ . '/views/components/buttons.php';
    require_once __DIR__ . '/views/components/textboxes.php';
    require_once __DIR__ . '/views/components/selects.php';
    require_once __DIR__ . '/views/components/dropdowns.php';
    require_once __DIR__ . '/helpers/MSQLServer.php';
    
    $button = new Buttons();
    $textbox = new Textboxes();
    $select = new Selects();
    $dropdown = new Dropdowns();


    // Router

    // Define routes and their corresponding callback functions
    $routes = [
        '/homs/' => function() {
            include __DIR__ . '/views/pages/home.php';
        },
        '/homs/comptest' => function() {
            include __DIR__ . '/tests/components-view.php';
        },
        '/homs/contact' => function() {
            echo "Contact us at: contact@example.com";
        },
        '/homs/production/upload_pol' => function() {
            include __DIR__ . '/views/pages/production/upload_pol.php';
        },
        '/homs/production/work_center' => function() {
            include __DIR__ . '/views/pages/production/wc_selection.php';
        },
        '/homs/production/export_reports' => function() {
            include __DIR__ . '/views/pages/production/export_reports.php';
        },
        '/homs/production/wc_selection' => function() {
            include __DIR__ . '/views/pages/production/wc_selection.php';
        },
        '/homs/production/details' => function() {
            include __DIR__ . '/views/pages/production/details.php';
        },
        '/homs/production/history' => function() {
            include __DIR__ . '/views/pages/production/edit_history.php';
        },
        '/homs/graphs' => function() {
            include __DIR__ . '/views/pages/graphs/graphs.php';
        },
        '/homs/production/output' => function() {
            include __DIR__ . '/views/pages/production/hourly_output_view.php';
        },
        '/homs/admin/reasons' => function() {
            include __DIR__ . '/views/pages/admin/reasons.php';
        },
        '/homs/admin/workcenters' => function() {
            include __DIR__ . '/views/pages/admin/workcenters.php';
        },
        '/homs/admin/st' => function() {
            include __DIR__ . '/views/pages/admin/stmanagement.php';
        },
        '/homs/admin/esp_management' => function() {
            include __DIR__ . '/views/pages/admin/esp_management.php';
        },

        '/homs/manual' => function() {
            include __DIR__ . '/views/pages/manual/manual.php';
        },

        '/homs/admin/breaktime_management' => function() {
            include __DIR__ . '/views/pages/admin/breaktime_management.php';
        },
    ];

    // Get the current path
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Check if the path exists in the routes
    if (array_key_exists($path, $routes)) {
        // Call the associated function
        
        $routes[$path]();
    } else {
        // Handle 404 Not Found
        http_response_code(404);
        include __DIR__ . '/views/pages/404.php';
    }

    ?>
</body>