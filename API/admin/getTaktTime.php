<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/STController.php";

class GetTaktTime extends API
{

    public function __construct() {
        parent::__construct(new STController());
    }

    public function index($data){
        $item_code = $data["material"];
        $requiredFields = ["material"];
        $this->validation->requiredFields($data, $requiredFields);
        $this->get("item_code = '$item_code'");
    }
}
$api = new GetTaktTime();
$api->index($_GET);