<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class GetWorkcenters extends API
{

    public function __construct() {
        parent::__construct(new WorkcenterController());
    }


    public function index(){
        $this->get();
    }
}
$api = new GetWorkcenters();
$api->index();