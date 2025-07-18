<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";
require_once __DIR__ ."/../../controllers/ESPController.php";

class StartInsertRecord extends API
{
    private $espController;
    public function __construct() {
        parent::__construct(new ProductionController());
        $this->espController = new ESPController();

    }

    public function index($data){
        $requiredFields = 
        [
            "po_id", 
            "po", 
            "section",
            "work_center",
            "line_name",
            "area",
            "material",
            "description",
            "plan_quantity",
            "takt_time",
            "actual_quantity",
            "variance",
            "shift",
            "direct_operators",
            "start_time",
            "creator",

            "esp_id",
            "hourly_plan",

            "commulative_plan",
            "commulative_actual",
        ];
        
        $this->validation->requiredFields($data, $requiredFields);

        unset($data["production_status"]);
        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }

        $esp_details = $this->espController->get("id = '{$data["esp_id"]}'");

        $esp_id = $esp_details["id"] ?? 0;
        $espUpdate = [
            "line_name" => $data["line_name"],
            "area" => $data["area"],
            "po" => $data["po"],
            "isrunning" => 1,
            "creator" => $data["creator"],
            "po_id" => $data["po_id"],
        ];
        
        $this->espController->update($esp_id, $espUpdate);


        /* GENERATE UNIQUE SESSION ID */
        $data["unique_session"] = uniqid("session_", true);
        $this->post($data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new StartInsertRecord();
$api->index($data);