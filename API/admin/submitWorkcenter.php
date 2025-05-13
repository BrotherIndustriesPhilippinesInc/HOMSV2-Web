<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class SubmitWorkcenter extends API
{
    public function __construct() {
        parent::__construct(new WorkcenterController());
    }

    public function index($data){
        
        $this->validation->requiredFields($data, ["section", "costcenter", "plant", "pattern", "costcenter_name", "workcenter", "line_name", "folder_name", "creator"]);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new SubmitWorkcenter();
$api->index($data);