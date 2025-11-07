<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/TaktTimeController.php";

class UpdateTaktTimeV2 extends API
{
    public function __construct() {
        parent::__construct(new TaktTimeController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["id", "model_code", "takt_time", "creator", "section"]);
        $id = $data["id"];
        unset($data["id"]);
        
        $this->put($id, $data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateTaktTimeV2();
$api->index($data);