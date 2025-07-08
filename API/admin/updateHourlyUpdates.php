<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/SettingsController.php";

class UpdateHourlyUpdates extends API
{
    public function __construct() {
        parent::__construct(new SettingsController());
    }

    public function index($data){

        $this->validation->requiredFields($data, ["sections", "creator"]);
        $id = 2;
        
        $data = [
            "settings"=> ["hourlyUpdates"=> ["sections"=> $data["sections"]]],
            "creator"=> $data["creator"]
        ];

        $this->put($id, $data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateHourlyUpdates();
$api->index($data);