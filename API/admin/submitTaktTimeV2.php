<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/TaktTimeController.php";

class SubmitTaktTimeV2 extends API
{
    public function __construct() {
        parent::__construct(new TaktTimeController());
    }

    public function index($data){

        $this->validation->requiredFields($data, [
            "model_code",
            "takt_time",
            "section",
            "creator",
        ]);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new SubmitTaktTimeV2();
$api->index($data);