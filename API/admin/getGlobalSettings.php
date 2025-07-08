<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/SettingsController.php";

class GetGlobalSettings extends API
{

    public function __construct() {
        parent::__construct(new SettingsController());
    }


    public function get(string $where = null) {
    try {
        $debugData = $this->debugRequestData($where);
        $response = $where === null ? $this->controller->getAll() : [$this->controller->get($where)];
        
        // Decode 'settings' field for each row
        foreach ($response as &$row) {
            if (isset($row['settings']) && is_string($row['settings'])) {
                $decoded = json_decode($row['settings'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $row['settings'] = $decoded;
                }
            }
        }

        // If you're fetching a single record (not an array), unwrap the first item
        if ($where !== null && isset($response[0])) {
            $response = $response[0];
        }

        return $this->jsonResponse($response, $debugData);
    } catch (Exception $e) {
        return $this->errorResponse($e);
    }
}

}
$api = new GetGlobalSettings();
$api->get();