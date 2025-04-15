<?php 
require __DIR__ . "/ErrorLog.php";

class Validation
{
    private ErrorLog $errorLog;

    public function __construct() {
        $this->errorLog = new ErrorLog();
    }

    public function requiredFields($data, array $required_fields) {
        $errors = ["missing_fields" => []];

        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                $errors["missing_fields"][] = $field; // Append missing field
            }
        }

        if (!empty($errors["missing_fields"])) {
            // Return all missing fields to frontend and stop execution
            $this->errorLog->returnErrors("RequiredFields", $errors);
        }

        return true; // No missing fields, continue execution
    }
}
?>
