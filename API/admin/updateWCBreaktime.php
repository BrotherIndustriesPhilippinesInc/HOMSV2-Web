<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/WorkcenterController.php";

class UpdateWCBreaktime extends API
{
    public function __construct() {
        parent::__construct(new WorkcenterController());
    }

    public function index($data){
        $this->validation->requiredFields($data, ["section", "line", "workcenter", "creator"]);
        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->updateWorkcenterBreaktime($data["section"], $data["line"], $data["workcenter"], $data["creator"], $data["dayNight"]);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateWCBreaktime();

$api->index($data); 