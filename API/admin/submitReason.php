<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ReasonController.php";

class SubmitReasons extends API
{
    public function __construct() {
        parent::__construct(new ReasonController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["name", "category", "creator"]);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new SubmitReasons();
$api->index($data);