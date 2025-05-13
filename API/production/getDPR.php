<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetDPR extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data)
    {
        /* $this->validation->requiredFields($data, ["section"]);

        if (strtolower($data["section"]) === "bps") {
            $data["section"] = "TC";
        } */

        $filename = "DPR Format (No TT).xlsm"; // Dynamically choose if needed
        $filepath = __DIR__ . "/../../resources/DPR/Templates/" . $filename;

        if (!file_exists($filepath)) {
            http_response_code(404);
            echo "File not found.";
            exit;
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
$api = new GetDPR();
$api->index($_GET);