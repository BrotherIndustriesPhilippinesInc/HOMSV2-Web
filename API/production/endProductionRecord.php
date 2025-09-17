<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";
require_once __DIR__ ."/../../controllers/ESPController.php";

class EndInsertRecord extends API
{
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
            "hourly_time",
            "direct_operators",
            "end_time",
            "creator",

            "esp_id",
            "hourly_plan",

            "islinestop"
        ];
        
        $this->validation->requiredFields($data, $requiredFields);

        unset($data["production_status"]);
        if(strtolower($data["section"]) === "bps"){
            $data["section"] = "TC";
        }
        
        try {
            $debugData = $this->debugRequestData($data); // Capture request data

            //get esp id via sensor name
            $esp_details = $this->espController->getAllWhere("esp_name = '{$data["esp_id"]}'");

            $tempActual = $data["actual_quantity"];

            $data["actual_quantity"] = [];
            $data["esp_id"] = $esp_details[0]["id"] ?? 0;

            if($data["esp_id"] === 0){
                //MANUAL
                $data["actual_quantity"]["manual"] = $tempActual;

            }else{
                //ESP
                $esp_details = $this->espController->getAllWhere("po_id = '{$data["po_id"]}' AND isrunning = true");
                    foreach ($esp_details as $key => $value) {
                        $espUpdate = [
                        "line_name" => "N/A",
                        "area" => "N/A",
                        "po" => "N/A",
                        "isrunning" => 0,
                        "creator" => $data["creator"],
                        "po_id" => $data["po_id"],
                    ];
                    $this->espController->update($value["id"], $espUpdate);
                }

            }

            $response = $this->controller->evaluatedUpdate($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, associative: true);
$api = new EndInsertRecord();
$api->index($data);