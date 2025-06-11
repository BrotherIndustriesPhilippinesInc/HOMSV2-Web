<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ESPController.php";
require_once __DIR__ ."/../../controllers/POLController.php";

class UpdateESP extends API
{
    private $polController;

    public function __construct() {
        parent::__construct(new ESPController());
        $this->poController = new POLController();
    }

    public function index($data){
        $this->validation->requiredFields($data, ["id","esp_name", "mac_address", "creator"]);
        $id = $data["id"];
        unset($data["id"]);

        $po = $data["po"] ?? null;
        /* Check if theres 'po' key */
        if (array_key_exists("po", $data)) {
            /* Get po id */
             $section = $data["section"];
             $data["po_id"] = $this->polController->getPODetails($section, $po);
        }
        
        $this->put($id, $data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateESP();
$api->index($data);