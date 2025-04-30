<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class InsertRecord extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){
        if($data["production_action"] === "start"){
            $requiredFields = 
            [
                "po_id", 
                "po", 
                "section",
                "work_center",
                "line_name",
                "area",
                "material",
                "description",
                "plan_quantity",
                "takt_time",
                "actual_quantity",
                "variance",
                "shift",
                "direct_operators",
                "start_time",
                "creator",
            ];
        }elseif ($data["production_action"] === "end"){
            $requiredFields = 
            [
                "po_id", 
                "po", 
                "section",
                "work_center",
                "line_name",
                "area",
                "material",
                "description",
                "plan_quantity",
                "takt_time",
                "actual_quantity",
                "variance",
                "shift",
                "hourly_time",
                "direct_operators",
                "end_time",
                "creator",
            ];
        }else{
            return json_encode("status not match");
        }
        $this->validation->requiredFields($data, $requiredFields);

        unset($data["production_status"]);
        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }
        
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new InsertRecord();
$api->index($data);