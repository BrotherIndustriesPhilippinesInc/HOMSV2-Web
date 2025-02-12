<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- JQUERY -->
    <script defer src="/node_modules/jquery/dist/jquery.min.js"></script>

    <!-- LESS CSS -->
    <link rel="stylesheet/less" type="text/css" href="/css/style.less" />
    <script defer src="/node_modules/less/dist/less.min.js"></script>

    <!-- BOOSTRAP -->
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
    <script defer src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <!-- POPPER -->
    <script defer src="/non_module_libraries/popper/popper.min.js"></script>

    <!-- SWEETALERT2 -->
    <script src="/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>

    <!-- MAINSCRIPT -->
    <script type="module" defer src="/js/main-script.js"></script>

    <!-- UPPY -->
    <link href="https://releases.transloadit.com/uppy/v4.13.2/uppy.min.css" rel="stylesheet"/>

    <!-- FLATPICKR -->
    <!-- <link rel="stylesheet" href="/non_module_libraries/flatpickr/flatpickr.min.css">
    <script src="/non_module_libraries/flatpickr/flatpickr.min.js" defer></script> -->
    <link rel="stylesheet" type="text/css" href="https://npmcdn.com/flatpickr/dist/themes/dark.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    
</head>
<body>
    <?php
    //Initialize Components
    require_once __DIR__ . '/views/components/buttons.php';
    require_once __DIR__ . '/views/components/textboxes.php';
    require_once __DIR__ . '/views/components/selects.php';
    require_once __DIR__ . '/views/components/dropdowns.php';
    
    $button = new Buttons();
    $textbox = new Textboxes();
    $select = new Selects();
    $dropdown = new Dropdowns();


    // Router

    // Define routes and their corresponding callback functions
    $routes = [
        '/' => function() {
            include __DIR__ . '/views/pages/home.php';
        },
        '/comptest' => function() {
            include __DIR__ . '/tests/components-view.php';
        },
        '/contact' => function() {
            echo "Contact us at: contact@example.com";
        },
        '/production/upload_pol' => function() {
            include __DIR__ . '/views/pages/production/upload_pol.php';
        },
        '/production/wc_selection' => function() {
            include __DIR__ . '/views/pages/production/wc_selection.php';
        },
        '/production/details' => function() {
            include __DIR__ . '/views/pages/production/details.php';
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