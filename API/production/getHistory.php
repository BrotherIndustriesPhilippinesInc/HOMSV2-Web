<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetHistory extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["section"]);

        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }

        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->getHistory($data);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$api = new GetHistory();
$api->index($_GET);