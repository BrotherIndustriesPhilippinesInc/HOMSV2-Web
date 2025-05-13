<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class UploadWorkcenter extends API
{
    public function __construct() {
        parent::__construct(new WorkcenterController());
    }

    public function index($data, $additional) {
        
        $this->validation->requiredFields($data["file"], ["name", "type", "tmp_name", "size"]);
        $this->validation->requiredFields($additional, ["creator"]);
        $data = array_merge($data["file"], $additional);

        
        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->uploadWorkcenters($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
        
    }
}
$api = new UploadWorkcenter();
$api->index($_FILES, $_POST);