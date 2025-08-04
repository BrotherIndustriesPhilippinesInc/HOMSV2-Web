<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class GetWorkcenters extends API
{

    public function __construct() {
        parent::__construct(new WorkcenterController());
    }

    public function index($data = ""){

        /* $this->validation->requiredFields($data, ["section", "workcenter"]); */

        if(isset($data["workcenter"])){
            $this->get("workcenter ILIKE  '$data[workcenter]' AND section ILIKE '$data[section]'");
        }else{
             $response = $this->controller->getWorkcentersFromViews();
             return $this->jsonResponse($response);
        }
    }
}

$api = new GetWorkcenters();
$api->index($_GET);