<?php
require __DIR__ . '/../interfaces/IAPI.php';
require __DIR__ . '/../controllers/Controller.php';
require __DIR__ .'/../helpers/Validation.php';

abstract class API implements IAPI {
    protected object $controller;
    protected Validation $validation;
    protected bool $development;

    public function __construct(object $controller, bool $development = false) {
        $this->controller = $controller;
        $this->validation = new Validation;
        $this->development = $development;
        header("Content-Type: application/json"); // Set JSON response header
    }

    /**
     * Capture and log request data in development mode
     */
    protected function debugRequestData($data) {
        if ($this->development) {
            error_log("Incoming API Data: " . json_encode($data, JSON_PRETTY_PRINT)); // Log the data
            return $data; // Can be returned in the response for debugging
        }
        return null;
    }

    public function get(string $where = null) {
        try {
            $debugData = $this->debugRequestData($where);
            $response = $where === null ? $this->controller->getAll() : $this->controller->get($where);
            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function post(array $data) {
        try {
            $debugData = $this->debugRequestData($data); // Capture request data
            $response = $this->controller->create($data);
            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }

    public function put($id, array $data) {
        try {
            $debugData = $this->debugRequestData($data);
            $response = $this->controller->update($id, $data);
            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }

    public function patch($id, array $data) {
        try {
            $debugData = $this->debugRequestData($data);
            $response = $this->controller->partialUpdate($id, $data);
            return $this->jsonResponse($response, $debugData);
        } catch (Exception $e) {
            return $this->errorResponse($e, $data);
        }
    }

    public function delete($id) {
        try {
            return $this->jsonResponse($this->controller->delete($id));
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    /**
     * Returns API response. If development mode is enabled, includes input data.
     */
    protected function jsonResponse($data, $inputData = null) {
        $response = [
            "status" => "success",
            "data" => $data
        ];

        if ($this->development && $inputData !== null) {
            $response["input_data"] = $inputData;
        }

        echo json_encode($response, JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Handles error responses.
     */
    protected function errorResponse(Exception $e, $inputData = null) {
        error_log("API Error: " . $e->getMessage());

        $response = [
            "status" => "error",
            "message" => "An error occurred while processing your request."
        ];

        if ($this->development) {
            $response["details"] = $e->getMessage();
        }

        if ($this->development && $inputData !== null) {
            $response["input_data"] = $inputData;
        }

        http_response_code(500);
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit;
    }
}

