<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/HistoryController.php";

class GetHistory extends API
{
    public function __construct() {
        parent::__construct(new HistoryController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["section"]);

        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }

        $this->get();
    }
}
$api = new GetHistory();
$api->index($_GET);