<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetLastRunning extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){
        
        $this->validation->requiredFields($data, ["date", "section", "work_center"]);
        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }
        return $this->get("time_created::date = '{$data['date']}' AND section = '{$data['section']}' AND work_center = '{$data['work_center']}'");
    }
}
$api = new GetLastRunning();
$api->index($_GET);
/* IM HEEEEEEEEEEEEEEEERERRRRRRR */