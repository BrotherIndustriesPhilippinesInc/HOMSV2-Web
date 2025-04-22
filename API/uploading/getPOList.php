<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/POLController.php";

class GetPOList extends API
{
    public function __construct() {
        parent::__construct(new POLController());
    }

    public function get($data = null) {

        $this->validation->requiredFields($data, ["wc","section"]);
        $section = $data["section"];
        $wc = $data["wc"];

        try {
            $response = $this->controller->getPOList($section, $wc);
            return $this->jsonResponse($response);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
$api = new GetPOList();
$api->get($_GET);