<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- LESS CSS -->
    <link rel="stylesheet/less" type="text/css" href="css/style.less" />
    <script defer src="node_modules/less/dist/less.min.js"></script>

    <!-- BOOSTRAP -->
    <link rel="stylesheet" href="modules/bootstrap/css/bootstrap.css">
    <script defer src="modules/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- SWEETALERT2 -->
    <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
</head>

<?php
//Components
require_once __DIR__ . '/views/components/buttons.php';
require_once __DIR__ . '/views/components/textboxes.php';
require_once __DIR__ . '/views/components/selects.php';

$button = new Buttons();
$textbox = new Textboxes();
$select = new Selects();
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
