<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/STController.php";

class UploadST extends API
{
    public function __construct() {
        parent::__construct(new STController());
    }

    public function index($data, $additional) {
        
        $this->validation->requiredFields($data["file"], ["name", "type", "tmp_name", "size"]);
        $this->validation->requiredFields($additional, ["creator"]);
        $data = array_merge($data["file"], $additional);

        
        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->uploadST($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
        
    }
}
$api = new UploadST();
$api->index($_FILES, $_POST);