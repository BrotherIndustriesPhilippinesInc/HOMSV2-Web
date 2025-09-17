<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetProductionDetailsViaID extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["id"]);
        $id = $data['id'];
        $this->get("id = '$id'");
        
    }
}
$api = new GetProductionDetailsViaID();
$api->index($_GET);