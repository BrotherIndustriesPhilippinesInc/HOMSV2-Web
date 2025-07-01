<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetSectionProduction extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["section", "date", "po"]);

        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }

        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->getSectionProduction($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$api = new GetSectionProduction();
$api->index($_GET);