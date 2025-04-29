<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ReasonController.php";

class UpdateReasons extends API
{
    public function __construct() {
        parent::__construct(new ReasonController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["id","name", "category", "creator"]);
        $id = $data["id"];
        unset($data["id"]);
        
        $this->put($id, $data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateReasons();
$api->index($data);