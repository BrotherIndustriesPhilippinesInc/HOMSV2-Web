<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class InsertDataFromESP extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){

        $this->validation->requiredFields($data, ["line", "area"]);

        try {
            $debugData = $this->debugRequestData($data);
            $response = $this->controller->updateActualQuantityViaESP($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$api = new InsertDataFromESP();
$api->index($_GET);