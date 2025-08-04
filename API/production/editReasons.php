<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class EditReasons extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){

        $this->validation->requiredFields($data, ["creator"]);
        $id = $data["id"];
        unset($data["id"]);
        $this->put($id, $data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new EditReasons();
$api->index($data); 