<?php
class ErrorLog 
{
    public function returnErrors(string $subject, array|string $messages) {
        // Log errors for debugging
        if (is_array($messages)) {
            foreach ($messages as $key => $message) {
                if (is_array($message)) {
                    error_log($subject . " - " . $key . ": " . implode(", ", $message));
                } else {
                    error_log($subject . " - " . $key . ": " . $message);
                }
            }
        } else {
            error_log($subject . ": " . $messages);
        }

        // Ensure headers are set correctly
        if (!headers_sent()) {
            http_response_code(400);
            header('Content-Type: application/json');
        }

        // Return JSON error response
        echo json_encode([
            "error" => $subject,
            "messages" => $messages
        ]);

        exit(); // Stop execution to prevent further processing
    }
}
?>
