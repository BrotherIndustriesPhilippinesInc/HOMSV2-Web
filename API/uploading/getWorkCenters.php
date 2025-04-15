<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/POLController.php";

class GetWorkCenters extends API
{
    public function __construct() {
        parent::__construct(new POLController());
    }

    public function get($where = null) {
        try {
            $response = $this->controller->getWorkCenters() ;
            return $this->jsonResponse($response);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
$api = new GetWorkCenters();
$api->get();