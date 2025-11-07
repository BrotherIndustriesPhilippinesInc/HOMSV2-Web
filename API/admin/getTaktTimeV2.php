<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/TaktTimeController.php";

class GetTaktTimeV2 extends API
{


    public function __construct() {
        parent::__construct(new TaktTimeController());
    }

    public function index(){
        $this->get();
    }
}
$api = new GetTaktTimeV2();
$api->index();