<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ESPController.php";

class GetESPS extends API
{
    public function __construct() {
        parent::__construct(new ESPController());
    }

    public function index(){
        $this->get();
    }

    public function get(string $where = null) {
        try {
            $debugData = $this->debugRequestData($where);
            $response = $where === null ? $this->controller->getAll() : $this->controller->get($where);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
$api = new GetESPS();
$api->index();