<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ESPController.php";

class SubmitESP extends API
{
    public function __construct() {
        parent::__construct(new ESPController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["mac_address", "creator", "esp_name"]);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new SubmitESP();
$api->index($data);