<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/POLController.php";

class GetPODetails extends API
{
    public function __construct() {
        parent::__construct(new POLController());
    }

    public function index($data = null) {

        $this->validation->requiredFields($data, ["poID", "section"]);
        $section = $data["section"];
        $po = $data["poID"];

        try {
            $response = $this->controller->getPODetails($section, $po);
            return $this->jsonResponse($response);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
$api = new GetPODetails();
$api->index($_GET);