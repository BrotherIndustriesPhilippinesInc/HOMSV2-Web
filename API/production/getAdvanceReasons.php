<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ProductionController.php";

class GetAdvanceReason extends API
{
    public function __construct() {
        parent::__construct(new ProductionController());
    }

    public function index($data)
    {
        $this->validation->requiredFields($data, ["row_id"]);

        $rowID = $data["row_id"];

        try {
            $reasons = $this->controller->get("id = $rowID"); // Dynamically choose if needed

            /* ONLY RETURN advance_reasons column */
           $return_value = [

                "advance_reasons" => json_decode($reasons["advance_reasons"]),
                "linestop_reasons" => json_decode($reasons["linestop_reasons"])

            ];

            return $this->jsonResponse($return_value);
        } catch (Throwable $th) {
            return $this->errorResponse($th);
        }

    }

    
}
$api = new GetAdvanceReason();
$api->index($_GET);