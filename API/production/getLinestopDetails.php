<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/LinestopController.php";

class GetLinestopDetails extends API
{
    public function __construct() {
        parent::__construct(new LinestopController());
    }


    public function index($data){
        $this->validation->requiredFields($data, ["id"]);
        $id = $data['id'];
        $this->get("id = '$id'");
        
    }
}
$api = new GetLinestopDetails();
$api->index($_GET);