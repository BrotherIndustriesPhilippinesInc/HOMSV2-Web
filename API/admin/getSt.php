<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/STController.php";

class GetSt extends API
{

    public function __construct() {
        parent::__construct(new STController());
    }


    public function index(){
        $this->get();
    }
}
$api = new GetSt();
$api->index();