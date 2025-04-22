<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/POLController.php";

class UploadPOL extends API
{
    public function __construct() {
        parent::__construct(new POLController());
    }

    public function index($data, $additional) {
        
        $this->validation->requiredFields($data["file"], ["name", "type", "tmp_name", "size"]);
        $this->validation->requiredFields($additional, ["user_EmpNo", "section", "is_additional"]);
        $data = array_merge($data["file"], $additional);

        $this->post($data);
    }
}
$api = new UploadPOL();
$api->index($_FILES, $_POST);