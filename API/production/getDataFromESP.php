<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetDataFromESP extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data){

        $this->get("creator = 'ESP'", "ORDER BY id DESC LIMIT 1");
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new GetDataFromESP();
$api->index($data);