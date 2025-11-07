<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/TaktTimeController.php";

class GetSpecificTaktTimeV2 extends API
{


    public function __construct() {
        parent::__construct(new TaktTimeController());
    }

    public function index($data){
        $this->get("id = " . $data["id"]);
    }
}
$api = new GetSpecificTaktTimeV2();
$api->index($_GET);