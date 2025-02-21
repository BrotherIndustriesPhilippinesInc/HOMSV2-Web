<?php
require_once __DIR__ . '/../interfaces/ApiInterface.php';

abstract class BaseApi implements ApiInterface {
    protected function getRequestMethod() {
        return $_SERVER["REQUEST_METHOD"];
    }

    protected function getJsonInput() {
        return json_decode(file_get_contents("php://input"), true);
    }

    protected function response($data, $statusCode = 200) {
        http_response_code($statusCode);
        header("Content-Type: application/json");
        echo json_encode($data);
        exit;
    }

    public function handleRequest() {
        $method = $this->getRequestMethod();
        switch ($method) {
            case "GET":
                $this->get();
                break;
            case "POST":
                $this->post();
                break;
            case "PUT":
                $this->put();
                break;
            case "DELETE":
                $this->delete();
                break;
            default:
                $this->response(["error" => "Method not allowed"], 405);
        }
    }

    // Default response for unsupported methods
    public function get() {
        $this->response(["error" => "GET method not supported"], 405);
    }

    public function post() {
        $this->response(["error" => "POST method not supported"], 405);
    }

    public function put() {
        $this->response(["error" => "PUT method not supported"], 405);
    }

    public function delete() {
        $this->response(["error" => "DELETE method not supported"], 405);
    }
}

