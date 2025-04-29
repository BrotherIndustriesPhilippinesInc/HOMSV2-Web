<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ReasonController.php";

class GetReasons extends API
{
    public function __construct() {
        parent::__construct(new ReasonController());
    }

    public function index(){
        $this->get();
    }
}
$api = new GetReasons();
$api->index();