<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/POLController.php";

class GetPOLLastUpdate extends API
{
    public function __construct() {
        parent::__construct(new POLController());
    }

    public function get($data = null) {

        $this->validation->requiredFields($data, ["section"]);
        $section = strtolower($data["section"]);
        
        try {
            $response = $this->controller->getPOLUpdate($section); ;
            return $this->jsonResponse($response);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
$api = new GetPOLLastUpdate();

$api->get($_GET);