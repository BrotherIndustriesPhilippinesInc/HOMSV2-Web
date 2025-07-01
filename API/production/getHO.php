<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetHO extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data)
    {
        try {
            $filename = $this->controller->generateHOFile($data["wc"], $data["date"]); // Dynamically choose if needed
            $filepath = __DIR__ . "/../../resources/HO/Templates/" . $filename;

            if (!file_exists($filepath)) {
                http_response_code(404);
                echo "File not found.";
                exit;
            }
        } catch (Exception $e) {
            
        }
        

        // Force file download
        header('Content-Description: File Transfer');
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . basename($filepath) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filepath));

        // Clean output buffer and stream the file
        ob_clean();
        flush();
        readfile($filepath);
        exit;
    }



}
$api = new GetHO();
$api->index($_GET);