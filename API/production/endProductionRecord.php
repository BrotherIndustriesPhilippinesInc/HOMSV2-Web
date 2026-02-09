<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ . "/../../controllers/ProductionController.php";
require_once __DIR__ . "/../../controllers/ESPController.php";

class EndInsertRecord extends API
{
    protected ESPController $espController;

    public function __construct()
    {
        parent::__construct(new ProductionController());
        $this->espController = new ESPController();
    }

    public function index($data)
    {
        $requiredFields = [
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

        // Normalize section
        if (strtolower($data["section"]) === "bps") {
            $data["section"] = "TC";
        }

        try {
            $debugData = $this->debugRequestData($data);

            /* ===============================
               NORMALIZE ACTUAL QUANTITY
               =============================== */

            $rawActual = $data["actual_quantity"];

            // Always normalize to array
            if (is_array($rawActual)) {
                $actualArray = $rawActual;
            } else {
                $actualArray = [
                    "manual" => (int)$rawActual
                ];
            }

            /* ===============================
               ESP HANDLING
               =============================== */

            $espIdInput = (string)$data["esp_id"];
            $resolvedEspId = 0;

            if ($espIdInput !== "0") {
                $esp = $this->espController
                    ->getAllWhere("esp_name = '{$espIdInput}'");

                $resolvedEspId = $esp[0]["id"] ?? 0;
            }

            $data["esp_id"] = $resolvedEspId;

            // Stop all running ESPs for this PO
            if ($resolvedEspId !== 0) {
                $runningEsps = $this->espController
                    ->getAllWhere("po_id = '{$data["po_id"]}' AND isrunning = true");

                foreach ($runningEsps as $value) {
                    $this->espController->update($value["id"], [
                        "line_name" => "N/A",
                        "area"      => "N/A",
                        "po"        => "N/A",
                        "isrunning" => 0,
                        "creator"   => $data["creator"],
                        "po_id"     => $data["po_id"],
                    ]);
                }
            }

            /* ===============================
               FLATTEN + CAST (BIGINT SAFE)
               =============================== */

            $data["actual_quantity"] = $actualArray;
            $data["actual_quantity_sum"] = (int) array_sum($actualArray);

            /* ===============================
               UPDATE PRODUCTION
               =============================== */

            $response = $this->controller->evaluatedUpdate($data);
            $this->checkError($response);

            return $this->jsonResponse($response, $debugData);

        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

$api = new EndInsertRecord();
$api->index($data);
