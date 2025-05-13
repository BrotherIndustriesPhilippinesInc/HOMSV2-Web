<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/STController.php";

class DeleteST extends API
{
    public function __construct() {
        parent::__construct(new STController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["id"]);
        $id = $data["id"];
        
        $this->delete($id);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new DeleteST();
$api->index($data);