<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class GetWorkcenterDetails extends API
{

    public function __construct() {
        parent::__construct(new WorkcenterController());
    }


    public function index($data = ""){

        $this->getAllWhere("workcenter = '$data[work_center]'");

    }
}
$api = new GetWorkcenterDetails();
$api->index($_GET);