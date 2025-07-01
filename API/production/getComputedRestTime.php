<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/BreaktimeController.php";

class GetComputedRestTime extends API
{
    public function __construct() {
        parent::__construct(new BreaktimeController());
    }

    public function index($data)
    {
        $this->validation->requiredFields($data, ["section", "start_time", "end_time"]);

        try {
            $restTime = $this->controller->computeRestTime($data["section"], $data["start_time"], $data["end_time"]); // Dynamically choose if needed

            return $this->jsonResponse($restTime);
        } catch (Throwable $th) {
            return $this->errorResponse($th);
        }
        
    }
}
$api = new GetComputedRestTime();
$api->index($_GET);