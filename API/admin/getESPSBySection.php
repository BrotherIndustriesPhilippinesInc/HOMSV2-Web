<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ESPController.php";

class GetESPSBySection extends API
{
    public function __construct() {
        parent::__construct(new ESPController());
    }

    public function index($data){

        try {
           if($data["isAlreadyRunning"] === "true"){
                $this->validation->requiredFields($data, ["section", "isAlreadyRunning", "po_id"]);
           }else{
                $this->validation->requiredFields($data, ["section", "isAlreadyRunning"]);
           }
            
            $response = $this->controller->getESPSBySection($data['section'], $data['isAlreadyRunning'], $data['po_id'] ?? null);

            $this->checkError($response);

            return $this->jsonResponse($response);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
$api = new GetESPSBySection();
$api->index($_GET);