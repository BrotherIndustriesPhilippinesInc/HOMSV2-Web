<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class UpdateWorkcenter extends API
{
    public function __construct() {
        parent::__construct(new WorkcenterController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["id","section", "costcenter", "plant", "pattern", "costcenter_name", "workcenter", "line_name", "folder_name", "creator"]);
        $id = $data["id"];
        unset($data["id"]);
        
        try {
            $result = $this->controller->updateWorkcenter($id, $data);
            $this->checkError($result);
            $this->jsonResponse($result);
        } catch (Exception $th) {
            $this->errorResponse($th);
        }
            
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateWorkcenter();
$api->index($data);