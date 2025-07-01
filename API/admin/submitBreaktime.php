<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/BreaktimeController.php";

class SubmitBreaktime extends API
{
    public function __construct() {
        parent::__construct(new BreaktimeController());
    }

    public function index($data){
        $this->validation->requiredFields($data, [
            "breaktime_name", 
            "shift", 
            "start_time", 
            "end_time", 
            "section", 
            "line", 
            "area", 
            "isOvertime", 
            "creator"
        ]);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new SubmitBreaktime();
$api->index($data);