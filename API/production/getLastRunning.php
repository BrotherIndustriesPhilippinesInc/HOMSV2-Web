<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetLastRunning extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){
        
        $this->validation->requiredFields($data, ["section", "work_center", "po", "date"]);

        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->lastRun($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$api = new GetLastRunning();
$api->index($_GET);