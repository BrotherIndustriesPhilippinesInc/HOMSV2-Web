<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/LinestopController.php";

class GetRecentLinestops extends API
{
    public function __construct() {
        parent::__construct(new LinestopController());
    }


    public function index($data){
        $this->validation->requiredFields($data, ["section"]);
        $section = $data['section'];
        try {
            $debugData = $this->debugRequestData($data);
            $response = $this->controller->getRecentLinestops($section);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$api = new GetRecentLinestops();
$api->index($_GET);