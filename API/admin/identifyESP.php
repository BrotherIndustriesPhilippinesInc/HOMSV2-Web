<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ESPController.php";

class IdentifyESP extends API
{

    public function __construct() {
        parent::__construct(new ESPController());
    }

    public function index($data){
        $requiredFields = ["mac_address"];
        $this->validation->requiredFields($data, $requiredFields);

        $mac_address = $data["mac_address"];
        $this->get($mac_address);
    }


    public function get(string $where = null) {
        try {
            $debugData = $this->debugRequestData($where);
            $response =$this->controller->getAll();

            /* RETURN DATA WITH THE INDICATED MAC ADDRESS */
            if ($where !== null) {
                $response = array_filter($response, function($item) use ($where) {
                    return strpos($item['mac_address'], $where) !== false;
                });
            }
            
            if (empty($response)) {
                throw new Exception("No data found for the given MAC address.");
            }
            
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
    
}
$api = new IdentifyESP();
$api->index($_GET);