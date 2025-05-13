<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/HistoryController.php";

class SubmitEditHistory extends API
{
    public function __construct() {
        parent::__construct(new HistoryController());
    }

    public function index($data){

        $this->validation->requiredFields($data, ["creator", "old_data", "new_data"]);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new SubmitEditHistory();
$api->index($data);